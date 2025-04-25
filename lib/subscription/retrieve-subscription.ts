'use server'
import { getUserById } from '../db/queries'
import { stripe } from '../stripe'

export const fetchUserSubscription = async (userId: string) => {
  // fetchUser
  const user = await getUserById(userId)

  // fetch from abacatePay
  const abacateBillingResponse = await fetch(
    'http://localhost:3000/api/webhook/abacatepay/list-billings',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )

  const abacateBilling = await abacateBillingResponse.json()

  // fetch from Stripe
  const stripeSubscriptionsResponse = await fetch(
    'http://localhost:3000/api/webhook/stripe/list-subscriptions',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )

  // const customer = stripe.customers.retrieve(userId)
//   const subscriptions = stripe.subscriptions.list()

  const stripeSubscriptions = await stripe.subscriptions.list()

  console.log('userId', userId)
  console.log('user', user)
  console.log('abacateBilling', abacateBilling)

  console.log('stripeSubscriptions', stripeSubscriptions)
}
