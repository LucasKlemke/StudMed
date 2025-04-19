import {
  type Message,
  convertToCoreMessages,
  createDataStreamResponse,
  streamText,
} from 'ai'
import { auth } from '@/app/(auth)/auth'
import { customModel } from '@/lib/ai'
import { getSystemPrompt } from '@/lib/ai/prompts'
import {
  deleteChatById,
  getChatById,
  saveChat,
  saveMessages,
  saveTokens,
} from '@/lib/db/queries'
import {
  generateUUID,
  getMostRecentUserMessage,
  sanitizeResponseMessages,
} from '@/lib/utils'
import { generateTitleFromUserMessage } from '../../actions'
import { createQuiz } from '@/lib/ai/tools/create-quiz'
import { createTable } from '@/lib/ai/tools/create-table'
import { createDocument } from '@/lib/ai/tools/create-document'
import { updateDocument } from '@/lib/ai/tools/update-document'
import { requestSuggestions } from '@/lib/ai/tools/request-suggetions'
import { webSearchTool } from '@/lib/ai/tools/web-search-tool'

export const maxDuration = 60

type AllowedTools =
  | 'createDocument'
  | 'updateDocument'
  | 'requestSuggestions'
  | 'createQuiz'
  | 'createTable'
  | 'webSearch'

const blocksTools: AllowedTools[] = [
  'createDocument',
  'updateDocument',
  'requestSuggestions',
  'createQuiz',
  'createTable',
]

const webSearchSystemPrompt =
  'Você SEMPRE deverá chamar a tool webSearch para responder a pergunta do usuário. Procure no mínimo em 3 fontes.'

const allTools: AllowedTools[] = [...blocksTools]

export async function POST(request: Request) {
  const {
    id,
    messages,
    subject,
    modelId,
    webSearch,
  }: {
    id: string
    messages: Array<Message>
    modelId: string
    subject: string
    webSearch: boolean
  } = await request.json()

  const session = await auth()

  // check if user has sent a PDF
  const messagesHavePDF = messages.some((message) =>
    message.experimental_attachments?.some(
      (a) => a.contentType === 'application/pdf',
    ),
  )

  // Model -> Gpt3, Gpt4, etc.
  // const model = models.find((model) => model.id === modelId)
  const model = messagesHavePDF
    ? { apiIdentifier: 'gpt-4.1' }
    : { apiIdentifier: 'gpt-4.1-mini' }

  // check if there's no model
  if (!model) {
    return new Response('Model not found', { status: 404 })
  }

  const coreMessages = convertToCoreMessages(messages)
  const userMessage = getMostRecentUserMessage(coreMessages)

  // chef if there's no user message
  if (!userMessage) {
    return new Response('No user message found', { status: 400 })
  }

  // check if user is logged in
  if (!session || !session.user || !session.user.id) {
    return new Response('Unauthorized', { status: 401 })
  }

  const chat = await getChatById({ id })

  // if !chat, generates a title with the llm based on the userMessage
  if (!chat) {
    // remove experimental_attachments and parts from messages, to prevent
    // sending them to the LLM (reduce token cost and avoid errors)
    const messagesWithoutPDF = messages.map(
      ({ experimental_attachments, parts, ...rest }) => rest,
    )
    const coreMessagesWithoutPDF = convertToCoreMessages(messagesWithoutPDF)
    const userMessageWithoutPDF = getMostRecentUserMessage(
      coreMessagesWithoutPDF,
    )

    // generate title and save chat
    const title = await generateTitleFromUserMessage({
      message: userMessageWithoutPDF ?? userMessage,
    })
    await saveChat({ id, userId: session.user.id, title })
  }

  const userMessageId = generateUUID()
  await saveMessages({
    messages: [
      { ...userMessage, id: userMessageId, createdAt: new Date(), chatId: id },
    ],
  })

  // Define the system prompt for the assistant
  const systemPrompt = `${getSystemPrompt(subject)}\n${
    webSearch ? webSearchSystemPrompt : ''
  }`

  return createDataStreamResponse({
    execute: (dataStream) => {
      dataStream.writeData({
        type: 'user-message-id',
        content: userMessageId,
      })

      const result = streamText({
        // Model -> Gpt3, Gpt4, etc.
        model: customModel(model.apiIdentifier),

        // System -> "Write a story about a dragon"
        system: systemPrompt,
        // User -> "Write a story about a dragon"
        messages: coreMessages,
        maxSteps: webSearch ? 1 : 5,
        experimental_activeTools: webSearch ? ['webSearch'] : allTools,

        // tools
        tools: {
          createQuiz: createQuiz({ dataStream }),
          createTable: createTable(),
          createDocument: createDocument({ dataStream, session, model }),
          updateDocument: updateDocument({ dataStream, session, model }),
          requestSuggestions: requestSuggestions({
            dataStream,
            session,
            model,
          }),
          webSearch: webSearchTool(),
        },
        onFinish: async ({ response, usage }) => {
          if (session.user?.id) {
            try {
              const responseMessagesWithoutIncompleteToolCalls =
                sanitizeResponseMessages(response.messages)

              await saveMessages({
                messages: responseMessagesWithoutIncompleteToolCalls.map(
                  (message) => {
                    const messageId = generateUUID()

                    if (message.role === 'assistant') {
                      dataStream.writeMessageAnnotation({
                        messageIdFromServer: messageId,
                      })
                    }

                    return {
                      id: messageId,
                      chatId: id,
                      role: message.role,
                      content: message.content,
                      createdAt: new Date(),
                    }
                  },
                ),
              })

              await saveTokens({
                ...(usage as any),
                id: generateUUID(),
                createdAt: new Date(),
                userId: session.user.id,
              })
            } catch (error) {
              console.error('Failed to save chat')
            }
          }
        },
        experimental_telemetry: {
          isEnabled: true,
          functionId: 'stream-text',
        },
      })

      result.mergeIntoDataStream(dataStream)
    },
  })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return new Response('Not Found', { status: 404 })
  }

  const session = await auth()

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const chat = await getChatById({ id })

    if (chat.userId !== session.user.id) {
      return new Response('Unauthorized', { status: 401 })
    }

    await deleteChatById({ id })

    return new Response('Chat deleted', { status: 200 })
  } catch (error) {
    return new Response('An error occurred while processing your request', {
      status: 500,
    })
  }
}
