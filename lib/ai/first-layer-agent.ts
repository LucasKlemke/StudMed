import { generateObject } from 'ai'
import { customModel } from '@/lib/ai'
import { z } from 'zod'

/**
 * Analyzes a question to determine if retrieval-augmented generation (RAG) is needed,
 * and if so, rewrites the question to be clearer and more suitable for RAG.
 *
 * @param question - The input question to analyze and potentially improve.
 * @returns An object containing the (possibly improved) question and a flag indicating if RAG is needed.
 */
export const analyzeAndImproveQuestionForRAG = async (question: string) => {
  // Step 1: Check if the question requires RAG using an AI model
  const { object: check } = await generateObject({
    model: customModel('gpt-4.1-mini'),
    schema: z.object({
      needsRag: z.boolean(),
    }),
    prompt: `
Você é um especialista em classificar perguntas de usuários para um assistente médico.
Se a pergunta for uma saudação, conversa trivial ou bate-papo geral (ex: "oi", "como vai?", "vamos conversar"), responda com { "needsRag": false }.
Caso o usuário solicite um quiz, questionário ou questões, e nada além, responda com { "needsRag": false }.
Caso o usuário solicite um quiz, questionário ou questões, porém sobre um tópico específico, como "me faça perguntas sobre diabetes", responda com { "needsRag": true }.
Se a pergunta for uma solicitação de informações, como "me fale sobre...", "o que é...", "como funciona...", ou qualquer outra pergunta que não seja uma saudação ou conversa trivial, responda com { "needsRag": true }.
Se a pergunta solicitar qualquer conteúdo técnico, factual ou informacional sobre medicina, saúde, ciência ou qualquer outro domínio, responda com { "needsRag": true }.
Pergunta: "${question}"
`,
  })

  // If RAG is not needed, return the original question
  if (!check.needsRag) {
    return { improvedQuestion: question, needsRag: false }
  }

  // Step 2: If RAG is needed, improve the question for better retrieval
  const { object: improved } = await generateObject({
    model: customModel('gpt-4.1-mini'),
    schema: z.object({
      improvedQuestion: z.string(),
    }),
    prompt: `
Reescreva a seguinte pergunta para torná-la o mais clara e específica possível para geração aumentada por recuperação (RAG).
Não reescreva saudações, conversas triviais ou bate-papo geral.
Concentre-se em esclarecer perguntas técnicas ou informacionais sobre medicina, saúde, ciência ou outros domínios.
Pergunta: "${question}"
`,
  })

  return {
    improvedQuestion: improved.improvedQuestion,
    needsRag: true,
  }
}
