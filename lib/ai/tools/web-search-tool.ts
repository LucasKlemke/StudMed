import { tool, generateText } from 'ai'
import { z } from 'zod'
import { openai } from '@ai-sdk/openai'

export const webSearchTool = () =>
  tool({
    description: 'Procurar por fontes na web. SEMPRE DEVERÁ CHAMAR ESSA TOOL',
    parameters: z.object({
      question: z.string().describe('A pergunta do usuário'),
      sourceNumber: z
        .string()
        .describe('Número de fontes que deverão ser consultadas')
        .default('3'),
    }),
    execute: async ({ question }) => {
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
  })
