import { manageAccessToken, manageRefreshToken } from '../utils/jwt.ts'
import { rotateRefreshToken } from '../services/auth.ts'
import type { Request, Response } from 'express'
import { cookies } from '../utils/cookis.ts'
import { logger } from '../config/logger.ts'

type GraphQLContext= {
  req: Request
  res: Response
  uid?: number
}

const createContext = async ({ req, res }: { req: Request; res: Response }) => {
  const context: GraphQLContext = { req, res }

  try {
    const authHeader = req.headers.authorization
    let token

    if (authHeader && authHeader.startsWith('Bearer '))
      token = authHeader.substring(7)

    if (!token)
      return context

    try {
      const payload = manageAccessToken.verify(token)
      if (typeof payload !== 'string')
        context.uid = payload.uid
    } catch (e) {
      if (e instanceof Error && e.message === 'Token Verification failed!') {
        const refreshToken = req.cookies?.refreshToken
        if (refreshToken) {
          try {
            const payload = manageRefreshToken.verify(refreshToken)
            if (typeof payload !== 'string') {
              const userId = payload.uid
              const { newAccessToken, newRefreshToken } = await rotateRefreshToken(userId, refreshToken)
              cookies.set(res, 'accessToken', newAccessToken)
              cookies.set(res, 'refreshToken', newRefreshToken)
              context.uid = userId
            }
          } catch (e) {
            logger.error('Refresh token error in context!', e)
          }
        }
      }
    }
  } catch (e) {
    logger.error('Context creation error!', e)
  }

  return context
}

export { type GraphQLContext, createContext }