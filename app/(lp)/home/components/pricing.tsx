'use client'

import { motion } from 'framer-motion'
import { Check, Flame, Percent } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

const Pricing = () => {
  return (
    <section
      id="pricing"
      className="w-full py-20 sm:py-24 md:py-32 bg-muted/30 relative overflow-hidden"
    >
      {/* Background decorativo em grid */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px);_size:4rem_4rem] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px);_size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]" />

      <div className="container mx-auto px-4 sm:px-6 relative">
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
            Preço
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
            Acesso Completo à Plataforma
          </h2>
          <p className="max-w-[800px] text-muted-foreground text-base sm:text-lg text-balance">
            Durante nossa fase de validação, oferecemos um único plano com
            acesso a todas as features. Comece a usar hoje logo após aprovação
            do pagamento.
          </p>
        </motion.div>

        <div className="mx-auto max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="relative overflow-hidden border-primary shadow-lg bg-gradient-to-b from-background to-muted/10 backdrop-blur">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg">
                Oferta Limitada !
              </div>
              <CardContent className="p-6 sm:p-8 flex flex-col h-full">
                <h3 className="text-2xl font-bold">Plano Completo</h3>

                <div className=" mt-4">
                  <div className="flex items-center gap-1">
                    <span className="text-sm line-through text-slate-500">
                      R$60,00
                    </span>
                    <span className="text-sm flex items-baseline text-primary">
                      <Flame className="h-3 w-3" /> 50% de desconto
                    </span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">R$29,90</span>
                    <span className="text-muted-foreground ml-1">/mês</span>
                  </div>
                </div>
                <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                  Acesso completo a todas as funcionalidades da plataforma,
                  podendo cancelar a qualquer momento.
                </p>
                <ul className="space-y-3 my-6 flex-grow">
                  {[
                    'Geração de questões em tempo real',
                    'Seletor de matéria',
                    'Importação de PDFs',
                    'Geração de documentos',
                    'Contexto especializado em medicina',
                    'Suporte prioritário',
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center text-sm sm:text-base"
                    >
                      <Check className="mr-2 size-4 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-sm text-muted-foreground mb-4">
                    <p>Oferta promocional válida até 01/06.</p>
                </div>
                <Link href="/chat">
                  <Button className="w-full mt-auto rounded-full bg-primary ">
                    Começar Agora
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Pricing
