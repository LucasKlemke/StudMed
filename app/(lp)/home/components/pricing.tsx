'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

const Pricing = () => {
  return (
    <section
      id="pricing"
      className="w-full py-20 md:py-32 bg-muted/30 relative overflow-hidden"
    >
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]"></div>

      <div className="container px-4 md:px-6 relative">
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
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Acesso Completo à Plataforma
          </h2>
          <p className="max-w-[800px] text-muted-foreground md:text-lg">
            Durante nossa fase de validação, oferecemos um único plano com
            acesso a todas as features. Comece a usar hoje logo após aprovação do pagamento.
          </p>
        </motion.div>

        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="relative overflow-hidden h-full border-primary shadow-lg bg-gradient-to-b from-background to-muted/10 backdrop-blur">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg">
                Oferta Especial
              </div>
              <CardContent className="p-6 flex flex-col h-full">
                <h3 className="text-2xl font-bold">Plano Completo</h3>
                <div className="flex items-baseline mt-4">
                  <span className="text-4xl font-bold">R$29,90</span>
                  <span className="text-muted-foreground ml-1">/mês</span>
                </div>
                <p className="text-muted-foreground mt-2">
                  Acesso completo a todas as funcionalidades da plataforma,
                  podendo cancelar a qualquer momento.
                </p>
                <ul className="space-y-3 my-6 flex-grow">
                  <li className="flex items-center">
                    <Check className="mr-2 size-4 text-primary" />
                    <span>Geração de questões em tempo real</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 size-4 text-primary" />
                    <span>Seletor de matéria</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 size-4 text-primary" />
                    <span>Importação de PDFs</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 size-4 text-primary" />
                    <span>Geração de documentos</span>
                  </li>

                  <li className="flex items-center">
                    <Check className="mr-2 size-4 text-primary" />
                    <span>Contexto especializado em medicina</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 size-4 text-primary" />
                    <span>Suporte prioritário</span>
                  </li>
                </ul>
                <div className="text-sm text-muted-foreground mb-4">
                  <p>
                    Cadastre-se e comece a usar !
                  </p>
                </div>
                <Link href="/register">
                  <Button className="w-full mt-auto rounded-full bg-primary hover:bg-primary/90">
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
