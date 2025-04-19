import { DataStreamWriter, tool } from 'ai'
import { z } from 'zod'
import { generateUUID } from '@/lib/utils'

export const createQuiz = ({ dataStream }: { dataStream: DataStreamWriter }) =>
  tool({
    description:
      'Criar um quiz/questionário com questões de fixação para o usuário',
    parameters: z.object({
      title: z.string(),
      questions: z.array(
        z.object({
          id: z.number(),
          question: z.string(),
          options: z.array(z.string()),
          correct: z.string(),
        }),
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

      return {
        quiz,
        content:
          'Um quiz foi criado e agora está vísivel para o usuário. Apenas diga que o quiz solicitado foi gerado. Nada além disso.',
      }
    },
  })
