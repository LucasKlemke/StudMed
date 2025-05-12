'use client'

import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { ChatRequestOptions, CreateMessage, Message } from 'ai'
import { memo } from 'react'
import { Blocks, MessageCircleQuestion, Search, Text } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface SuggestedActionsProps {
  chatId: string
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>
}

function PureSuggestedActions({ chatId, append }: SuggestedActionsProps) {
  const t = useTranslations('Chat.SuggestedActions')

  const suggestedActions = [
    {
      icon: <Search />,
      title: t('title1'),
      label: t('label1'),
      action: t('action1'),
    },
    {
      icon: <MessageCircleQuestion />,
      title: t('title2'),
      label: t('label2'),
      action: t('action2'),
    },
    {
      icon: <Text />,
      title: t('title3'),
      label: t('label3'),
      action: t('action3'),
    },
    {
      icon: <Blocks />,
      title: t('title4'),
      label: t('label4'),
      action: t('action4'),
    },
  ]

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2 w-full">
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 1 ? 'hidden sm:block' : 'block'}
        >
          <Button
            variant="ghost"
            onClick={async () => {
              window.history.replaceState({}, '', `/chat/${chatId}`)

              append({
                role: 'user',
                content: suggestedAction.action,
              })
            }}
            className="bg-white hover:border-primary dark:bg-background shadow-md dark:shadow-none border rounded-2xl px-4 py-3.5 sm:text-xs md:text-sm flex-1 gap-1 sm:flex-col w-full h-28 justify-center items-start"
          >
            {suggestedAction.icon}
            <span className="font-medium">{suggestedAction.title}</span>
            <span className="text-muted-foreground">
              {suggestedAction.label}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  )
}

export const SuggestedActions = memo(PureSuggestedActions, () => true)
