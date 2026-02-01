import { logger } from './logger.ts'
import { Redis } from 'ioredis'

const redis = new Redis(process.env.REDIS_URL!)

redis.on('connect', () => { logger.info('Redis connected') })
redis.on('error', (err) => { logger.error(`Redis error: ${err.message}`) })

export { redis }

