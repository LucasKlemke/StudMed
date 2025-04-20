'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const CTA = () => {
  return (
    <section className="w-full py-20 sm:py-24 md:py-32 relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]" />

      <div className="container mx-auto px-4 sm:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-6 text-center"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
            Pronto para transformar seus estudos médicos?
          </h2>
          <p className="mx-auto max-w-[700px] text-base sm:text-xl text-muted-foreground text-balance">
            Junte-se a milhares de estudantes de medicina que otimizaram seu
            aprendizado e melhoraram seu desempenho com nossa plataforma.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link href="/register">
              <Button size="lg" className="rounded-full h-12 px-8 text-base">
                Comprar agora
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            Cancele a qualquer momento. Sem taxas ocultas.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default CTA
