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
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

export function AppSidebar({ user }: { user: User | undefined }) {
  const router = useRouter()
  const { setOpenMobile } = useSidebar()

  return (
    <Sidebar className="group-data-[side=left]:border-r-0">
      <SidebarHeader>
        <SidebarMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/"
                onClick={() => {
                  setOpenMobile(false)
                }}
                className="flex flex-row gap-3 items-center"
              >
                <span className="text-lg rounded-2xl text-primary-foreground  bg-primary  cursor-pointer flex  items-center justify-center w-full mt-5">
                  Novo Chat
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    className=" hover:bg-transparent hover:text-"
                    onClick={() => {
                      setOpenMobile(false)
                      router.push('/')
                      router.refresh()
                    }}
                  >
                    <PlusIcon />
                  </Button>
                </span>
              </Link>
            </TooltipTrigger>
            <TooltipContent align="end">Novo chat</TooltipContent>
          </Tooltip>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarHistory user={user} />
      </SidebarContent>
      <SidebarFooter>{user && <SidebarUserNav user={user} />}</SidebarFooter>
    </Sidebar>
  )
}
