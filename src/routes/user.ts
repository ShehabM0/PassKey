import { vefrifyEmail, sendVerification, resetPassword, verifyResetPassword, updatePassword, verifyUpdatePassword } from '../controllers/user.ts'
import { authMiddleware, authorizeUser } from '../middleware/auth.ts'
import express from 'express'

const usersRoutes = express.Router()

usersRoutes.get('/:id/email/verify', authMiddleware, authorizeUser, sendVerification)
usersRoutes.get('/:id/email/verify/:token', authMiddleware, authorizeUser, vefrifyEmail)

usersRoutes.post('/password/reset', resetPassword)
usersRoutes.post('/:id/password/reset/:token', verifyResetPassword)

usersRoutes.patch('/password/update/', authMiddleware, authorizeUser, updatePassword)
usersRoutes.get('/password/update/:token', authMiddleware, authorizeUser, verifyUpdatePassword)

export default usersRoutes
