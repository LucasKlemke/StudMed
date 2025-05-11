// components/switcher.tsx

'use client'

import * as React from 'react'
import { BookCheck, Globe } from 'lucide-react'
import { useSubjectStore } from '@/store/subject'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

export function BookRagButton() {
  const { guytonRag, setGuytonRag }: any = useSubjectStore()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <BookCheck
          onClick={() => setGuytonRag(!guytonRag)}
          className={`${
            guytonRag ? 'text-primary' : ''
          } cursor-pointer hover:scale-105`}
        />
      </TooltipTrigger>
      <TooltipContent>Procurar no Guyton (beta)</TooltipContent>
    </Tooltip>
  )
}
