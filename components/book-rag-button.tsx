// components/book-rag-button.tsx
// This file defines the BookRagButton component, which toggles the GuytonRag state
// and provides a tooltip for searching in Guyton (beta).

'use client'

import * as React from 'react'
import { BookCheck } from 'lucide-react'
import { useSubjectStore } from '@/store/subject'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export function BookRagButton() {
  const t = useTranslations('Chat.BookRagButton')
  const { bookRag, setBookRag, subject }: any = useSubjectStore()
  const disabled = subject.id === 'geral'
  // const disabled = subject.id !== 'fisiologia'

  if (disabled) {
    return <> </>
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <BookCheck
          onClick={() => {
            try {
              setBookRag(!bookRag)
              if (!bookRag) {
                toast.success(t('bookSearchActivated'))
              } else {
                toast.success(t('bookSearchDeactivated'))
              }
            } catch (e) {
              if (!bookRag) {
                toast.error(t('errorWhenApplying'))
              } else {
                toast.error(t('errorWhenRemoving'))
              }
            }
          }}
          className={`${
            bookRag ? 'text-primary' : ''
          } cursor-pointer hover:scale-105`}
        />
      </TooltipTrigger>
      <TooltipContent>{t('tooltip')}</TooltipContent>
    </Tooltip>
  )
}
