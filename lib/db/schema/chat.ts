import { InferSelectModel } from 'drizzle-orm'
import { pgTable, varchar, timestamp, uuid, text } from 'drizzle-orm/pg-core'
import { user } from './user'

export const chat = pgTable('Chat', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('createdAt').notNull(),
  title: text('title').notNull(),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id),
  visibility: varchar('visibility', { enum: ['public', 'private'] })
    .notNull()
    .default('private'),
  // subjectId: varchar('subjectId').notNull(),
})

export type Chat = InferSelectModel<typeof chat>