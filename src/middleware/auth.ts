import type { Request, Response, NextFunction } from 'express'
import { manageAccessToken } from '../utils/jwt.ts'
import { logger } from '../config/logger.ts'

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

    const payload = manageAccessToken.verify(token)
    
    if (typeof payload === 'string')
      return res.status(401).json({ message: 'Invalid token!' })

    req.userId = payload.uid
    
    next()
  } catch (e) {
    if (e instanceof Error && e.message === 'Token Verification failed!') {
      return res.status(401).json({ message: e.message })
    }
    
    logger.error('Authentication error!', e)
    return res.status(500).json({ message: 'Internal server error!' })
  }
}

const authorizeUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const uid = req.userId
    const reqUid = Number(req.params.id)

    if (reqUid && uid !== reqUid)
      return res.status(403).json({ message: 'Forbidden. You can only access your own resources!' })

    next()
  } catch (e) {
    logger.error('Authorization middleware error', e)
    return res.status(500).json({ message: 'Internal server error!' })
  }
}

export { authMiddleware, authorizeUser }