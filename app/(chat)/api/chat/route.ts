import {
  type Message,
  convertToCoreMessages,
  createDataStreamResponse,
  generateText,
  streamObject,
  streamText,
} from 'ai'
import { z } from 'zod'

import { auth } from '@/app/(auth)/auth'
import { customModel } from '@/lib/ai'
import { models } from '@/lib/ai/models'
import { getSystemPrompt, updateDocumentPrompt } from '@/lib/ai/prompts'
import {
  deleteChatById,
  getChatById,
  getDocumentById,
  saveChat,
  saveDocument,
  saveMessages,
  saveSuggestions,
  saveTokens,
} from '@/lib/db/queries'
import type { Suggestion } from '@/lib/db/schema'
import {
  generateUUID,
  getMostRecentUserMessage,
  sanitizeResponseMessages,
} from '@/lib/utils'

import { generateTitleFromUserMessage } from '../../actions'
import { openai } from '@ai-sdk/openai'

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

  if (!session || !session.user || !session.user.id) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Model -> Gpt3, Gpt4, etc.
  const model = models.find((model) => model.id === modelId)

  if (!model) {
    return new Response('Model not found', { status: 404 })
  }

  const coreMessages = convertToCoreMessages(messages)
  const userMessage = getMostRecentUserMessage(coreMessages)

  if (!userMessage) {
    return new Response('No user message found', { status: 400 })
  }

  const chat = await getChatById({ id })

  if (!chat) {
    const title = await generateTitleFromUserMessage({ message: userMessage })
    await saveChat({ id, userId: session.user.id, title })
  }

  const userMessageId = generateUUID()

  await saveMessages({
    messages: [
      { ...userMessage, id: userMessageId, createdAt: new Date(), chatId: id },
    ],
  })

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
          createQuiz: {
            description: 'Criar um quiz com questões de fixação para o usuário',
            parameters: z.object({
              title: z.string(),
              questions: z.array(
                z.object({
                  id: z.number(),
                  question: z.string(),
                  options: z.array(z.string()),
                  correct: z.string(),
                })
              ),
            }),
            execute: async ({ title, questions }) => {
              const id = generateUUID()
              console.log('')
              dataStream.writeData({
                type: 'id',
                content: id,
              })

              dataStream.writeData({
                type: 'clear',
                content: '',
              })

              const quiz = {
                title,
                questions,
              }

              console.log(quiz)
              return {
                quiz,
                content:
                  'Um quiz foi criado e agora está vísivel para o usuário. Apenas diga que o quiz solicitado foi gerado. Nada além disso.',
              }
            },
          },
          createTable: {
            description: 'Criar uma simples tabela',
            parameters: z.object({
              json: z
                .string()
                .describe('Um array de objetos JSON para criar a tabela'),
            }),
            execute: async ({ json }) => {
              return {
                json,
                content:
                  'Uma tabela foi gerada. Diga que a tabela foi gerada e sumarize brevemente. Nada além disso.',
              }
            },
          },
          // 2. Criar um documento
          createDocument: {
            description:
              'Criar um documento para uma atividade de escrita. Esta ferramenta chamará outras funções que gerarão o conteúdo do documento com base no título e tipo.',
            parameters: z.object({
              title: z.string(),
              context: z
                .string()
                .describe(
                  'Informações adicionais para a criação do documento, como contexto ou instruções'
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
                content:
                  'A document was created and is now visible to the user.',
              }
            },
          },

          // 3. Atualizar um documento
          updateDocument: {
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
          },

          // 4. Solicitar sugestões
          requestSuggestions: {
            description: 'Request suggestions for a document',
            parameters: z.object({
              documentId: z
                .string()
                .describe('The ID of the document to request edits'),
            }),
            execute: async ({ documentId }) => {
              const document = await getDocumentById({ id: documentId })

              if (!document || !document.content) {
                return {
                  error: 'Document not found',
                }
              }

              const suggestions: Array<
                Omit<Suggestion, 'userId' | 'createdAt' | 'documentCreatedAt'>
              > = []

              const { elementStream } = streamObject({
                model: customModel(model.apiIdentifier),
                system:
                  'You are a help writing assistant. Given a piece of writing, please offer suggestions to improve the piece of writing and describe the change. It is very important for the edits to contain full sentences instead of just words. Max 5 suggestions.',
                prompt: document.content,
                output: 'array',
                schema: z.object({
                  originalSentence: z
                    .string()
                    .describe('The original sentence'),
                  suggestedSentence: z
                    .string()
                    .describe('The suggested sentence'),
                  description: z
                    .string()
                    .describe('The description of the suggestion'),
                }),
              })

              for await (const element of elementStream) {
                const suggestion = {
                  originalText: element.originalSentence,
                  suggestedText: element.suggestedSentence,
                  description: element.description,
                  id: generateUUID(),
                  documentId: documentId,
                  isResolved: false,
                }

                dataStream.writeData({
                  type: 'suggestion',
                  content: suggestion,
                })

                suggestions.push(suggestion)
              }

              if (session.user?.id) {
                const userId = session.user.id

                await saveSuggestions({
                  suggestions: suggestions.map((suggestion) => ({
                    ...suggestion,
                    userId,
                    createdAt: new Date(),
                    documentCreatedAt: document.createdAt,
                  })),
                })
              }

              return {
                id: documentId,
                title: document.title,
                kind: document.kind,
                message: 'Suggestions have been added to the document',
              }
            },
          },
          webSearch: {
            description:
              'Procurar por fontes na web. SEMPRE DEVERÁ CHAMAR ESSA TOOL',
            parameters: z.object({
              question: z.string().describe('A pergunta do usuário'),
              sourceNumber: z
                .string()
                .describe('Número de fontes que deverão ser consultadas')
                .default('3'),
            }),
            execute: async ({ question, sourceNumber }) => {
              console.log('pergunta', question)

              const result = await generateText({
                model: openai.responses('gpt-4o-mini'),
                prompt: `
                Contexto:
                Você é um professor universitário altamente experiente na área de medicina, especializado em auxiliar estudantes brasileiros de medicina humana em seus estudos acadêmicos.

                Regras:
                - Explique de forma clara, didática e detalhada, garantindo que o estudante compreenda o conteúdo.
                - Sempre que possível, inclua exemplos práticos e relevantes para facilitar a fixação do conteúdo.
                - Forneça uma explicação completa e estruturada, como se fosse uma aula abrangente.
                - Baseie suas respostas em, no mínimo, 3 fontes confiáveis da web, garantindo precisão e qualidade.

                Capacidades:
                - Criar resumos claros e objetivos de conteúdos complexos.
                - Explicar conceitos de forma didática e acessível.
                - Gerar exemplos práticos e aplicáveis ao contexto médico.

                Restrições:
                - Não forneça informações erradas, incompletas ou sem embasamento.
                - Não utilize fontes não confiáveis ou irrelevantes.

                Objetivo:
                - Auxiliar estudantes de medicina a estudar para provas e aprimorar seus conhecimentos, oferecendo explicações didáticas, exemplos práticos e resumos claros.
                - Utilize emojis estrategicamente para tornar explicações complexas mais acessíveis e estimular o aprendizado.

                O usuário fez a seguinte pergunta: "${question}". Sua busca deverá se limitar às seguintes fontes de websites: 
                - PUBMED: https://pubmed.ncbi.nlm.nih.gov/
                - SCIELO: https://www.scielo.br/
                - LILACS: https://lilacs.bvsalud.org/
                - SCHOLAR GOOGLE: https://scholar.google.com.br/?hl=pt

                Instruções:
                - Pesquise em todas as fontes listadas antes de responder.
                - Certifique-se de que as fontes consultadas sejam em português (PT-BR) ou inglês.
                - Inclua no mínimo 3 fontes consultadas na resposta.
                - Apresente as fontes utilizadas de forma clara e organizada no final da resposta.
                `,
                tools: {
                  web_search_preview: openai.tools.webSearchPreview({
                    userLocation: {
                      type: 'approximate',
                      country: 'BR',
                    },
                  }),
                },
              })

              console.log(result.sources)
              console.log(result.text)

              return {
                sources: result.sources,
                text: result.text,
                content:
                  'A pesquisa foi concluída. Com base no resultado, responda a pergunta inicial do usuário.',
              }
            },
          },
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
                  }
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
