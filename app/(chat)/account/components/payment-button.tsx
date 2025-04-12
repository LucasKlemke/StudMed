
'use client'

import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { loadStripe } from '@stripe/stripe-js'
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { useCallback } from 'react'
import { useSession } from 'next-auth/react'

type PaymentButtonProps = {
  children: React.ReactNode
  className?: string
}

const PaymentButton = ({ children, className }: PaymentButtonProps) => {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ''
  )

  const { data: session } = useSession()
  const fetchClientSecret = useCallback(() => {
    return fetch('/api/webhook/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        email: session?.user?.email ?? '',
      },
    })
      .then((res) => res.json())
      .then((data) => data.client_secret)
  }, [])

  const options = { fetchClientSecret }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={`w-full ${className}`}>{children}</Button>
      </DialogTrigger>
      <DialogContent className='bg-white text-black'>
        <>
          <VisuallyHidden.Root>
            <DialogTitle>Assinatura Pro</DialogTitle>
          </VisuallyHidden.Root>
          <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
            <EmbeddedCheckout/>
          </EmbeddedCheckoutProvider>
        </>
      </DialogContent>
    </Dialog>
  )
}

export default PaymentButton
