import { guestMiddleware } from '../middleware/arcjet.ts'
import { signIn, signUp } from '../controllers/auth.ts'
import express from 'express'

const authRoutes = express.Router()

authRoutes.post('/sign-up', guestMiddleware, signUp)
authRoutes.post('/sign-in', guestMiddleware, signIn)

export default authRoutes