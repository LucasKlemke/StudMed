'use client'

import type { User } from 'next-auth'
import { useRouter } from 'next/navigation'

import { PlusIcon } from '@/components/icons'
import { SidebarHistory } from '@/components/sidebar-history'
import { SidebarUserNav } from '@/components/sidebar-user-nav'
import { Button } from '@/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { SubjectSwitcher } from './subject-switcher'
import { Label } from './ui/label'
import { Edit, Search } from 'lucide-react'
import { SidebarToggle } from './sidebar-toggle'
import { Input } from './ui/input'
import { HistorySearch } from './history-search'
import { useWindowSize } from 'usehooks-ts'

export function AppSidebar({ user }: { user: User | undefined }) {
  const router = useRouter()
  const { setOpenMobile } = useSidebar()
    const { width: windowWidth } = useWindowSize()
  return (
    <Sidebar className="group-data-[side=left]:border-r-0">
      <div className="flex w-full justify-between px-5 pt-5">
        <SidebarToggle />
        <div className="flex gap-x-3">
          {windowWidth > 425 && <HistorySearch user={user} />}

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/"
                onClick={() => {
                  setOpenMobile(false)
                }}
                className="flex flex-row gap-3 items-center"
              >
                <Button
                  onClick={() => {
                    setOpenMobile(false)
                    router.push('/')
                    router.refresh()
                  }}
                  variant="outline"
                  className="md:px-2 md:h-fit rounded-2xl"
                >
                  <Edit />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent align="end">Novo chat</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <SidebarHeader>
        <SidebarMenu className="py-5">
          {windowWidth > 426 && (
            <>
              <Label>Selecionar matéria</Label>
              <SubjectSwitcher />
            </>
          )}
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarHistory user={user} />
      </SidebarContent>
      <SidebarFooter>{user && <SidebarUserNav user={user} />}</SidebarFooter>
    </Sidebar>
  )
}
