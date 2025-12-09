import { manageAccessToken, manageRefreshToken } from '../utils/jwt.ts'
import { tokens, type RefreshToken } from '../db/tokens-schema.ts'
import { users, type User } from '../db/users-schema.ts'
import { hashStr, compareHash } from '../utils/hash.ts'
import { hashToken } from '../utils/encrypt.ts'
import { db } from '../config/db-connection.ts'
import { logger } from '../config/logger.ts'
import { eq, and } from 'drizzle-orm'

const getUserById = async(uid: number) => {
  const [user] = await db
  .select()
  .from(users)
  .where(eq(users.id, uid))

  if(!user) throw new Error("User not found!")

  return user
}

const updateUser = async(user: User) => {
  try {
    user.updated_at = new Date()
    const uid = Number(user.id)

    await db.update(users)
    .set(user)
    .where(eq(users.id, uid));
  } catch (e) {
    throw new Error("Error updating user!")
  }

  return user
}

export { getUserById, updateUser }