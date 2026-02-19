import { getUserByEmail, getUserById, updateUser } from '../services/user.ts'
import { emailSchema, passwordSchema } from '../validation/user.ts'
import { compareHash, hashStr } from '../utils/hash.ts'
import { errorFormat } from '../utils/error-format.ts'
import { type Request, type Response } from 'express'
import { manageAccessToken } from '../utils/jwt.ts'
import { sendEmail } from '../utils/send-email.ts'
import { type EmailDAO } from '../config/smtp.ts'
import { logger } from '../config/logger.ts'
import { redis } from '../config/redis.ts'

const currentUser = async(req: Request, res: Response) => {
  const id = req.userId;
  try {
    const uid = Number(id)
    const user = await getUserById(uid)
    return res.status(200).json({ user: user })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Error fetching user!'
    res.status(400).json({ message: message })
  }
}


const sendVerification = async(req: Request, res: Response) => {
  const id = req.userId;
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
        token: token
      }
    }
    await sendEmail(emailData)

    res.status(200).json({ message: `An email has been sent to ${user.email}, check your inbox.` })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Error sending email!'
    res.status(400).json({ message: message })
  }
}

const vefrifyEmail = async(req: Request, res: Response) => {
  const { token } = req.params
  const id = req.userId;
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


const requestPasswordReset = async(req: Request, res: Response) => {
  const validation = emailSchema.safeParse(req.body)
  if(!validation.success) {
    console.log("EROR")
    return res.status(400).json({
      message: "Email validation failed!",
      error: errorFormat(validation.error.issues)
    })
  }

  try {
    const user = await getUserByEmail(validation.data.email)
    const uid = user.id

    const token = manageAccessToken.sign(uid)
    await redis.setex('password-reset:${token}', 15 * 60, uid)
    
    const emailData: EmailDAO = {
      to: user.email,
      subject: "Password reset",
      htmlTempPath: "/src/templates/reset-password.html",
      variables: {
        token: token
      }
    }
    await sendEmail(emailData)

    return res.status(200).json({ message: `An email has been sent to ${user.email}, check your inbox.` })
  } catch(e) {
    const message = e instanceof Error ? e.message : 'Error resetting user password!'
    let statusCode = 400
    if(message === 'User not found!') statusCode = 404
    return res.status(statusCode).json({ message: message })
  }
}

const passwordReset = async(req: Request, res: Response) => {
  const { token } = req.params
  const { password } = req.body

  const validation = passwordSchema.safeParse(req.body)
  if(!validation.success) {
    return res.status(400).json({
      message: "Password validation failed!",
      error: errorFormat(validation.error.issues)
    })
  }

  try {
    const aToken = manageAccessToken.verify(String(token))
    if(typeof aToken === "string")
      return res.status(403).json({ message: aToken })

    const uid = await redis.get('password-reset:${token}')
    if(!uid)
      return res.status(400).json({ message: "Invalid or expired token!" })

    const user = await getUserById(Number(uid))
    user.password = await hashStr(password)
    await updateUser(user)
    await redis.del('password-reset:${token}')

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


const updatePassword = async(req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body
  const oldPassValidation = passwordSchema.safeParse({ password: oldPassword })
  const newPassValidation = passwordSchema.safeParse({ password: newPassword })
  const uid = req.userId

  if(!uid)
    return res.status(400).json({ message: "Failed to get user id!" })
  if(!oldPassValidation.success) {
    return res.status(400).json({
      message: "Old Password validation failed!",
      error: errorFormat(oldPassValidation.error.issues)
    })
  }
  if(!newPassValidation.success) {
    return res.status(400).json({
      message: "New Password validation failed!",
      error: errorFormat(newPassValidation.error.issues)
    })
  }

  const user = await getUserById(uid)
  if(!user.email_confirm)
    return res.status(403).json({ message: "Please verify your email first!" })

  const confirmPass = await compareHash(oldPassword, user.password)
  if(!confirmPass)
    return res.status(401).json({ message: "Current password is incorrect, please try again!" })

  const newHashedPass = await hashStr(newPassword)
  await redis.setex('password-update:${uid}:${token}', 15 * 60, newHashedPass)

  const token = manageAccessToken.sign(uid)
  const emailData: EmailDAO = {
    to: user.email,
    subject: "Password update",
    htmlTempPath: "/src/templates/update-password.html",
    variables: {
      uid: uid,
      token: token
    }
  }
  await sendEmail(emailData)

  return res.status(200).json({ message: `An email has been sent to ${user.email}, check your inbox.` })
}

const verifyUpdatePassword = async(req: Request, res: Response) => {
  const token = req.params?.token
  const uid = req.userId

  if(!uid)
    return res.status(401).json({ message: "Failed to get user id!" })

  const aToken = manageAccessToken.verify(String(token))
  if(typeof aToken !== "string" && aToken.uid !== uid)
    return res.status(403).json({ message: 'Forbidden. You can only access your own resources!' })

  const newHashedPass = await redis.get('password-update:${uid}:${token}')
  if(!newHashedPass)
    return res.status(400).json({ message: "Couldn't find redis password!" })

  const user = await getUserById(uid)
  user.password = newHashedPass
  await updateUser(user)
  
  return res.status(200).json({ message: "Your password has been updated successfully.", data: newHashedPass })
}

export {
  currentUser,
  sendVerification, vefrifyEmail,
  requestPasswordReset, passwordReset,
  updatePassword, verifyUpdatePassword 
}