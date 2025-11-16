import { pgTable, serial, varchar, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const reminders = pgTable('reminders', {
  id: serial('id').primaryKey(),
  user_id: varchar('user_id', { length: 255 }).notNull(),
  title: text('title').notNull(),
  remind_at: timestamp('remind_at', { mode: 'string' }).notNull(),
  timezone: varchar('timezone', { length: 100 }).default('UTC'),
  delivered: boolean('delivered').default(false),
  created_at: timestamp('created_at', { mode: 'string' }).defaultNow(),
});

export const appointments = pgTable('appointments', {
  id: serial('id').primaryKey(),
  user_id: varchar('user_id', { length: 255 }).notNull(),
  title: text('title').notNull(),
  scheduled_at: timestamp('scheduled_at', { mode: 'string' }).notNull(),
  status: varchar('status', { length: 50 }).default('scheduled'),
  notes: text('notes'),
  created_at: timestamp('created_at', { mode: 'string' }).defaultNow(),
});
