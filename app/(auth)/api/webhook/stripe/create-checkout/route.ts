import { stripe } from '@/lib/stripe'
import { NextRequest, NextResponse } from 'next/server'

const priceId = process.env.MONTLHY_PRICE_ID

// POST /api/webhook/stripe/create-checkout
export async function POST(req: NextRequest) {
  try {
    const { userId, userEmail } = await req.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing priceId or userId' },
        { status: 400 },
      )
    }

    const success_url = `${req.headers.get(
      'origin',
    )}/payment-confirmation?session_id={CHECKOUT_SESSION_ID}`

    const cancel_url = `${req.headers.get('origin')}/chat`

    const checkout = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          adjustable_quantity: { enabled: true },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      customer_email: userEmail,
      subscription_data: { metadata: { userId } },
      success_url: success_url,
      cancel_url: cancel_url,
    })

    return NextResponse.json({ url: checkout.url! })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
