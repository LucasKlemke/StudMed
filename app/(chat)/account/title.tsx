'use client'
import { SidebarToggle } from '@/components/sidebar-toggle'
import { useSidebar } from '@/components/ui/sidebar'
import React from 'react'
import { useWindowSize } from 'usehooks-ts'

const Title = () => {
  const { open } = useSidebar()

  const { width: windowWidth } = useWindowSize()

  return (
    <div className="flex gap-x-3">
      {(!open || windowWidth < 768) && <SidebarToggle />}
      <h1 className="text-4xl font-bold mb-10">Gerenciar conta</h1>
    </div>
  )
}

export default Title
