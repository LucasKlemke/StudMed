import { Metadata } from 'next'
import AccountInfo from './components/account-info'
import SecuritySettings from './components/security-settings'
import SubscriptionManagement from './components/subscription-managment'

export const metadata: Metadata = {
  title: 'Account Management',
  description: 'Manage your account settings and preferences.',
}

export default function AccountPage() {
  return (
    <div className="container mx-10 py-10">
      <h1 className="text-4xl font-bold mb-10">Gerenciar conta</h1>
      <div className="space-y-10">
        <SubscriptionManagement />
        <AccountInfo />
      </div>
    </div>
  )
}
