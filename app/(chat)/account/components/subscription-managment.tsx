'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Check, CreditCard } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { year } from 'drizzle-orm/mysql-core'
import { User } from 'next-auth'
import PaymentButton from './payment-button'

const plans = [
  {
    name: 'Premium',
    description: 'Acesso completo a todos os recursos',
    price: 29.99,
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
  {
    name: 'Premium',
    description: 'Acesso completo a todos os recursos',
    price: 299.99,
    link: 'https://buy.stripe.com/test_bIY17V9jwgDf6oE7st',
    priceId: 'price_1R9ZgkC73rvGfwkJQuRCQK2b',
    billingCycle: 'yearly',
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

export default function SubscriptionManagement({ user }: { user: User }) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(
    'monthly'
  )

  const selectedPlan = plans.find((plan) => plan.billingCycle === billingCycle)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-4">Escolha seu plano</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Acesso completo a todos os recursos com 14 dias de avaliação gratuita.
        </p>

        <div className="flex items-center justify-center mt-6 space-x-2">
          <Label htmlFor="billing-toggle">Mensal</Label>
          <Switch
            id="billing-toggle"
            checked={billingCycle === 'yearly'}
            onCheckedChange={(checked) =>
              setBillingCycle(checked ? 'yearly' : 'monthly')
            }
          />
          <Label htmlFor="billing-toggle" className="flex items-center">
            Anual
            {billingCycle === 'yearly' && selectedPlan && (
              <Badge
                variant="outline"
                className="ml-2 bg-green-50 text-green-700 border-green-200"
              >
                Economize{' '}
                {Math.round(
                  (1 - selectedPlan.price / (plans[0].price * 12)) * 100
                )}
                %
              </Badge>
            )}
          </Label>
        </div>
      </div>

      {selectedPlan && (
        <div className="max-w-md mx-auto">
          <Card className="border-primary shadow-md">
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-x-2">
                <CreditCard />
                {selectedPlan.name}
              </CardTitle>
              <CardDescription>{selectedPlan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">
                  R${selectedPlan.price.toFixed(2)}
                </span>
                <span className="text-muted-foreground">
                  {billingCycle === 'monthly' ? '/mês' : '/ano'}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="font-medium">O que está incluído:</h4>
                <ul className="space-y-2">
                  {selectedPlan.features.map((feature, index) => (
                    <li className="flex items-start" key={index}>
                      <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              {/* <Link
                href={`${selectedPlan.link}?prefilled_email=${user?.email}`}
                target="_blank"
                className="w-full"
              >
                <Button className="w-full">Assinar</Button>
              </Link> */}
              <PaymentButton>Compre agora</PaymentButton>
            </CardFooter>
          </Card>
        </div>
      )}

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>
          Ao assinar, você concorda com nossos termos de serviço e política de
          privacidade.
        </p>
      </div>
    </div>
  )
}
