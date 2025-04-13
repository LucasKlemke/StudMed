'use client'

import type { Attachment, Message } from 'ai'
import { useChat } from 'ai/react'
import { useEffect, useState } from 'react'
import useSWR, { useSWRConfig } from 'swr'

import { ChatHeader } from '@/components/chat-header'
import type { Vote } from '@/lib/db/schema'
import { fetcher } from '@/lib/utils'

import { Block, type UIBlock } from './block'
import { MultimodalInput } from './multimodal-input'
import { Messages } from './messages'
import { VisibilityType } from './visibility-selector'
import { useSubjectStore } from '@/store/subject'
import { useBlockSelector } from '@/hooks/use-block'
import type { User as AuthUser } from 'next-auth'
import { SubscriptionModal } from '@/app/(chat)/pricing/subscription-modal'

export function Chat({
  id,
  initialMessages,
  selectedModelId,
  selectedVisibilityType,
  isReadonly,
  user,
  subscription,
}: {
  user: AuthUser
  id: string
  subscription: any | null | undefined
  initialMessages: Array<Message>
  selectedModelId: string
  selectedVisibilityType: VisibilityType
  isReadonly: boolean
}) {
  const { mutate } = useSWRConfig()

  const { subject, webSearch }: any = useSubjectStore()

  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    isLoading,
    stop,
    reload,
  } = useChat({
    id,
    body: { id, modelId: selectedModelId, subject: subject.id, webSearch },
    initialMessages,
    onFinish: (message, { usage }) => {
      // console.log(message)
      // console.log('Token usage:', usage)
      mutate('/api/history')
    },
  })

  const { data: votes } = useSWR<Array<Vote>>(`/api/vote?chatId=${id}`, fetcher)

  const [attachments, setAttachments] = useState<Array<Attachment>>([])
  const isBlockVisible = useBlockSelector((state) => state.isVisible)

  return (
    <>
      {!subscription && <SubscriptionModal />}

      <div className="flex flex-col min-w-0 h-dvh bg-background">

        {/* gradiente */}

        <ChatHeader
          user={user}
          chatId={id}
          selectedModelId={selectedModelId}
          selectedVisibilityType={selectedVisibilityType}
          isReadonly={isReadonly}
        />

        <div className="flex-1 overflow-y-auto pb-24">
          <Messages
            chatId={id}
            isLoading={isLoading}
            votes={votes}
            messages={messages.filter(
              (message) =>
                !message.toolInvocations ||
                !message.toolInvocations.some(
                  (invocation) => invocation.toolName === 'webScraping'
                )
            )}
            append={append}
            setMessages={setMessages}
            reload={reload}
            isReadonly={isReadonly}
            isBlockVisible={isBlockVisible}
          />
        </div>

        <div className="bg-background px-4 pb-4 md:pb-6">
          <form className="flex mx-auto px-4 bg-transparent pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
            {!isReadonly && (
              <MultimodalInput
                chatId={id}
                input={input}
                setInput={setInput}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                stop={stop}
                attachments={attachments}
                setAttachments={setAttachments}
                messages={messages.filter(
                  (message) =>
                    !message.toolInvocations ||
                    !message.toolInvocations.some(
                      (invocation) => invocation.toolName === 'webScraping'
                    )
                )}
                setMessages={setMessages}
                append={append}
              />
            )}
          </form>
        </div>
      </div>

      <Block
        chatId={id}
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        stop={stop}
        attachments={attachments}
        setAttachments={setAttachments}
        append={append}
        messages={messages}
        setMessages={setMessages}
        reload={reload}
        votes={votes}
        isReadonly={isReadonly}
      />
    </>
  )
}
