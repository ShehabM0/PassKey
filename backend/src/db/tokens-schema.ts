import { integer, pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users-schema.ts';

export const tokens = pgTable('tokens', {
  id: serial('id').primaryKey(),
  uid: integer('user_id').references(() => users.id),
  refreshToken: varchar('refresh_token', { length: 255 }).notNull().unique(),
  expires_at: timestamp().defaultNow().notNull()
})

export type RefreshToken= {
  uid: number;
  refreshToken: string;
  expires_at: Date
}