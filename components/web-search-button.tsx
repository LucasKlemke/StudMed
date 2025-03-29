// components/switcher.tsx

'use client'

import * as React from 'react'
import { Globe } from 'lucide-react'
import { useSubjectStore } from '@/store/subject'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

export function WebSearchButton() {
  const { webSearch, setWebSearch }: any = useSubjectStore()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Globe
          onClick={() => setWebSearch(!webSearch)}
          className={`${
            webSearch ? 'text-primary' : ''
          } cursor-pointer hover:scale-105`}
        />
      </TooltipTrigger>
      <TooltipContent>Procurar em fontes da web (beta)</TooltipContent>
    </Tooltip>
  )
}
