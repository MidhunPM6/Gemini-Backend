// src/middlewares/cacheMiddleware.js
import { redisClient } from '../config/redisClient.js'
import { StatusCodes } from '../utils/statusCodes.js'
export const cacheMiddleware = (keyBuilder, ttlSeconds = 300) => {
  return async (req, res, next) => {
    const cacheKey = keyBuilder(req)

    try {
      const cachedData = await redisClient.get(cacheKey)
    

      if (cachedData) {
        return res.status(StatusCodes.OK).json({
          data: JSON.parse(cachedData),
          message: 'Serving from cache'
        })
      }

      res.locals.cacheKey = cacheKey
      res.locals.cacheTTL = ttlSeconds

      next()
    } catch (err) {
      console.error('Redis cache error:', err)
      next()
    }
  }
}
