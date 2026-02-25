import { verifyEmail, sendVerification, requestPasswordReset, passwordReset, updatePassword, verifyUpdatePassword, verifyPassword, currentUser } from '../controllers/user.ts'
import { authMiddleware, authorizeUser } from '../middleware/auth.ts'
import express from 'express'

const usersRoutes = express.Router()

usersRoutes.get('/me', authMiddleware, authorizeUser, currentUser);

usersRoutes.post('/email/verify', authMiddleware, authorizeUser, sendVerification)
usersRoutes.post('/email/verify/:token', authMiddleware, authorizeUser, verifyEmail)

usersRoutes.post('/password/request-reset', requestPasswordReset)
usersRoutes.post('/password/reset/:token', passwordReset)

usersRoutes.patch('/password/update', authMiddleware, authorizeUser, updatePassword)
usersRoutes.post('/password/update/:token', authMiddleware, authorizeUser, verifyUpdatePassword)

usersRoutes.post('/password/verify', authMiddleware, authorizeUser, verifyPassword)

export default usersRoutes
