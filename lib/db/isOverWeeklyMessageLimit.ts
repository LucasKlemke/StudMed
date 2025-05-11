'use server'

import { eq, and, sql, gt, lt } from 'drizzle-orm'
import { db } from '@/lib/db/queries'
import { message } from '@/lib/db/schema'
import { startOfWeek, endOfWeek } from 'date-fns'

export async function isOverWeeklyMessageLimit(userId: string): Promise<boolean> {
  const now = new Date()
  const start = startOfWeek(now, { weekStartsOn: 1 })
  const end = endOfWeek(now, { weekStartsOn: 1 })

  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(message)
    .where(
      and(
        eq(message.role, 'user'),
        gt(message.createdAt, start),
        lt(message.createdAt, end),
        sql`"chatId" IN (SELECT "id" FROM "Chat" WHERE "userId" = ${userId})`
      )
    )
    const count = result[0]?.count ?? 0
  console.log(`[DEBUG] Messages this week: ${count}`)
  return count > 5
}
