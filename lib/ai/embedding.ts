import { embed, embedMany } from 'ai'
import { openai } from '@ai-sdk/openai'
import { db } from '../db/queries'
import { cosineDistance, desc, gt, sql } from 'drizzle-orm'
import { guytonChunks } from '../db/schema'

const embeddingModel = openai.embedding('text-embedding-ada-002')

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll('\\n', ' ')
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  })
  return embedding
}

export const findRelevantContent = async (userQuery: string) => {
  const userQueryEmbedded = await generateEmbedding(userQuery)
  const similarity = sql<number>`1 - (${cosineDistance(
    guytonChunks.embedding,
    userQueryEmbedded,
  )})`
  const similarGuides = await db
    .select({
      name: guytonChunks.document,
      similarity,
      page: guytonChunks.page,
    })
    .from(guytonChunks)
    .where(gt(similarity, 0.5))
    .orderBy((t) => desc(t.similarity))
    .limit(4)

  const data = similarGuides.map((guide) => ({
    content: guide.name,
    page: guide.page,
  }))

  return data
}
