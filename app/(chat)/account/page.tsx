import { Metadata } from 'next'
import AccountInfo from './components/account-info'
import SecuritySettings from './components/security-settings'
import SubscriptionManagement from './components/subscription-managment'
import { SidebarToggle } from '@/components/sidebar-toggle'
import Title from './title'

export const metadata: Metadata = {
  title: 'Account Management',
  description: 'Manage your account settings and preferences.',
}

export default function AccountPage() {
  return (
    <div className="container mx-10 py-10">
      <Title/>

      <div className="space-y-10">
        <SubscriptionManagement />
        <AccountInfo />
      </div>
    </div>
  )
}
