'use client'
import {
  ChevronUp,
  ClipboardPlus,
  Heart,
  Info,
  LogOut,
  Moon,
  Settings,
  Sun,
  User,
  User2,
} from 'lucide-react'
import type { User as AuthUser } from 'next-auth'
import { signOut } from 'next-auth/react'
import { useTheme } from 'next-themes'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { Button } from './ui/button'

export function SidebarUserNav({ user }: { user: AuthUser }) {
  const { setTheme, theme } = useTheme()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent shadow-md dark:shadow-none border data-[state=open]:text-sidebar-accent-foreground h-12 rounded-xl">
              <div className="flex flex-col pl-1">
                <div className='flex items-center gap-x-2'>
                  <ClipboardPlus className='h-5 w-5'/>
                  <span className="truncate font-semibold text-lg">
                    {user?.username}
                  </span>
                </div>
                <span className="truncate text-xs text-sidebar-foreground/50">
                  {user?.email}
                </span>
              </div>

              <Settings className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            className="w-[--radix-popper-anchor-width]"
          >
            <Link href="/account">
              <DropdownMenuItem className={`cursor-pointer `}>
                <User />
                Conta
              </DropdownMenuItem>
            </Link>
            {/* <DropdownMenuItem className={`cursor-pointer `}>
              <Gem/>Meu plano
            </DropdownMenuItem> */}
            <DropdownMenuItem className={`cursor-pointer `}>
              <Info /> Suporte
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className={`cursor-pointer `}
              onSelect={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun /> : <Moon />}
              {`${theme === 'dark' ? 'Modo claro' : 'Modo escuro'}`}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <button
                type="button"
                className="w-full cursor-pointer"
                onClick={() => {
                  signOut({
                    redirectTo: '/',
                  })
                }}
              >
                <LogOut />
                Sair
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
