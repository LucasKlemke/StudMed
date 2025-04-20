'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'

const HowItWorks = () => {
  const steps = [
    {
      step: '01',
      title: 'Cadastro',
      description: 'Crie sua conta em poucos segundos com seu e-mail e senha.',
    },
    {
      step: '02',
      title: 'Pagamento',
      description:
        'Escolha o plano ideal e realize o pagamento de forma segura.',
    },
    {
      step: '03',
      title: 'Comece a utilizar',
      description:
        'Acesse todas as funcionalidades e otimize seus estudos com IA.',
    },
  ]

  return (
    <section className="w-full py-20 sm:py-24 md:py-32 bg-muted/30 relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px);background-size:4rem_4rem] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px);background-size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]" />

      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
        >
          <Badge
            className="rounded-full px-4 py-1.5 text-sm font-medium"
            variant="secondary"
          >
            Como funciona?
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
            Como Funciona
          </h2>
          <p className="max-w-[800px] text-muted-foreground text-base sm:text-lg text-balance">
            Comece a usar o Studmed em minutos e veja a diferença que nossa
            plataforma pode fazer para seus estudos.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 sm:gap-12 relative">
          {/* linha conectando os círculos (só em md+) */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2 z-0"></div>

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative z-10 flex flex-col items-center text-center space-y-4 px-2"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary  text-primary-foreground text-xl font-bold shadow-lg">
                {step.step}
              </div>
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="text-muted-foreground text-sm sm:text-base max-w-xs">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
