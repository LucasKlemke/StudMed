import type { ComponentProps } from 'react'

import { type SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import { SidebarLeftIcon } from './icons'
import { Button } from './ui/button'
import { useTranslations } from 'next-intl'

export function SidebarToggle({
  className,
}: ComponentProps<typeof SidebarTrigger>) {
  const { toggleSidebar } = useSidebar()
  const t = useTranslations('Chat.SidebarToggle')

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={toggleSidebar}
          variant="outline"
          className="md:px-2 md:h-fit rounded-2xl"
        >
          <SidebarLeftIcon size={16} />
        </Button>
      </TooltipTrigger>
      <TooltipContent align="start">{t('toggle')}</TooltipContent>
    </Tooltip>
  )
}
