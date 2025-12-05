import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as models from '../db/schema.ts'

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle({ client: sql })