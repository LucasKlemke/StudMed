'use client'

import { motion } from 'framer-motion'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { useTranslations } from 'next-intl'

const FAQ = () => {
  const t = useTranslations('Home.FAQ')

  const faqList = [
    {
      question: t('faqQuestion1'),
      answer: t('faqAnswer1'),
    },
    {
      question: t('faqQuestion2'),
      answer: t('faqAnswer2'),
    },
    {
      question: t('faqQuestion3'),
      answer: t('faqAnswer3'),
    },
    {
      question: t('faqQuestion4'),
      answer: t('faqAnswer4'),
    },
    {
      question: t('faqQuestion5'),
      answer: t('faqAnswer5'),
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
          <Badge
            className="rounded-full px-4 py-1.5 text-sm font-medium"
            variant="secondary"
          >
            {t('badge')}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
            {t('title')}
          </h2>
          <p className="max-w-[800px] text-muted-foreground text-base sm:text-lg text-balance">
            {t('description')}
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
