import { users, type User } from '../db/users-schema.ts'
import { db } from '../config/db-connection.ts'
import { eq } from 'drizzle-orm'

const getUserById = async(uid: number) => {
  try {
    const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, uid))

    if(!user) throw new Error("User not found!")

    return user
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Error fetching user by ID!'
    throw new Error(message)
  }
}

const getUserByEmail = async(email: string) => {
  try {
    const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))

    if(!user) throw new Error("User not found!")

    return user
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Error fetching user by email!'
    console.log(message)
    throw new Error(message)
  }
}

const updateUser = async(user: User) => {
  try {
    user.updated_at = new Date()
    const uid = Number(user.id)

    await db.update(users)
    .set(user)
    .where(eq(users.id, uid));

    return user
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Error updating user!'
    throw new Error(message)
  }
}

export { getUserByEmail, getUserById, updateUser }