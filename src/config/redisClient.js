import Redis from 'ioredis'

export const redisConfig = {
  username: 'default',
  password: process.env.REDIS_PASSWORD || process.env.REDIS_PASSWORD_CLOUD,
  host: process.env.REDIS_LOCALHOST,
  port: 6379,
  maxRetriesPerRequest: null,
}

export const redisClient = new Redis(redisConfig)

redisClient.on('error', err => console.log('Redis Client Error', err))

redisClient.set('mykey', 'Hello, Redis!')
redisClient.get('mykey').then(result => {
  console.log('Redis says:', result)
})

