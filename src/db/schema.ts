import { pgTable, serial, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  email_confirm: boolean().default(false),
  password: varchar('password', { length: 255 }).notNull(),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().notNull()
});