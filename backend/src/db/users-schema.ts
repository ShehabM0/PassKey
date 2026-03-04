import { pgTable, varchar, timestamp, boolean, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  email_confirm: boolean().default(false).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().notNull()
});

export type UserDAO= {
  id: string;
  name?: string;
  email: string;
  email_confirm?: boolean;
  created_at?: Date;
  updated_at?: Date
}

export type User= {
  id?: string;
  name?: string;
  email: string;
  email_confirm?: boolean;
  password: string;
  created_at?: Date;
  updated_at?: Date
}
