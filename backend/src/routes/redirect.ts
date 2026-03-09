
import { passwordResetPage, updatePasswordPage, verifyEmailPage } from '../controllers/redirect.ts';
import express from 'express'

const redirectRoutes = express.Router()

redirectRoutes.get('/verify-email/:token', verifyEmailPage);
redirectRoutes.get('/update-password/:token', updatePasswordPage);
redirectRoutes.get('/reset-password/:token', passwordResetPage);

export default redirectRoutes
