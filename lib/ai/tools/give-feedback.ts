import { DataStreamWriter, tool } from 'ai'
import { z } from 'zod'
import { generateUUID } from '@/lib/utils'

export const giveFeedback = ({ dataStream }: { dataStream: DataStreamWriter }) =>
    tool({
        description:
            'Esta ferramenta fornece um feedback ao usuário sobre sua performance durante a consulta com o paciente, após o diagnóstico ou encerramento da consulta.',
        parameters: z.object({
            score: z.number().min(0).max(10).describe('Nota de 0 a 10 em relação à precisão do usuário durante a consulta'),
        }),
        execute: async ({ score }) => {
            const id = generateUUID()
            dataStream.writeData({
                type: 'id',
                content: id,
            })

            dataStream.writeData({
                type: 'clear',
                content: '',
            })

            return {
                score,
                content:
                    `Sua nota de precisão durante a consulta foi ${score}/10. Confira sugestões de melhoria baseadas no seu desempenho.`,
            }
        },
    })
