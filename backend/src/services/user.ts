import { type UserDAO, users, type User } from '../db/users-schema.ts'
import { eq, getTableColumns } from 'drizzle-orm'
import { db } from '../config/db-connection.ts'

const getUserById = async(uid: string) => {
  try {
    const { password, ...columns } = getTableColumns(users);
    const [user] = await db
    .select(columns)
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

const getUserPass = async(uid: string) => {
  try {
    const [user] = await db
    .select({ password: users.password })
    .from(users)
    .where(eq(users.id, uid))

    if(!user) throw new Error("User not found!")
    
    return user.password
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Error fetching user by ID!'
    throw new Error(message)
  }
}

const updateUser = async(user: UserDAO) => {
  try {
    user.updated_at = new Date()
    const uid = user.id

    await db.update(users)
    .set(user)
    .where(eq(users.id, uid));

    return user
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Error updating user!'
    throw new Error(message)
  }
}

const updateUserPass = async(uid: string, password: string) => {
  try {
    const [user] = await db.update(users)
    .set({
      password: password,
      updated_at: new Date(),
    })
    .where(eq(users.id, uid))
    .returning();

    return user
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Error updating user password!'
    throw new Error(message)
  }
}

export { getUserByEmail, getUserById, getUserPass, updateUser, updateUserPass }
