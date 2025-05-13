import { SuggestedActions } from './suggested-actions'
import { useSession } from 'next-auth/react'

import type { Attachment, ChatRequestOptions, CreateMessage, Message } from 'ai'
import type React from 'react'
import { useTranslations } from 'next-intl'

export const Overview = ({
  append,
  messages,
  chatId,
}: {
  chatId: string
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>
  messages: Array<Message>
}) => {
  const t = useTranslations('Chat.SuggestedActions')

  return (
    <div className=" mx-auto h-full flex flex-col content-center gap-y-9 gap-x-2 md:mt-20 justify-center ">
      <p className="text-center text-2xl md:text-4xl font-semibold">
        {t('title')}
      </p>
      {messages.length === 0 && (
        <SuggestedActions append={append} chatId={chatId} />
      )}
    </div>
  )
}
