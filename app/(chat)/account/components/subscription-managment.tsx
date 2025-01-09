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

const plans = [
  // {
  //   name: 'Básico',
  //   price: 'R$9.99/mês',
  //   features: ['Feature 1', 'Feature 2', 'Feature 3'],
  // },
  // {
  //   name: 'Premium',
  //   price: 'R$19.99/mês',
  //   features: ['All Basic features', 'Feature 4', 'Feature 5'],
  // },
  // {
  //   name: 'Universidade',
  //   price: '',
  //   features: [
  //     'All Pro features',
  //     'Feature 6',
  //     'Feature 7',
  //     'Priority Support',
  //   ],
  // },
  {
    name: 'Beta',
    price: 'R$0.00/mês',
    features: [
      'Acesso Limitado de 1 mês',
      'Refêrencias acadêmicas',
      'Contexto Especializado',
      'Respostas rápidas e precisas',
      'Questões de fixação',
      'Geração de PDFs',
    ],
  },
]

export default function SubscriptionManagement() {
  const [isEditing, setIsEditing] = useState(false)
  const [currentPlan, setCurrentPlan] = useState(plans[0])

  const handleUpgrade = (plan: any) => {
    // Here you would typically handle the upgrade process
    console.log(`Upgrading to ${plan.name} plan`)
    setCurrentPlan(plan)
    setIsEditing(false)
  }

  return (
    <Card className="w-3/4">
      <CardHeader>
        <CardTitle className="flex gap-x-3">
          <CreditCard />
          Gerenciar plano
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
          {plans.map((plan) => (
            <Card
              className={`${
                plan.name === currentPlan.name ? 'ring-1 ring-primary sm:col-span-3 md:col-span-3 lg:col-span-1' : ''
              }`}
              key={plan.name}
            >
              <CardHeader>
                <CardTitle
                  className={`${
                    plan.name === currentPlan.name ? 'text-primary' : ''
                  }`}
                >
                  {plan.name}
                </CardTitle>
                <CardDescription>{plan.price}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside gap-y-2 flex flex-col">
                  {plan.features.map((feature, index) => (
                    <li className="flex justify-between" key={index}>
                      {feature} <Check className="text-primary" />
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handleUpgrade(plan)}
                  disabled={plan.name === currentPlan.name}
                >
                  {plan.name === currentPlan.name ? 'Plano Atual' : 'Upgrade'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="pt-3">
          <p>
            Plano atual{' '}
            <strong className="text-primary">{currentPlan.name} </strong> (
            {currentPlan.price.replace('/mês', '')})
          </p>
          <p>
            Acesso até: <strong>1 de Março de 2025</strong>
          </p>
        </div>
      </CardContent>
      <CardFooter className="gap-x-4">
        {/* {isEditing ? (
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancelar
          </Button>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Atualizar plano</Button>
        )} */}
        {/* <Button className="w-full" variant="destructive">
          Cancelar plano
        </Button> */}
      </CardFooter>
    </Card>
  )
}
