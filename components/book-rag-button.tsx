// components/book-rag-button.tsx
// This file defines the BookRagButton component, which toggles the GuytonRag state
// and provides a tooltip for searching in Guyton (beta).

'use client'

import * as React from 'react'
import { BookCheck, Globe } from 'lucide-react'
import { useSubjectStore } from '@/store/subject'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { useTranslations } from 'next-intl'

export function BookRagButton() {
  const t = useTranslations('Chat.BookRagButton')
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
      <TooltipContent>{t('tooltip')}</TooltipContent>
    </Tooltip>
  )
}
