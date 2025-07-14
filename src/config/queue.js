import { Queue } from 'bullmq';
import { redisClient } from './redisClient.js';
export const queue = new Queue('geminiQueue', {
  connection:
   redisClient
  
});
