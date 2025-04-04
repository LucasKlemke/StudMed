import { Metadata } from 'next'

import Title from './title'

import { fetchStripeSubscriptionByEmail } from '@/lib/stripe'
import AccountInfo from './components/account-info'
import { auth } from '@/app/(auth)/auth'
import { User } from 'next-auth'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Account Management',
  description: 'Manage your account settings and preferences.',
}

export default async function AccountPage() {
  const session = await auth()
  const subscription = await fetchStripeSubscriptionByEmail(
    session?.user?.email as string
  )

  if (!subscription) {
    // redirect('/')
  }

  return (
    <div className="container px-10 py-10">
      <Title />
      <AccountInfo subscription={subscription} user={session?.user as User} />
    </div>
  )
}
