import { Worker, Queue } from 'bullmq'
import { redisConfig } from '../config/redisClient.js'
import { userRepository } from '../repository/userRepository.js'
import { generate } from '../services/geminiService.js'
import GeminiResponseUseCase from '../use-cases/user/geminResponseUseCase.js'

const queue = new Queue('geminiQueue', { connection: redisConfig })

const worker = new Worker(
  'geminiQueue',
  async job => {
    try {
      const { message, id } = job.data
      console.log('this is worker', message)

      const { stream, response } = await generate(message)

      let fullText =
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."

      for await (const chunk of response.stream) {
        const chunkText = chunk.text()
        fullText += chunkText
        await job.updateProgress({ chunk: chunkText, full: fullText })
      }
      const geminiResponseUseCase = new GeminiResponseUseCase(
        id,
        fullText,
        message
      )
      return { success: true, response: fullText }
    } catch (err) {
      console.error(`Job ${job.id} failed:`, err)
      throw err
    }
  },
  {
    connection: redisConfig,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000
      }
    }
  }
)

export default worker

worker.on('ready', async () => {
  console.log('Worker is ready, checking for failed jobs...')

  const failedJobs = await queue.getFailed()
  console.log(`Found ${failedJobs.length} failed jobs`)

  for (const job of failedJobs) {
    await job.retry()
    console.log(`Retrying job ${job.id}`)
  }
})
