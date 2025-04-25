'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { CreditCard, QrCode } from 'lucide-react'
import PaymentButton from '../account/components/payment-button'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

const PaymentButtonModal = () => {
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()
  const userId = session?.user?.id || '' // Replace with your logic to get the user ID
  const userEmail = session?.user?.email || '' // Replace with your logic to get the user email

  const handlePaymentSelection = (method: string) => {
    console.log(`Selected payment method: ${method}`)
    // Here you would implement the actual payment processing logic
    setOpen(false)
  }

  const handleCreditCardPayment = async () => {
    const response = await fetch('/api/webhook/stripe/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        userEmail,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create checkout session')
    }

    // Redirect to Stripe Checkout
    if (data.url) {
      window.location.href = data.url
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="px-6">Assine agora</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Selecione o método de pagamento</DialogTitle>
          <DialogDescription>Escolha como deseja pagar.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {/* pix */}
          <Button
            asChild
            variant="outline"
            className="flex flex-col h-24 items-center justify-center gap-2"
            onClick={() => handlePaymentSelection('pix')}
          >
            <Link href="/pix-payment">
              <QrCode className="h-6 w-6" />
              <span>PIX</span>
            </Link>
          </Button>

          {/* cartao */}
          <Button
            variant="outline"
            className="flex flex-col h-24 items-center justify-center gap-2"
            onClick={() => handleCreditCardPayment()}
          >
            <CreditCard className="h-6 w-6" />
            <span>Cartão de crédito</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PaymentButtonModal
