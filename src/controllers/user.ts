import { getUserByEmail, getUserById, updateUser } from '../services/user.ts'
import { errorFormat } from '../utils/error-format.ts'
import { type Request, type Response } from 'express'
import { manageAccessToken } from '../utils/jwt.ts'
import { emailSchema, passwordSchema } from '../validation/user.ts'
import { sendEmail } from '../utils/send-email.ts'
import { type EmailDAO } from '../config/smtp.ts'
import { logger } from '../config/logger.ts'
import { hashStr } from '../utils/hash.ts'

const sendVerification = async(req: Request, res: Response) => {
  const { id } = req.params
  try {
    const uid = Number(id)
    const user = await getUserById(uid)
    if(user.email_confirm)
      return res.status(200).json({ message: "User email is already verified." })

    const token = manageAccessToken.sign(uid)
    
    const emailData: EmailDAO = {
      to: user.email,
      subject: "Email verification",
      htmlTempPath: "/src/templates/verify-email.html",
      variables: {
        uid: uid,
        token: token
      }
    }
    const email = await sendEmail(emailData)

    res.status(200).json({ message: `An email has been sent to ${user.email}, check your inbox.` })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Error sending email!'
    res.status(400).json({ message: message })
  }
}

const vefrifyEmail = async(req: Request, res: Response) => {
  const { id, token } = req.params
  try {
    const uid = Number(id)
    const user = await getUserById(uid)
    
    const aToken = manageAccessToken.verify(String(token))
    // aToken is a JwtPayload (valid), otherwise it would be catched.
    user.email_confirm = true
    const updatedUser = await updateUser(user)

    return res.status(200).json({ message: `Your email ${updatedUser.email} is now verified.` })

  } catch(e) {
    let statusCode = 400
    if (e instanceof Error) {
      if(e.message === "User not found!") statusCode = 404
      else if(e.message === "Token Verification failed!") statusCode = 401
      return res.status(statusCode).json({ message: e.message })
    }
    else 
      logger.error("Email verification error!", e)
      return res.status(statusCode).json({ message: "Internal server error!" })
  }
}

const resetPassword = async(req: Request, res: Response) => {
  const validation = emailSchema.safeParse(req.body)
  if(!validation.success) {
    return res.status(400).json({
      message: "Email validation failed!",
      error: errorFormat(validation.error.issues)
    })
  }

  try {
    const user = await getUserByEmail(validation.data.email)
    const uid = user.id

    const token = manageAccessToken.sign(uid)
    
    const emailData: EmailDAO = {
      to: user.email,
      subject: "Password reset",
      htmlTempPath: "/src/templates/reset-password.html",
      variables: {
        uid: uid,
        token: token
      }
    }
    const email = await sendEmail(emailData)

    return res.status(200).json({ message: `An email has been sent to ${user.email}, check your inbox.` })
  } catch(e) {
    const message = e instanceof Error ? e.message : 'Error resetting user password!'
    let statusCode = 400
    if(message === 'User not found!') statusCode = 404
    return res.status(statusCode).json({ message: message })
  }
}

const verifyResetPassword = async(req: Request, res: Response) => {
  const { id, token } = req.params
  const { password } = req.body

  const validation = passwordSchema.safeParse(req.body)
  if(!validation.success) {
    return res.status(400).json({
      message: "Password validation failed!",
      error: errorFormat(validation.error.issues)
    })
  }

  try {
    const uid = Number(id)
    const user = await getUserById(uid)
    
    const aToken = manageAccessToken.verify(String(token))
    if(typeof aToken !== "string" && aToken.uid != uid)
      return res.status(403).json({ message: 'Forbidden. You can only access your own resources!' })

    user.password = await hashStr(password)
    const updatedUser = await updateUser(user)

    return res.status(200).json({ message: 'Your password has been reset.' })
  } catch(e) {
    let statusCode = 400
    if (e instanceof Error) {
      if(e.message === "User not found!") statusCode = 404
      else if(e.message === "Token Verification failed!") statusCode = 401
      return res.status(statusCode).json({ message: e.message })
    }
    else 
      logger.error("Password reset error!", e)
      return res.status(400).json({ message: "Internal server error!" })
  }
}

export { sendVerification, vefrifyEmail, resetPassword, verifyResetPassword }