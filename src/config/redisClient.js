import Redis from 'ioredis'

export const  redisClient = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
   maxRetriesPerRequest: null
})

redisClient.set('mykey', 'Hello, Redis!')
redisClient.get('mykey').then(result => {
  console.log('Redis says:', result)
})
