import { Queue } from 'bullmq'
import { redisConfig } from './redisClient.js' 

export const queue = new Queue('geminiQueue', {
  connection: redisConfig
})

queue.on('error', err => console.log('Queue Error:', err))
console.log('Queue initialized:', queue.name)