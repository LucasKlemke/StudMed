import { NextRequest, NextResponse } from 'next/server'
import abacate from '@/lib/abacatepay'

// POST /api/webhook/abacatepay/create-billing
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // const payload = {
    //   frequency: 'MULTIPLE_PAYMENTS',
    //   methods: ['PIX'],
    //   products: [
    //     {
    //       externalId: '4124124124124412',
    //       name: 'Studmed 1 mes',
    //       quantity: 1,
    //       // 29,90 reais
    //       price: 2990,
    //       description: 'Assinatura mensal Studmed',
    //     },
    //   ],
    //   returnUrl: 'http://localhost:3000/teste',
    //   completionUrl: 'http://localhost:3000/payment-confirmation',
    //   customerId: body.customerId,
    // }
    const success_url = `${req.headers.get(
      'origin',
    )}/payment-confirmation?session_id={CHECKOUT_SESSION_ID}`

    const cancel_url = `${req.headers.get('origin')}/chat`

    const billing = await abacate.billing.create({
      frequency: 'ONE_TIME',
      methods: ['PIX'],
      products: [
        {
          externalId: '4124124124124412',
          name: 'Studmed 1 mes',
          quantity: 1,
          // 29,90 reais
          price: 2990,
          description: 'Assinatura mensal Studmed',
        },
      ],
      returnUrl: success_url,
      completionUrl: cancel_url,
      customerId: body.customerId,
      // customer: {
      //   email: 'customer@example.com',
      // },
    })

    // const response = await fetch(
    //   'https://api.abacatepay.com/v1/billing/create',
    //   {
    //     method: 'POST',
    //     headers: {
    //       Authorization: 'Bearer abc_dev_y3z3Gkk3LXYGF6JBL1b2fx6f',
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(payload),
    //   },
    // )

    // const data = await response.json()

    // console.log('Billing created:', billing)

    return NextResponse.json(billing, { status: 200 })
  } catch (error) {
    console.error('Error creating billing:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
