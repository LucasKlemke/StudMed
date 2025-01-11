import type { InferSelectModel } from 'drizzle-orm'
import { pgTable, uuid, primaryKey, boolean } from 'drizzle-orm/pg-core'
import { chat } from './chat'
import { message } from './message'

export const vote = pgTable(
  'Vote',
  {
    chatId: uuid('chatId')
      .notNull()
      .references(() => chat.id),
    messageId: uuid('messageId')
      .notNull()
      .references(() => message.id),
    isUpvoted: boolean('isUpvoted').notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.chatId, table.messageId] }),
    }
  }
)

export type Vote = InferSelectModel<typeof vote>
