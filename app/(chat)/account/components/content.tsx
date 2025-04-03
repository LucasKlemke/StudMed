'use client'
import React from 'react'
import AccountInfo from './account-info'
import SubscriptionManagement from './subscription-managment'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'

const Content = () => {
  const { data: session, update } = useSession()
  return (
    <div className="space-y-10">
      <SubscriptionManagement user={session?.user as User} />
      <AccountInfo user={session?.user as User} />
    </div>
  )
}

export default Content
