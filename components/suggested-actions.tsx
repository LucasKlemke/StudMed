'use client'

import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { ChatRequestOptions, CreateMessage, Message } from 'ai'
import { memo } from 'react'
import { Blocks, MessageCircleQuestion, Search, Text } from 'lucide-react'

interface SuggestedActionsProps {
  chatId: string
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>
}

function PureSuggestedActions({ chatId, append }: SuggestedActionsProps) {
  const suggestedActions = [
    {
      icon: <Search />,
      title: 'Gerar artigo',
      label: 'sobre diabetes tipo 2',
      action: 'Crie um artigo sobre diabetes tipo 2.',
    },
    {
      icon: <MessageCircleQuestion />,
      title: 'Gerar quiz',
      label: 'sobre anatomia humana',
      action: 'Crie um quiz sobre anatomia humana.',
    },
    {
      icon: <Text />,
      title: 'Documento PDF',
      label: 'entender a hipertensão',
      action: 'Gere um documento me explicando sobre o que é hipertensão.',
    },
    {
      icon: <Blocks />,
      title: 'Explicação',
      label: 'sobre doenças cardiovasculares',
      action: 'Crie um artigo sobre doenças cardiovasculares.',
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
