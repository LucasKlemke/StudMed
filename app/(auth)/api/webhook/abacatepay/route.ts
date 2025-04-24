import abacate from '@/lib/abacatepay'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const billing = await abacate.billing.create({
      frequency: 'ONE_TIME',
      methods: ['PIX'],
      products: [
        {
          externalId: 'PRO-PLAN-001',
          name: 'Pro Plan Subscription',
          quantity: 1,
          price: 50000000000, // Amount in cents (e.g., 10.00 BRL)
        },
      ],
      returnUrl: 'https://yoursite.com/app',
      completionUrl: 'https://yoursite.com/pagamento/sucesso',
      customer: {
        email: 'customer@example.com',
        name: 'John Doe',
        cellphone: '01912341234',
        taxId: '13827826837',
      },
    })

    console.log('Billing created successfully:', {
      billingId: billing._id,
      paymentUrl: billing.url,
      amount: billing.amount,
      status: billing.status,
    })
    console.log('Assinatura criada com sucesso:', billing)
    return NextResponse.json({ billing }, { status: 200 })
  } catch (error) {
    console.error('Erro ao criar assinatura:', error)
    return NextResponse.json(
      { error: 'Erro ao criar assinatura' },
      { status: 500 },
    )
  }
}
