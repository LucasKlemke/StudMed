'use client'
import { SidebarToggle } from '@/components/sidebar-toggle'
import { useSidebar } from '@/components/ui/sidebar'
import React from 'react'

const Title = () => {
  const { open } = useSidebar()

  return (
    <div className="flex gap-x-3">
      {!open && <SidebarToggle />}
      <h1 className="text-4xl font-bold mb-10">Gerenciar conta</h1>
    </div>
  )
}

export default Title
