'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { signOut } from 'next-auth/react'
import {
  Brain,
  GraduationCap,
  HandCoins,
  LogOut,
  NotebookPen,
  Star,
} from 'lucide-react'
import Image from 'next/image'
import PaymentButton from '../app/(chat)/account/components/payment-button'
import { Button } from '@/components/ui/button'

const premiumFeatures = [
  {
    name: 'Seletor de Matéria',
    description: 'Escolha exatamente a disciplina que deseja estudar.',
    icon: <GraduationCap className="h-6 w-6" />,
  },
  {
    name: 'Geração de Questões',
    description: 'Crie questões de múltipla escolha com base nos seus estudos.',
    icon: <NotebookPen className="h-6 w-6" />,
  },
  {
    name: 'Contexto Especializado',
    description: 'Obtenha respostas com base no assunto escolhido.',
    icon: <Brain className="h-6 w-6" />,
  },
  {
    name: 'Preço Acessível',
    description: 'Tudo isso pelo preço de 2 energéticos',
    icon: <HandCoins className="h-6 w-6" />,
  },
]

// Sample images - replace these with your actual images
const productImages = [
  '/images/subscription.png',
  '/images/quiz.png',
  '/images/subject-selector.png',
]

export function SubscriptionModal() {
  return (
    <Dialog open>
      <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden border-0 rounded-xl ">
        <div className="flex flex-col md:flex-row ">
          {/* Left side - Illustration */}
          <div className="w-full md:w-1/2  p-6 flex items-center justify-center relative">
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

            <p className="text-slate-400 mb-3">
              Inteligência Artificial para melhorar seus estudos
            </p>

            {/* Features grid */}
            <div className="flex flex-col gap-3 mb-8">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex flex-col">
                  <div className="flex gap-1 items-center">
                    <div className="text-2xl mb-1 text-primary">
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-primary">
                      {feature.name}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="mt-auto flex flex-col gap-1">
              <PaymentButton>
                ASSINE AGORA — Por apenas R$29.90/mês
              </PaymentButton>
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
