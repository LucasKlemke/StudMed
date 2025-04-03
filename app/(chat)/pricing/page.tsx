'use client'

import { useState } from 'react'
import { Check, CreditCard } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import PaymentButton from '../account/components/payment-button'

const plans = [
  {
    name: 'Premium',
    description: 'Acesso completo a todos os recursos',
    price: 29.9,
    link: 'https://buy.stripe.com/test_aEUdUHgLYgDf8wMdQQ',
    priceId: 'price_1R9Ze7C73rvGfwkJRjqu6l74',
    billingCycle: 'monthly',
    features: [
      'Seletor de matéria',
      'Geração de questões de múltipla escolha',
      'Contexto Especializado',
      'Respostas rápidas e precisas',
      'Seletor de matérias',
      'Geração de PDFs',
      'Suporte prioritário',
    ],
  },
]

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(
    'monthly'
  )
  const selectedPlan = plans.find((plan) => plan.billingCycle === billingCycle)

  return (
    <div className=" bg-gradient-to-b from-gray-50 to-gray-100 dark:from-emerald-900 dark:to-slate-950 py-20">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Turbine seus estudos
          </h1>
          <p className="text-xl text-muted-foreground">
            Adquira acesso completo a todos os recursos da plataforma.
          </p>
        </div>

        {selectedPlan && (
          <div className="max-w-2xl mx-auto">
            <Card className=" shadow-lg overflow-hidden">
              {/* Hero product image */}
              <div className="relative w-full h-64">
                <Image
                  src="https://st3.depositphotos.com/1743476/32257/i/450/depositphotos_322579018-stock-photo-smiling-doctor-standing-on-grey.jpg"
                  alt="Product hero image"
                  fill
                  className="object-cover object-top"
                  priority
                />
              </div>

              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-x-2 text-2xl">
                  <CreditCard />
                  {selectedPlan.name}
                </CardTitle>
                <CardDescription>{selectedPlan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    R${selectedPlan.price.toFixed(2)}
                  </span>
                  <span className="text-muted-foreground ml-1">
                    {billingCycle === 'monthly' ? '/mês' : '/ano'}
                  </span>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    {/* Feature thumbnails */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {[1, 2, 3].map((item) => (
                        <div
                          key={item}
                          className="relative aspect-square rounded-lg overflow-hidden border border-gray-200"
                        >
                          <Image
                            src={`https://st3.depositphotos.com/1743476/32257/i/450/depositphotos_322579018-stock-photo-smiling-doctor-standing-on-grey.jpg`}
                            alt={`Feature ${item}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h4 className="font-medium mb-4">O que está incluído:</h4>
                    <ul className="space-y-3">
                      {selectedPlan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <PaymentButton>Compre agora</PaymentButton>
              </CardFooter>
            </Card>

            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p>
                Ao assinar, você concorda com nossos termos de serviço e
                política de privacidade.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
