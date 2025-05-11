import { DataStreamWriter, tool } from 'ai'
import { z } from 'zod'
import { Session } from 'next-auth'
import { findRelevantContent } from '../embedding'

interface RequestSuggestionsProps {
  session: Session
  dataStream: DataStreamWriter
  model: { apiIdentifier: string }
}

export const getInformation = () =>
  tool({
    description: `get information from your knowledge base to answer questions.`,
    parameters: z.object({
      question: z.string().describe('the users question'),
    }),
    execute: async ({ question }) => findRelevantContent(question),
  })
