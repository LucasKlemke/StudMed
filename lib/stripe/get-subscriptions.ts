import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'

export async function getSubscriptions() {
  const stripePrices = await stripe.prices.list({
    active: true,
    type: 'recurring',
    expand: ['data.product'],
  })

  return stripePrices.data.map((price) => {
    const product = price.product as Stripe.Product
    return {
      plan: price.lookup_key || product.name.toLowerCase().replaceAll(' ', '_'),
      name: product.name,
      priceId: price.id,
      interval: price.recurring!.interval,
      price: { currency: price.currency, amount: price.unit_amount },
    }
  })
}
