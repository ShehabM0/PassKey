import { integer, pgTable, serial, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  email_confirm: boolean().default(false).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().notNull()
});

export const tokens = pgTable('tokens', {
  id: serial('id').primaryKey(),
  uid: integer('user_id').references(() => users.id),
  refreshToken: varchar('refresh_token', { length: 255 }).notNull().unique(),
  expires_at: timestamp().defaultNow().notNull()
});

export type User= {
  id?: number;
  name?: string;
  email: string;
  email_confirm?: boolean;
  password: string;
  created_at?: Date;
  updated_at?: Date
}

export type RefreshToken= {
  uid: number;
  refreshToken: string;
  expires_at: Date
}