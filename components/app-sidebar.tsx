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
import { Edit, MessageCircleMore, Search, Settings } from 'lucide-react'
import { SidebarToggle } from './sidebar-toggle'
import { Input } from './ui/input'
import { HistorySearch } from './history-search'
import { useWindowSize } from 'usehooks-ts'
import { DataSourceSwitcher } from './data-source-switcher'

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
              <Button
                onClick={() => {
                  setOpenMobile(false)
                  router.push('/chat')
                  router.refresh()
                }}
                variant="outline"
                className="md:px-2 md:h-fit rounded-2xl"
              >
                <Edit />
              </Button>
            </TooltipTrigger>
            <TooltipContent align="end">Novo chat</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <SidebarHeader>
        {/* {user && <SidebarUserNav user={user} />} */}

        {/* <SidebarMenu className="py-5">
          {windowWidth > 426 && (
            <div className="w-full flex flex-col gap-y-4">
              <div className="w-full flex flex-col gap-y-2">
                <Label>Selecionar fonte</Label>
                <DataSourceSwitcher />
              </div>
              <div className="w-full flex flex-col gap-y-2">
                {' '}
                <Label>Selecionar matéria</Label>
                <SubjectSwitcher />
              </div>
            </div>
          )}
        </SidebarMenu> */}
      </SidebarHeader>
      <SidebarContent>
        <SidebarHistory user={user} />
      </SidebarContent>
      {windowWidth <= 425 && (
        <div>
          <SidebarUserNav user={user as User} />
        </div>
      )}
      {/* <SidebarFooter>{user && <SidebarUserNav user={user} />}</SidebarFooter> */}
    </Sidebar>
  )
}
