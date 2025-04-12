'use client'

import { Info, LogOut, Moon, Settings, Sun, User } from 'lucide-react'
import type { User as AuthUser } from 'next-auth'
import { signOut } from 'next-auth/react'
import { useTheme } from 'next-themes'
import Link from 'next/link'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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

export function SidebarUserNav({ user }: { user: AuthUser }) {
  const { setTheme, theme } = useTheme()

  // Get initials from username for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton className="group relative h-auto rounded-xl   p-3  transition-all  data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-primary/10 shadow-sm">
              <AvatarImage src={user?.image || ''} alt={user?.username || ''} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user?.username ? getInitials(user.username) : 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </SidebarMenuButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="top"
        align="end"
        className="w-[--radix-popper-anchor-width]"
      >
        <Link href="/account">
          <DropdownMenuItem className="cursor-pointer gap-2 py-2">
            <User className="h-4 w-4" />
            <span>Conta</span>
          </DropdownMenuItem>
        </Link>

        <DropdownMenuItem className="cursor-pointer gap-2 py-2">
          <Link href={'/support'} className="gap-2 flex items-center">
            <Info className="h-4 w-4" />
            <span>Suporte</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer gap-2 py-2"
          onSelect={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          <span>{theme === 'dark' ? 'Modo claro' : 'Modo escuro'}</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer gap-2 py-2 text-destructive focus:text-destructive"
          onClick={() => {
            signOut({
              redirectTo: '/',
            })
          }}
        >
          <LogOut className="h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
