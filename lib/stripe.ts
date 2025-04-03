import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '')

export async function fetchStripeSubscriptionByEmail(email: string) {
  const customers = await stripe.customers.list({
    limit: 1,
    email,
    expand: ['data.subscriptions'],
  })

  //   caso nao tenha customer
  if (customers.data.length === 0) {
    return null
  }

  const customer = customers.data[0]

  //   caso nao tenha assinatura
  if (customer.subscriptions?.data.length === 0) {
    return null
  }

  const subscription = customer.subscriptions?.data[0]

  return subscription
}
