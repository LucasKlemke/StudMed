import { StudMedLogo } from '@/components/studmed-logo'
import Link from 'next/link'
import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="flex flex-col items-center justify-center py-40">
      <Link href={'/'}>
        <StudMedLogo className="w-6 h-6 lg:w-12 lg:h-12  text-primary" />
      </Link>
      {children}
    </section>
  )
}

export default Layout
