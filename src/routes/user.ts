import { vefrifyEmail, sendVerification } from '../controllers/user.ts'
import { authMiddleware, authorizeUser } from '../middleware/auth.ts'
import express from 'express'

const usersRoutes = express.Router()

usersRoutes.get('/:id/email/send-verification', authMiddleware, authorizeUser, sendVerification)
usersRoutes.get('/:id/email/verify/:token', authMiddleware, authorizeUser, vefrifyEmail)

export default usersRoutes
