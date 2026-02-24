import type { PaginationParams, PaginatedResult } from '../db/pagination.ts'
import { credentials, type Credential } from '../db/credentials-schema.ts'
import { db } from '../config/db-connection.ts'
import { logger } from '../config/logger.ts'
import { eq, desc, and } from 'drizzle-orm'

const createCredential = async(credential: Credential) => {
  try {
    const [createdCredential] = await db
      .insert(credentials)
      .values({
        uid: credential.uid,
        platformIcon: credential.platformIcon,
        platformTitle: credential.platformTitle,
        platformColor: credential.platformColor,
        email: credential.email,
        password: credential.password
      })
      .returning()

    logger.info("Credential created successfully.")
    return createdCredential
  } catch(e) {
    logger.info("Credential not created!")
    throw e
  }
}

const getUserCredentials = async(uid: number, pagination?: PaginationParams) => {
  const page = (pagination?.page && pagination.page > 0) ? pagination.page : 1
  const limit = (pagination?.limit && pagination.limit > 0) ? pagination.limit : 10
  const offset = (page - 1) * limit

  try {
    const totalUserCredentials = await db.$count(credentials, eq(credentials.uid, uid))

    const userCredentials = await db
    .select()
    .from(credentials)
    .where(eq(credentials.uid, uid))
    .orderBy(desc(credentials.created_at))
    .limit(limit)
    .offset(offset)

    const totalPages = Math.ceil(totalUserCredentials / limit)

    const data: PaginatedResult<Credential> = {
      data: userCredentials,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalItems: totalUserCredentials,
        totalPages: totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    }
    return data
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Error fetching user credentials!'
    throw new Error(message)
  }
}

const deleteCredential = async(credentialId: number, uid: number) => {
  try {
    const [credential] = await db
    .select()
    .from(credentials)
    .where(eq(credentials.id, credentialId))

    if(!credential)
      throw new Error('Credential is not found!')

    if (credential.uid !== uid)
      throw new Error('Forbidden. You can only access your own resources!')

    const [deletedCredential] = await db
      .delete(credentials)
      .where(and(eq(credentials.id, credentialId), eq(credentials.uid, uid)))
      .returning()
    
    return deletedCredential
  } catch(e) {
    const message = e instanceof Error ? e.message : 'Error deleting credential!'
    throw new Error(message)
  }
}

const updateCredential = async(credential: Credential) => {
  try {
    credential.updated_at = new Date()
    const credentialId = Number(credential.id)

    const [updatedCredential] = await db.update(credentials)
    .set(credential)
    .where(eq(credentials.id, credentialId))
    .returning()

    return updatedCredential
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Error updating credential!'
    throw new Error(message)
  }
}

const getCredential = async(credentialId: number) => {
  try {
    const [credential] = await db
    .select()
    .from(credentials)
    .where(eq(credentials.id, credentialId))

    return credential
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Error finding credential!'
    throw new Error(message)
  }
}

export { createCredential, getCredential, getUserCredentials, deleteCredential, updateCredential }
