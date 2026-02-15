import { manageAccessToken } from '../utils/jwt.ts'
import type { Request, Response } from 'express'
import { logger } from '../config/logger.ts'

type GraphQLContext = {
  req: Request
  res: Response
  uid?: number
}

const createContext = async ({ req, res }: { req: Request; res: Response }) => {
  const context: GraphQLContext = { req, res }

  try {
    const authHeader = req.headers.authorization
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null

    if (!token) return context

    try {
      const payload = manageAccessToken.verify(token)
      if (typeof payload !== 'string') context.uid = payload.uid
    } catch (e) { // Token invalid or expired
      // refresh via REST /auth/refresh
      logger.error('Token Validation error!', e);
    }
  } catch (e) {
    logger.error('Context creation error!', e)
  }

  return context
}

export { type GraphQLContext, createContext }