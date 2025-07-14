import { Worker, Queue } from 'bullmq'
import { redisClient } from '../config/redisClient.js'
import { userRepository } from '../repository/userRepository.js'
import { generate } from '../services/geminiService.js'
import GeminiResponseUseCase from '../use-cases/user/geminResponseUseCase.js'
import { dbConnection } from '../config/database.js'
await dbConnection()

const queue = new Queue('geminiQueue', { connection: redisClient })

const worker = new Worker(
  'geminiQueue',
  async job => {
    try {
      const { message, id } = job.data

      const response = await generate(message)
      const geminiText =
        response?.candidates?.[0]?.content?.parts?.[0]?.text || 'No text'
      const geminiResponseUseCase = new GeminiResponseUseCase(
        id,
        geminiText,
        message
      )

      
      return { success: true }
    } catch (err) {
      console.error(`Job ${job.id} failed:`, err)
      throw err
    }
  },
  {
    connection: redisClient,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000
      }
    }
  }
)

worker.on('ready', async () => {
  console.log('Worker is ready, checking for failed jobs...')

  const failedJobs = await queue.getFailed()
  console.log(`Found ${failedJobs.length} failed jobs`)

  for (const job of failedJobs) {
    await job.retry()
    console.log(`Retrying job ${job.id}`)
  }
})
