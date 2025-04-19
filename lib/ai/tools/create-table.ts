import { tool } from 'ai'
import { z } from 'zod'

export const createTable = () =>
  tool({
    description: 'Criar uma simples tabela',
    parameters: z.object({
      json: z.string().describe('Um array de objetos JSON para criar a tabela'),
    }),
    execute: async ({ json }) => {
      return {
        json,
        content:
          'Uma tabela foi gerada. Diga que a tabela foi gerada e sumarize brevemente. Nada além disso.',
      }
    },
  })
