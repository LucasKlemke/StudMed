import { Metadata } from 'next'

import Title from './title'

import Content from './components/content'

export const metadata: Metadata = {
  title: 'Account Management',
  description: 'Manage your account settings and preferences.',
}

export default async function AccountPage() {
  return (
    <div className="container mx-10 py-10">
      <Title />

      <Content />
    </div>
  )
}
