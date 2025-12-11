import { manageAccessToken, manageRefreshToken } from '../utils/jwt.ts'
import type { Request, Response, NextFunction } from 'express'
import { rotateRefreshToken } from '../services/auth.ts'
import { logger } from '../config/logger.ts'
import { cookies } from '../utils/cookis.ts'

declare global {
  namespace Express {
    interface Request {
      userId?: number
    }
  }
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    let token

    if (authHeader && authHeader.startsWith('Bearer '))
      token = authHeader.substring(7)

    if (!token)
      return res.status(401).json({ message: 'Authentication required, No token provided!' })

    try {
      const payload = manageAccessToken.verify(token)
      
      if (typeof payload !== 'string')
        req.userId = payload.uid

      next()
    } catch (e) {
      if (e instanceof Error && e.message === 'Token Verification failed!') {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken)
          return res.status(401).json({ message: 'Access token expired. Refresh token required!' })

        try {
          const payload = manageRefreshToken.verify(refreshToken)
          
          if (typeof payload === 'string')
            return res.status(401).json({ message: 'Invalid refresh token!' })

          const userId = payload.uid

          const { newAccessToken, newRefreshToken } = await rotateRefreshToken(userId, refreshToken)
          cookies.set(res, 'accessToken', newAccessToken)
          cookies.set(res, 'refreshToken', newRefreshToken)
          req.userId = userId

          next()
        } catch (e) {
          if (e instanceof Error && e.message === 'Token Verification failed!') {
            return res.status(401).json({ message: 'Refresh token expired or invalid!' })
          }
          logger.error('Refresh token error!', e)
          return res.status(401).json({ message: 'Invalid refresh token!' })
        }
      } else {
        throw e
      }
    }
  } catch (e) {
    logger.error('Authentication error!', e)
    return res.status(500).json({ message: 'Internal server error!' })
  }
}

const authorizeUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const uid = req.userId
    const reqUid = Number(req.params.id)

    if (uid && uid !== reqUid)
      return res.status(403).json({ message: 'Forbidden. You can only access your own resources!' })

    next()
  } catch (e) {
    logger.error('Authorization middleware error', e)
    return res.status(500).json({ message: 'Internal server error!' })
  }
}

export { authMiddleware, authorizeUser }