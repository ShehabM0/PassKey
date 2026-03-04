import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users-schema.ts';

export const tokens = pgTable('tokens', {
  id: uuid('id').defaultRandom().primaryKey(),
  uid: uuid('user_id').references(() => users.id),
  refreshToken: varchar('refresh_token', { length: 255 }).notNull().unique(),
  expires_at: timestamp().defaultNow().notNull()
})

export type RefreshToken= {
  uid: string;
  refreshToken: string;
  expires_at: Date
}