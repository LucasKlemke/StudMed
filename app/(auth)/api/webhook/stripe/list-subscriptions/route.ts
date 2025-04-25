import { NextResponse } from 'next/server'
import { getSubscriptions } from '@/lib/stripe/get-subscriptions'

export async function GET() {
  try {
    const subscriptions = await getSubscriptions()
    return NextResponse.json({ subscriptions })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 },
    )
  }
}
