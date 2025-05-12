import {
  type Message,
  convertToCoreMessages,
  createDataStreamResponse,
  generateObject,
  generateText,
  streamText,
} from 'ai'
import { auth } from '@/app/(auth)/auth'
import { customModel } from '@/lib/ai'
import { getSystemPrompt } from '@/lib/ai/prompts'
import { z } from 'zod'
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
import { getInformation } from '@/lib/ai/tools/get-information'
import { findRelevantContent } from '@/lib/ai/embedding'
import { analyzeAndImproveQuestionForRAG } from '@/lib/ai/first-layer-agent'

export const maxDuration = 60

type AllowedTools =
  | 'createDocument'
  | 'updateDocument'
  | 'requestSuggestions'
  | 'createQuiz'
  | 'createTable'
  // | 'getInformation'
  | 'webSearch'

const blocksTools: AllowedTools[] = [
  'createDocument',
  'updateDocument',
  'requestSuggestions',
  'createQuiz',
  'createTable',
  // 'getInformation',
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
    guytonRag,
    userLanguage,
  }: {
    id: string
    messages: Array<Message>
    modelId: string
    subject: string
    webSearch: boolean
    guytonRag: boolean
    userLanguage: string
  } = await request.json()

  const session = await auth()

  // 1. check if user has sent a PDF
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

  let systemPrompt = ''

  if (guytonRag && !messagesHavePDF) {
    const userQuestion = userMessage.content as string

    const { improvedQuestion, needsRag } =
      await analyzeAndImproveQuestionForRAG(userQuestion)

    if (needsRag) {
      // 1. recupera dados do guyton
      const context = await findRelevantContent(improvedQuestion as string)

      // 2. separa conteúdo mais importante e coerente em relacão à pergunta
      // Usa o modelo para resumir e filtrar o contexto extraído do RAG,
      // mantendo apenas as informações mais relevantes e coerentes com a pergunta do usuário,
      // sempre preservando as referências de página.
      const { text } = await generateText({
        model: customModel('gpt-4.1-mini'),
        system:
          'Você é um assistente que recebe um contexto extraído do livro Guyton & Hall (com páginas) e uma pergunta do usuário. Seu objetivo é filtrar e resumir o contexto, mantendo apenas as informações mais relevantes e diretamente relacionadas à pergunta, sempre preservando as referências de página. Não invente informações e não remova as páginas citadas.',
        prompt: `Pergunta do usuário: """${improvedQuestion}"""
    Contexto extraído do livro (com páginas): """${context}"""
    Retorne apenas as partes do contexto que respondem diretamente à pergunta, mantendo as referências de página. Se nada for relevante, responda: "Não há informações relevantes no contexto extraído."`,
      })
      const filteredContext = text

      systemPrompt = `
      Você é um assistente especializado em responder perguntas de estudantes de medicina, utilizando exclusivamente o conteúdo do livro "Guyton & Hall Tratado de Fisiologia Médica 12ª edição" como fonte. 
      - Todas as respostas devem ser baseadas 100% nas informações encontradas neste livro.
      - Sempre cite a página da fonte utilizada na resposta, no seguinte formato: (página X do livro Guyton & Hall Tratado de Fisiologia Médica 12ª edição).
      - Se não encontrar a resposta no livro, responda apenas: "Não consigo responder à sua pergunta pois não encontrei nada sobre isso no livro Guyton."
      - Seja claro, objetivo e nunca invente informações ou utilize outras fontes.
      - Seja sempre didático, utilize formatos de resposta que ajudem o usuário a entender melhor o assunto.
      - Sempre faça refêrencia a URL do livro na resposta: [https://cssjd.org.br/imagens/editor/files/2019/Abril/Tratado%20de%20Fisiologia%20M%C3%A9dica.pdf]
      
      Contexto extraído do livro:
      ${filteredContext}
      `
    } else {
      systemPrompt = `${getSystemPrompt(subject)}\n${
        webSearch ? webSearchSystemPrompt : ''
      }`
    }
  } else {
    // Define the system prompt for the assistant
    systemPrompt = `${getSystemPrompt(subject)}\n${
      webSearch ? webSearchSystemPrompt : ''
    }`
  }

  if (userLanguage === 'en') {
    systemPrompt += '\n A resposta deverá sem em INGLÊS (EN)'
  }

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
          // // rag
          // getInformation: getInformation(),
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
