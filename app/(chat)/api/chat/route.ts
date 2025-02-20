import {
  type Message,
  convertToCoreMessages,
  createDataStreamResponse,
  streamObject,
  streamText,
} from 'ai'
import { z } from 'zod'

import { auth } from '@/app/(auth)/auth'
import { customModel } from '@/lib/ai'
import { models } from '@/lib/ai/models'
import {
  codePrompt,
  getSystemPrompt,
  updateDocumentPrompt,
} from '@/lib/ai/prompts'
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
import type { Suggestion } from '@/lib/db/schema/suggestion'
import {
  generateUUID,
  getMostRecentUserMessage,
  sanitizeResponseMessages,
} from '@/lib/utils'

import { generateTitleFromUserMessage } from '../../actions'

export const maxDuration = 60

type AllowedTools =
  | 'createDocument'
  | 'updateDocument'
  | 'requestSuggestions'
  | 'webScraping'
  | 'createQuiz'
  | 'createTable'

const blocksTools: AllowedTools[] = [
  'createDocument',
  'updateDocument',
  'requestSuggestions',
  'createQuiz',
  'createTable',
]

const scrappingTools: AllowedTools[] = ['webScraping']

const allTools: AllowedTools[] = [...blocksTools, ...scrappingTools]

export async function POST(request: Request) {
  const {
    id,
    messages,
    subject,
    modelId,
  }: {
    id: string
    messages: Array<Message>
    modelId: string
    subject: string
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

  const systemPrompt = getSystemPrompt(subject)

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
        maxSteps: 5,
        experimental_activeTools: allTools,

        // tools
        tools: {
          //     webScraping: {
          //       description: `Realizar consulta na web e extrair informações da seguinte fonte : https://pubmed.ncbi.nlm.nih.gov/
          // - Você deve editar a url adicionando o termo de busca, por exemplo: https://pubmed.ncbi.nlm.nih.gov/?term=systole&filter=simsearch2.ffrft&filter=years.2000-2025
          // - Apos o termo, sempre aplicar os filtros &filter=simsearch2.ffrft&filter=years.2000-2025, para pegar conteudo gratuito e atualizado
          // - O termo sempre devera ser adaptado para o ingles
          // - Nunca devolver a url de busca como referencia
          //       `,
          //       parameters: z.object({
          //         url: z.string().describe('O URL da página da web para consultar'),
          //       }),
          //       execute: async ({ url }) => {
          //         const id = generateUUID()

          //         dataStream.writeData({
          //           type: 'id',
          //           content: id,
          //         })

          //         dataStream.writeData({
          //           type: 'clear',
          //           content: '',
          //         })

          //         const response = await fetch(`https://r.jina.ai/${url}`)

          //         const url_data = await response.text()

          //         // const { text } = await generateText({
          //         //   model: customModel(model.apiIdentifier),
          //         //   prompt: 'What is love?',
          //         // })

          //         const { text: links } = await generateText({
          //           temperature: 0.1,
          //           model: customModel(model.apiIdentifier),
          //           system:
          //             'You are a web scraping tool. Given a web page content, extract the link of the first three articles and return an array with each link, do not add anything else besides the array.',
          //           prompt: url_data,
          //         })

          //         const parsedLinks = JSON.parse(links)

          //         const content = await Promise.all(
          //           parsedLinks.map(async (link: string) => {
          //             const article_response = await fetch(
          //               `https://r.jina.ai/${link}`
          //             )

          //             const article_url_data = await article_response.text()

          //             return article_url_data
          //           })
          //         ).then((articles) => articles.join('\n'))

          //         // console.log('#############################content######', content)

          //         return { content }

          //         // Passo 1, consultar url de busca e selecionar os 3 primeiros links de artigos
          //         // Passo 2, para cada link, extrair o conteudo do artigo
          //         // Retornar o conteudo dos 3 artigos no seguinte modelo:
          //         // Artigo 1:
          //         //autores: nome completo dos autores
          //         //titulo: titulo do artigo
          //         //data: data de publicação
          //         //link: link do artigo
          //         //conteudo: conteudo do artigo
          //         // ...

          //         // const id = generateUUID()
          //         // let draftText = ''
          //         // console.log('WEBSCRAPPINGGGG')

          //         // const { fullStream } = streamText({
          //         //   model: customModel(model.apiIdentifier),
          //         //   system:
          //         //     'Você é uma IA médica que ensina estudantes de medicina, com base no conteúdo, crie um resumo super didático e completo, para que o estudante absorva  máximo de conhecimento possível. Markdown é suportado. Use títulos sempre que necessário.',
          //         //   prompt: url_data,
          //         // })

          //         // for await (const delta of fullStream) {
          //         //   const { type } = delta

          //         //   if (type === 'text-delta') {
          //         //     const { textDelta } = delta

          //         //     draftText += textDelta
          //         //     dataStream.writeData({
          //         //       type: 'text-delta',
          //         //       content: textDelta,
          //         //     })
          //         //   }
          //         // }

          //         // dataStream.writeData({ type: 'finish', content: '' })

          //         // dataStream.writeData(url_data)
          //         //   let title = 'Web Scraping'
          //         //   let kind = 'text'
          //         //  if (session.user?.id) {
          //         //    await saveDocument({
          //         //      id,
          //         //      title,
          //         //      kind,
          //         //      content: draftText,
          //         //      userId: session.user.id,
          //         //    })
          //         //  }

          //         //  return {
          //         //    id,
          //         //    title,
          //         //    kind,
          //         //    content:
          //         //      'Um documento foi criado e agora está visível para o usuário.',
          //         //  }
          //       },
          //     },
          webScraping: {
            description: `Realizar consulta na web com base em uma url fornecida pelo usuário
            `,
            parameters: z.object({
              url: z.string().describe('O URL da página da web para consultar'),
            }),
            execute: async ({ url }) => {
              const id = generateUUID()

              dataStream.writeData({
                type: 'id',
                content: id,
              })

              dataStream.writeData({
                type: 'clear',
                content: '',
              })

              const response = await fetch(`https://r.jina.ai/${url}`)

              const url_data = await response.text()

              return { url_data }
            },
          },
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

              console.log('contexto', context)
              console.log('basedInformation', basedInformation)
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
              } else if (kind === 'code') {
                const { fullStream } = streamObject({
                  model: customModel(model.apiIdentifier),
                  system: codePrompt,
                  prompt: title,
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

              // const brazilTimeOffset = -3 // Brazil is typically UTC-3
              // const now = new Date()
              // const brazilTime = new Date(
              //   now.getTime() + brazilTimeOffset * 60 * 60 * 1000
              // )

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
