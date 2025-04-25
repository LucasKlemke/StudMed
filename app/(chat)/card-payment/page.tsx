'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'



export default function CheckoutPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState('')
  const [priceId, setPriceId] = useState('')

  const handleCheckout = async () => {
    if (!userId || !priceId) {
      toast.error('Please provide both a user ID and price ID')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/webhook/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          priceId,
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
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('Checkout failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Subscribe to Premium</CardTitle>
          <CardDescription>
            Complete your subscription purchase with our secure checkout.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userId">User ID</Label>
            <Input
              id="userId"
              placeholder="Enter your user ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priceId">Subscription Plan</Label>
            <Select onValueChange={setPriceId} value={priceId}>
              <SelectTrigger id="priceId">
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price_1234567890">
                  Monthly Plan ($9.99/month)
                </SelectItem>
                <SelectItem value="price_0987654321">
                  Annual Plan ($99.99/year)
                </SelectItem>
                <SelectItem value="price_5432167890">
                  Premium Plan ($19.99/month)
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 mt-1">
              You can also enter a custom price ID if you have one
            </p>
            {!priceId.startsWith('price_') && (
              <Input
                placeholder="Or enter a custom price ID (starts with price_)"
                value={priceId}
                onChange={(e) => setPriceId(e.target.value)}
                className="mt-2"
              />
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleCheckout}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Proceed to Checkout'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
