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
      console.log("this is worker", message);
      
      const response = await generate(message) 
      const geminiText =
        response?.candidates?.[0]?.content?.parts?.[0]?.text || 'No text'
      const geminiResponseUseCase = new GeminiResponseUseCase(
        id,
        geminiText,
        message
      )
     
      console.log(geminiText);
      
      return { success: true }
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
