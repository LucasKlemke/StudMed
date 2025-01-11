import type { InferSelectModel } from 'drizzle-orm'
import {
  pgTable,
  varchar,
  timestamp,
  json,
  uuid,
  text,
  primaryKey,
  foreignKey,
  boolean,
  numeric,
} from 'drizzle-orm/pg-core'
import { user } from './user'
import { number } from 'zod'
import { message } from './message'

export const tokens = pgTable(
  'Tokens',
  {
    id: uuid('id').notNull().defaultRandom(),
    createdAt: timestamp('createdAt').notNull(),
    promptTokens: numeric('promptTokens').notNull(),
    completionTokens: numeric('completionTokens').notNull(),
    totalTokens: numeric('totalTokens').notNull(),
    totalPrice: numeric('totalPrice'),
    userId: uuid('userId')
      .notNull()
      .references(() => user.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.id, table.createdAt] }),
    }
  }
)

export type Tokens = InferSelectModel<typeof tokens>
