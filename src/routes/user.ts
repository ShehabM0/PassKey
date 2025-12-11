import { vefrifyEmail, sendVerification, resetPassword, verifyResetPassword } from '../controllers/user.ts'
import { authMiddleware, authorizeUser } from '../middleware/auth.ts'
import express from 'express'

const usersRoutes = express.Router()

usersRoutes.get('/:id/email/verify', authMiddleware, authorizeUser, sendVerification)
usersRoutes.get('/:id/email/verify/:token', authMiddleware, authorizeUser, vefrifyEmail)

usersRoutes.post('/password/reset', resetPassword)
usersRoutes.post('/:id/password/reset/:token', verifyResetPassword)

export default usersRoutes
