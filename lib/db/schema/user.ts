import type { InferSelectModel } from 'drizzle-orm'
import {
  pgTable,
  varchar,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

export const user = pgTable('User', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  email: varchar('email', { length: 64 }).notNull(),
  username: varchar('username', { length: 256 }).notNull().default('usuario'),
  password: varchar('password', { length: 64 }),
})

export type User = InferSelectModel<typeof user>
