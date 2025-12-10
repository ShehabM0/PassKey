import { signIn, signUp, signOut, refresh } from '../controllers/auth.ts'
import express from 'express'

const authRoutes = express.Router()

authRoutes.post('/sign-up', signUp)
authRoutes.post('/sign-in', signIn)
authRoutes.post('/sign-out', signOut)
authRoutes.post('/refresh', refresh)

export default authRoutes