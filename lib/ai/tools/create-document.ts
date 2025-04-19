import { DataStreamWriter, tool, streamText } from 'ai'
import { z } from 'zod'
import { generateUUID } from '@/lib/utils'
import { saveDocument } from '@/lib/db/queries'
import { Session } from 'next-auth'
import { customModel } from '@/lib/ai'

interface CreateDocumentProps {
  session: Session
  dataStream: DataStreamWriter
  model: { apiIdentifier: string }
}

export const createDocument = ({
  dataStream,
  session,
  model,
}: CreateDocumentProps) =>
  tool({
    description:
      'Criar um documento para uma atividade de escrita. Esta ferramenta chamará outras funções que gerarão o conteúdo do documento com base no título e tipo.',
    parameters: z.object({
      title: z.string(),
      context: z
        .string()
        .describe(
          'Informações adicionais para a criação do documento, como contexto ou instruções',
        ),
      basedInformation: z
        .string()
        .describe('Informações na qual se baseará o documento'),
      kind: z.enum(['text', 'code']),
    }),
    execute: async ({ title, kind, context, basedInformation }) => {
      const id = generateUUID()
      let draftText = ''

      dataStream.writeData({
        type: 'id',
        content: id,
      })

      dataStream.writeData({
        type: 'title',
        content: title,
      })

      dataStream.writeData({
        type: 'kind',
        content: kind,
      })

      dataStream.writeData({
        type: 'clear',
        content: '',
      })

      if (kind === 'text') {
        const { fullStream } = streamText({
          model: customModel(model.apiIdentifier),
          system: `Escreva sobre o tópico dado. Markdown é suportado. Use títulos sempre que apropriado.`,
          prompt: `Tópico: ${title}, instruções: ${context}, basear-se em ${basedInformation}`,
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
      }
      if (session.user?.id) {
        await saveDocument({
          id,
          title,
          kind,
          content: draftText,
          userId: session.user.id,
        })
      }

      return {
        id,
        title,
        kind,
        content: 'A document was created and is now visible to the user.',
      }
    },
  })
