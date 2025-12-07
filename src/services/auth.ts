import { users, type User, tokens, type RefreshToken } from '../db/schema.ts'
import { manageAccessToken, manageRefreshToken } from '../utils/jwt.ts'
import { hashStr, compareHash } from '../utils/hash.ts'
import { db } from '../config/db-connection.ts'
import { logger } from '../config/logger.ts'
import { eq } from 'drizzle-orm'

const createUser = async(user: User) => {
  try {
    const userExist = await db
      .select()
      .from(users)
      .where(eq(users.email, user.email))
    if(userExist.length) throw new Error("User already exist!")

    user.password = await hashStr(user.password)

    const [createdUser] = await db
      .insert(users)
      .values({ name: user.name!, email: user.email, password: user.password })
      .returning()

    logger.info("User created successfully.")
    return createdUser
  } catch(e) {
    logger.info("User not created.")
    throw e
  }
}

const authUser = async(user: User) => {
  try {
    const [userExist] = await db
      .select()
      .from(users)
      .where(eq(users.email, user.email))
    if(!userExist) throw new Error("User not found!")

    const validPass = await compareHash(user.password, userExist.password)
    if(!validPass) throw new Error("Invalid password!")
     
    await insertRefreshToken(userExist.id)

    logger.info("User signed-in successfully.")
    return userExist
  } catch(e) {
    logger.info("Couldn't authenticate user!")
    throw e
  }
}

const insertRefreshToken = async(uid: number, rToken?: string) => {
  if(!rToken)
    rToken = manageRefreshToken.sign(uid)
  const hashedRefreshToken = await hashStr(rToken)

  const refreshToken: RefreshToken = {
    uid: uid,
    refreshToken: hashedRefreshToken,
    expires_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2days
  }

  await db.insert(tokens).values(refreshToken).returning()
  return rToken
}

const deleteRefreshToken = async(uid:number, token: string) => {
  const userTokens = await db
  .select()
  .from(tokens)
  .where(eq(tokens.uid, uid))

  let verfiedTokentokenId = undefined;
  for(const t of userTokens.values()) {
    const findToken = await compareHash(token, t.refreshToken)
    if(findToken) {
      verfiedTokentokenId = t.id
      break
    }
  }
  if(!verfiedTokentokenId)
    throw new Error('Refresh token revoked or invalid!')

  await db.delete(tokens).where(eq(tokens.id, verfiedTokentokenId))
}

const rotateRefreshToken = async(uid: number, token: string) => {
  await deleteRefreshToken(uid, token)

  const newAccessToken = manageAccessToken.sign(uid);
  let newRefreshToken = manageRefreshToken.sign(uid);

  newRefreshToken = await insertRefreshToken(uid, newRefreshToken)

  return { newAccessToken, newRefreshToken }
}

export { createUser, authUser, deleteRefreshToken, rotateRefreshToken }