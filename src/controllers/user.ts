import { getUserById, updateUser } from '../services/user.ts'
import { type Request, type Response } from 'express'
import { manageAccessToken } from '../utils/jwt.ts'
import { sendEmail } from '../utils/send-email.ts'
import { type EmailDAO } from '../config/smtp.ts'
import { logger } from '../config/logger.ts'

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
    res.status(400).json({ message: "Error sending email!" })
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
    let statusCode = 500
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

export { vefrifyEmail, sendVerification }