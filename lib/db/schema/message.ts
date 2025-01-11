import type { InferSelectModel } from 'drizzle-orm'
import { pgTable, varchar, timestamp, json, uuid } from 'drizzle-orm/pg-core'
import { chat } from './chat'

export const message = pgTable('Message', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  chatId: uuid('chatId')
    .notNull()
    .references(() => chat.id),
  role: varchar('role').notNull(),
  content: json('content').notNull(),
  createdAt: timestamp('createdAt').notNull(),
})

export type Message = InferSelectModel<typeof message>
