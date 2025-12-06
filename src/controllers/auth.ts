import { generateAccessToken, jwtCookieOptions } from '../utils/jwt.ts'
import { signupSchema, signinSchema } from '../validation/auth.ts'
import { createUser, authUser } from '../services/auth.ts'
import type { Request, Response } from 'express'
import { logger } from '../config/logger.ts'

const signUp = async (req: Request, res: Response) => {
  try {
    const validation = signupSchema.safeParse(req.body)
    if(!validation.success) {
      return res.status(400).json({
        message: "Validation failed!",
        error: validation.error
      })
    }

    const user = await createUser(validation.data)

    if(!user)
      return res.status(404).json({ message: "User creation failed!" })

    return res.status(201).json({
      message: "User created successfully.",
      user: { id:user.id, email: user.email },
    })
  } catch (e) {
    if (e instanceof Error && e.message === "User already exist!")
      return res.status(409).json({ message: e.message })
    else 
      logger.error("Sign-up error!", e)
      return res.status(500).json({ message: "Internal server error!" })
  }
}

const signIn = async(req: Request, res: Response) => {
  try {
    const validation = signinSchema.safeParse(req.body)
    if(!validation.success) {
      return res.status(400).json({
        message: "validation failed!",
        error: validation.error
      })
    }

    const user = await authUser(validation.data)

    const accessToken = generateAccessToken.sign(user.id)
    const refreshToken = generateAccessToken.sign(user.id)

    return res.status(200).json({
      message: "User signed-in successfully.",
      user: { id:user.id, email: user.email },
      accessToken: accessToken,
      refreshToken: refreshToken
    })
  } catch (e) {
    if (
      e instanceof Error && 
      (e.message === "User not found!" || e.message === "Invalid password!")
    )
      return res.status(401).json({ message: "Invalid credentials!" })
    else
      logger.error("Sign-in error!", e)
      return res.status(500).json({ message: "Internal server error!" })
  }
}

export { signUp, signIn }