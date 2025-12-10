import type { Request, Response, NextFunction } from 'express'
import { aj } from '../config/arcjet.ts'
import { logger } from '../config/logger.ts'

const ajMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const decision = await aj.protect(req, { requested: 1 })

    logger.warn("Arcjet decision", {
      id: decision.id,
      conclusion: decision.conclusion,
      reason: decision.reason,
      ip: decision.ip,
    });

    if(decision.isDenied()) {
      if(decision.reason.isRateLimit())
        return res.status(429).json({ message: "Too many requests!", cooldown: decision.reason.resetTime })
      if(decision.reason.isBot())
        return res.status(403).json({ message: "Bot detected!" })
      return res.status(403).json({ message: "Request blocked!" })
    }
    next()
  } catch(e) {
    const message = e instanceof Error ? e.message : String(e);
    logger.error("Middleware error", message);
    next()
  }
};

export { ajMiddleware }