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
  // 1. Transforma a pergunta em embedding ("o que é a diabetes?" -> [0.1, 0.2, 0.3])
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

  // 2. Transforme data em uma única string
  const stringData = data
    .map((item) => {
      return `Página ${item.page}: ${item.content}`
    })
    .join('\n\n')

  return stringData
}
