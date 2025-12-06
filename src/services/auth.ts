import { hashedPass, comparePass } from '../utils/hash.ts'
import { users, type User } from '../db/schema.ts'
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

    user.password = await hashedPass(user.password)

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

    const validPass = await comparePass(user.password, userExist.password)
    if(!validPass) throw new Error("Invalid password!")

    logger.info("User signed-in successfully.")
    return userExist
  } catch(e) {
    logger.info("Couldn't authenticate user!")
    throw e
  }
}

export { createUser, authUser }