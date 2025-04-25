import abacate from '@/lib/abacatepay'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/webhook/abacatepay/list-billings
export async function GET(req: NextRequest) {
  try {
    // const response = await fetch('https://api.abacatepay.com/v1/billing/list', {
    //   method: 'GET',
    //   headers: {
    //     Authorization: 'Bearer abc_dev_y3z3Gkk3LXYGF6JBL1b2fx6f',
    //   },
    // })

    // const data = await response.json()
    const billings = abacate.billing.list()

    return NextResponse.json(billings, { status: 200 })
  } catch (error) {
    console.error('Error listing billings:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
