import { DataStreamWriter, tool, streamText, streamObject } from 'ai'
import { z } from 'zod'
import { saveDocument, getDocumentById } from '@/lib/db/queries'
import { Session } from 'next-auth'
import { customModel } from '@/lib/ai'
import { updateDocumentPrompt } from '@/lib/ai/prompts'

interface UpdateDocumentProps {
  session: Session
  dataStream: DataStreamWriter
  model: { apiIdentifier: string }
}

export const updateDocument = ({
  dataStream,
  session,
  model,
}: UpdateDocumentProps) =>
  tool({
    description: 'Update a document with the given description.',
    parameters: z.object({
      id: z.string().describe('The ID of the document to update'),
      description: z
        .string()
        .describe('The description of changes that need to be made'),
    }),
    execute: async ({ id, description }) => {
      const document = await getDocumentById({ id })

      if (!document) {
        return {
          error: 'Document not found',
        }
      }

      const { content: currentContent } = document
      let draftText = ''

      dataStream.writeData({
        type: 'clear',
        content: document.title,
      })

      if (document.kind === 'text') {
        const { fullStream } = streamText({
          model: customModel(model.apiIdentifier),
          system: updateDocumentPrompt(currentContent),
          prompt: description,
          experimental_providerMetadata: {
            openai: {
              prediction: {
                type: 'content',
                content: currentContent,
              },
            },
          },
        })

        for await (const delta of fullStream) {
          const { type } = delta

          if (type === 'text-delta') {
            const { textDelta } = delta

            draftText += textDelta
            dataStream.writeData({
              type: 'text-delta',
              content: textDelta,
            })
          }
        }

        dataStream.writeData({ type: 'finish', content: '' })
      } else if (document.kind === 'code') {
        const { fullStream } = streamObject({
          model: customModel(model.apiIdentifier),
          system: updateDocumentPrompt(currentContent),
          prompt: description,
          schema: z.object({
            code: z.string(),
          }),
        })

        for await (const delta of fullStream) {
          const { type } = delta

          if (type === 'object') {
            const { object } = delta
            const { code } = object

            if (code) {
              dataStream.writeData({
                type: 'code-delta',
                content: code ?? '',
              })

              draftText = code
            }
          }
        }

        dataStream.writeData({ type: 'finish', content: '' })
      }

      if (session.user?.id) {
        await saveDocument({
          id,
          title: document.title,
          content: draftText,
          kind: document.kind,
          userId: session.user.id,
        })
      }

      return {
        id,
        title: document.title,
        kind: document.kind,
        content: 'The document has been updated successfully.',
      }
    },
  })
