import { createUser, authUser, deleteRefreshToken, rotateRefreshToken } from '../services/auth.ts'
import { manageAccessToken, manageRefreshToken } from '../utils/jwt.ts'
import { signupSchema, signinSchema } from '../validation/auth.ts'
import { errorFormat } from '../utils/error-format.ts'
import type { Request, Response } from 'express'
import type { JwtPayload } from 'jsonwebtoken'
import { logger } from '../config/logger.ts'

const signUp = async (req: Request, res: Response) => {
  try {
    const validation = signupSchema.safeParse(req.body)
    if(!validation.success) {
      return res.status(400).json({
        message: "Validation failed!",
        error: errorFormat(validation.error.issues)
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
        error: errorFormat(validation.error.issues)
      })
    }

    const user = await authUser(validation.data)

    const accessToken = manageAccessToken.sign(user.id)
    const refreshToken = manageRefreshToken.sign(user.id)

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

const singOut = async(req: Request, res: Response) => {
  const refreshToken = req.body?.refreshToken;
  if(!refreshToken)
    return res.status(404).json({ message: "Refresh token required!"})

  try {
    const payload: string | JwtPayload = manageRefreshToken.verify(refreshToken)
    if(typeof payload === 'string')
      return res.status(400).json({ message: "Invalid refresh token!"})
    
    await deleteRefreshToken(payload.uid, refreshToken)

    return res.status(200).json({ message: "Logged out successfully." })
  } catch (e) {
    const err = e instanceof Error? e.message : "Invalid refresh token!";
    return res.status(400).json({ message: err })
  }
}

const refresh = async(req: Request, res: Response) => {
  const refreshToken = req.body?.refreshToken;
  if(!refreshToken)
    return res.status(404).json({ message: "Refresh token required!"})

    try {
      const payload: string | JwtPayload = manageRefreshToken.verify(refreshToken)
      if(typeof payload === 'string')
        return res.status(400).json({ message: "Invalid refresh token!"})

      const { newAccessToken, newRefreshToken } = await rotateRefreshToken(payload.uid, refreshToken)

      return res.status(200).json({
        message: "Tokens refreshed successfully.",
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      })
    } catch (e) {
      const err = e instanceof Error? e.message : "Invalid refresh token!";
      return res.status(400).json({ message: err })
    }
}

export { signUp, signIn, singOut, refresh }