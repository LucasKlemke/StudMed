'use client'

import { motion } from 'framer-motion'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'

const FAQ = () => {
  const faqList = [
    {
      question: 'Quais funcionalidades estão disponíveis no MVP?',
      answer:
        'Nosso foco atual é oferecer as funcionalidades essenciais para validar a proposta. Funcionalidades mais avançadas já estão sendo desenvolvidas e serão lançadas em breve.',
    },
    {
      question: 'Como posso me cadastrar e acessar a plataforma?',
      answer:
        'O processo de cadastro é simples e rápido. Utilize o formulário de registro na página inicial para criar sua conta e começar a usar os recursos disponíveis no momento.',
    },
    {
      question: 'Existe suporte para funcionalidades avançadas?',
      answer:
        'No momento, oferecemos apenas o suporte para os recursos básicos. Com o avanço do projeto, funcionalidades avançadas serão implementadas e suportadas.',
    },
    {
      question: 'Quando novas funcionalidades estarão disponíveis?',
      answer:
        'Estamos constantemente trabalhando para melhorar a plataforma. Fique atento às nossas atualizações, pois novos recursos serão lançados conforme a evolução do projeto.',
    },
    {
      question: 'Como posso enviar feedback ou relatar problemas?',
      answer:
        'Valorizamos sua opinião! Use o link de contato ou acesse a seção de Feedback para nos enviar suas sugestões e reportar qualquer problema.',
    },
  ]

  return (
    <section id="faq" className="w-full py-20 sm:py-24 md:py-32">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
        >
          <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
            FAQ
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
            Perguntas Frequentes
          </h2>
          <p className="max-w-[800px] text-muted-foreground text-base sm:text-lg text-balance">
            Aqui estão algumas perguntas comuns que recebemos sobre nossa
            plataforma. Se você tiver alguma dúvida adicional, não hesite em
            entrar em contato conosco.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqList.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <AccordionItem
                  value={`item-${i}`}
                  className="border-b border-border/40 py-2"
                >
                  <AccordionTrigger className="text-left font-medium hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm sm:text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}

export default FAQ
