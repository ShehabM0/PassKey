import { signIn, signUp, singOut, refresh } from '../controllers/auth.ts'
import { guestMiddleware } from '../middleware/arcjet.ts'
import express from 'express'

const authRoutes = express.Router()

authRoutes.post('/sign-up', guestMiddleware, signUp)
authRoutes.post('/sign-in', guestMiddleware, signIn)
authRoutes.post('/refresh', guestMiddleware, refresh)
authRoutes.post('/sign-out', guestMiddleware, singOut)

export default authRoutes