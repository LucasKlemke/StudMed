import { embed, embedMany } from 'ai'
import { openai } from '@ai-sdk/openai'
import { db } from '../db/queries'
import { and, cosineDistance, desc, eq, gt, sql } from 'drizzle-orm'
import { bookChunks } from '../db/schema'

const embeddingModel = openai.embedding('text-embedding-ada-002')

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll('\\n', ' ')
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  })
  return embedding
}

export const findRelevantContent = async (
  userQuery: string,
  subject: string,
) => {
  // 1. Transforma a pergunta em embedding ("o que é a diabetes?" -> [0.1, 0.2, 0.3])
  const userQueryEmbedded = await generateEmbedding(userQuery)

  const similarity = sql<number>`1 - (${cosineDistance(
    bookChunks.embedding,
    userQueryEmbedded,
  )})`

  const similarGuides = await db
    .select({
      name: bookChunks.document,
      similarity,
      page: bookChunks.page,
      url: bookChunks.url,
    })
    .from(bookChunks)
    .where(and(gt(similarity, 0.5), eq(bookChunks.relatedSubject, subject)))
    .orderBy((t) => desc(t.similarity))
    .limit(4)

  const data = similarGuides.map((guide) => ({
    content: guide.name,
    page: guide.page,
    url: guide.url,
  }))

  // 2. Transforme data em uma única string
  const stringData = data
    .map((item) => {
      return `
      ==========================
      Página ${item.page}
      ${item.content}
      
      Fonte: ${item.url}
      ==========================
      `
    })
    .join('\n\n')

  return stringData
}
