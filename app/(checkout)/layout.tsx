import { StudMedLogo } from '@/components/studmed-logo'
import Link from 'next/link'
import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="flex bg-gradient-to-b from-gray-50 to-gray-100 dark:from-emerald-900 h-screen dark:to-slate-950 flex-col items-center justify-center py-40">
     
      {children}
    </section>
  )
}

export default Layout
