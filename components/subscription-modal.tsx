'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { signOut } from 'next-auth/react'
import {
  Brain,
  GraduationCap,
  HandCoins,
  LogOut,
  NotebookPen,
} from 'lucide-react'
import Image from 'next/image'
import PaymentButton from '../app/(chat)/account/components/payment-button'
import { Button } from '@/components/ui/button'
import React, { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'
import { motion } from 'framer-motion'

const premiumFeatures = [
  {
    name: 'Seletor de Matéria',
    description: 'Escolha exatamente a disciplina que deseja estudar.',
    icon: <GraduationCap className="h-4 w-4" />,
  },
  {
    name: 'Geração de Questões',
    description: 'Crie questões de múltipla escolha com base nos seus estudos.',
    icon: <NotebookPen className="h-4 w-4" />,
  },
  {
    name: 'Contexto Especializado',
    description: 'Obtenha respostas com base no assunto escolhido.',
    icon: <Brain className="h-4 w-4" />,
  },
  {
    name: 'Preço Acessível',
    description: 'Tudo isso pelo preço de 2 energéticos',
    icon: <HandCoins className="h-4 w-4" />,
  },
]

// Sample images - replace these with your actual images
const productImages = ['/images/subscription.png']

export function SubscriptionModal({ onClose }: { onClose: () => void }) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="md:max-w-[1000px] p-0 overflow-hidden border-0 rounded-xl ">
        <div className="flex flex-col md:flex-row ">
          {/* Left side - Illustration */}
          <div className="w-full md:w-1/2 md:flex  p-6 invisible md:visible items-center justify-center relative">
            <Image
              src={productImages[0] || '/placeholder.svg'}
              alt="Premium features illustration"
              fill
              className="object-fit"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Right side - Features */}
          <div className="w-full md:w-1/2 bg-background  p-8 flex flex-col">
            <h2 className="text-3xl font-bold mb-1">
              Transforme os seus estudos com Studmed
            </h2>

            <div className="py-3">
              <div className="flex flex-col">
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-sm line-through text-slate-500">
                    R$60,00
                  </span>
                  <span className="text-3xl font-bold text-primary">
                    R$29,00/ mês
                  </span>
                </div>

                <div className="flex flex-col gap-1 bg-primary/10 rounded-lg px-3 py-2 mt-2 mb-1">
                  {/* <CountdownTimer endDate={new Date(2025, 6, 1)} /> */}
                  <span className="text-xs text-primary/80">
                    Válido até dia 01 de Julho
                  </span>
                </div>
              </div>
            </div>

            {/* Features grid */}
            <div className="flex flex-col gap-3 mb-8">
              {premiumFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col border border-primary p-4 items-c rounded-lg cursor-pointer transition-shadow"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{
                    scale: 1.04,
                    boxShadow: '0 4px 24px 0 rgba(80, 80, 180, 0.10)',
                    transition: { duration: 0.2 },
                  }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.5,
                    type: 'spring',
                  }}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-primary">
                      {feature.name}
                    </h3>
                    <div className="text-2xl mb-1 text-primary">
                      {feature.icon}
                    </div>
                  </div>
                  <p className="text-xs text-primary/80">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="mt-auto flex flex-col gap-1">
              <PaymentButton>Assinar agora</PaymentButton>

              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  signOut({
                    redirectTo: '/',
                  })
                }}
              >
                <LogOut /> Sair
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Ao assinar, você concorda com nossos termos de serviço e
                política de privacidade.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface CountdownTimerProps {
  endDate: Date
}

const CountdownTimer = ({ endDate }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +endDate - +new Date()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [endDate])

  return (
    <div className="flex items-center gap-2 text-sm text-primary font-semibold">
      <Clock size={16} className="animate-pulse" />
      <span>
        {timeLeft.days > 0 && `${timeLeft.days}d `}
        {String(timeLeft.hours).padStart(2, '0')}:
        {String(timeLeft.minutes).padStart(2, '0')}:
        {String(timeLeft.seconds).padStart(2, '0')}
      </span>
    </div>
  )
}
