import type { PaginationParams, PaginatedResult } from '../db/pagination.ts'
import { credentials, type Credential } from '../db/credentials-schema.ts'
import { db } from '../config/db-connection.ts'
import { eq, desc } from 'drizzle-orm'

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

export { getUserCredentials }
