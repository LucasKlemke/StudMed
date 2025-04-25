import { NextRequest, NextResponse } from 'next/server'
import abacate from '@/lib/abacatepay'

// create a new customer
// POST /api/webhook/abacatepay/create-client
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const customerData = {
      name: body.name,
      cellphone: body.cellphone,
      email: body.email,
      //   cpf
      taxId: body.taxId,
    }
    const client = await abacate.customer.create(customerData)

    console.log('Client created:', client)
    return NextResponse.json(client, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
