import { vefrifyEmail, sendVerification } from '../controllers/user.ts'
import express from 'express'

const usersRoutes = express.Router()

usersRoutes.get('/:id/email/send-verification', sendVerification)
usersRoutes.get('/:id/email/verify/:token', vefrifyEmail)

export default usersRoutes
