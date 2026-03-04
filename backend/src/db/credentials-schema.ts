import { index, text, pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users-schema.ts';

export const credentials = pgTable('credentials', {
  id: uuid('id').defaultRandom().primaryKey(),
  uid: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade'}),
  platformIcon: text('platform_icon').notNull(),
  platformTitle: varchar('platform_title', { length: 255 }).notNull(),
  platformColor: varchar('platform_color', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  password: text('password').notNull(),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().notNull()
}, (table) => ({
  TitleIdx: index('title_idx').on(table.platformTitle),
}));

export type CredentialDAO = {
  id: string;
  uid: string;
  platformIcon: string;
  platformTitle: string;
  platformColor: string;
  email: string;
  created_at?: Date;
  updated_at?: Date
}

export type Credential = {
  id?: string;
  uid: string;
  platformIcon: string;
  platformTitle: string;
  platformColor: string;
  email: string;
  password: string;
  created_at?: Date;
  updated_at?: Date
}
