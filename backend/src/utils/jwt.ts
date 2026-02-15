import { logger } from '../config/logger.ts'
import jwt from 'jsonwebtoken'

const manageAccessToken = {
  sign: (userId: number) => {
    if(!userId)
      throw new Error('Authentication failed!')
    try {
      return jwt.sign({ uid: userId }, process.env.ACCESS_TOKEN!, { expiresIn: "15m" })
    } catch (e) {
      logger.error('Authentication failed!', e)
      throw new Error('Authentication failed!')
    }
  },
  verify: (token: string) => {
    try {
      return jwt.verify(token, process.env.ACCESS_TOKEN!)
    } catch (e) {
      logger.error('Token Verification failed!', e)
      throw new Error('Token Verification failed!')
    }
  }
}

const manageRefreshToken = {
  sign: (userId: number) => {
    if(!userId) throw new Error('Authentication failed!');
    try{
      return jwt.sign({ uid: userId }, process.env.REFRESH_TOKEN!, { expiresIn: "2d" })
    } catch(e) {
      logger.error('Authentication failed!', e)
      throw new Error('Authentication failed!')
    }
  },
  verify: (token: string) => {
    try{
      return jwt.verify(token, process.env.REFRESH_TOKEN!)
    } catch (e) {
      logger.error('Token Verification failed!', e)
      throw new Error('Token Verification failed!')
    }
  }
};

export { manageAccessToken, manageRefreshToken }