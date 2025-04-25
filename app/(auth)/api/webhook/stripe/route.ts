import { NextResponse } from 'next/server'

import Stripe from 'stripe'


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '')

// POST /api/webhook/stripe
export async function POST(request: Request) {
  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: [
        {
          // mensal
          quantity: 1,
          price: process.env.MONTLHY_PRICE_ID ?? '',
        },
      ],
      // assinatura
      mode: 'subscription',
      customer_email: request.headers.get('email') ?? '',
      // cartao, pix
      payment_method_types: ['card'],
      return_url: `${request.headers.get(
        'origin'
      )}/payment-confirmation?session_id={CHECKOUT_SESSION_ID}`,
    })

    return NextResponse.json({
      id: session.id,
      client_secret: session.client_secret,
    })
  } catch (error) {
    return Response.json(error, { status: 400 })
  }
}
