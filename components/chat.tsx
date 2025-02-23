'use client'

import type { Attachment, Message } from 'ai'
import { useChat } from 'ai/react'
import { useEffect, useState } from 'react'
import useSWR, { useSWRConfig } from 'swr'

import { ChatHeader } from '@/components/chat-header'
import type { Vote } from '@/lib/db/schema/vote'
import { fetcher } from '@/lib/utils'

import { Block, type UIBlock } from './block'
import { MultimodalInput } from './multimodal-input'
import { Messages } from './messages'
import { VisibilityType } from './visibility-selector'
import { useSubjectStore } from '@/store/subject'
import { useBlockSelector } from '@/hooks/use-block'

export function Chat({
  id,
  initialMessages,
  selectedModelId,
  selectedVisibilityType,
  isReadonly,
}: {
  id: string
  initialMessages: Array<Message>
  selectedModelId: string
  selectedVisibilityType: VisibilityType
  isReadonly: boolean
}) {
  const { mutate } = useSWRConfig()

  const { subject }: any = useSubjectStore()
  // console.log(subject.name)

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
    body: { id, modelId: selectedModelId, subject: subject.id },
    initialMessages,
    onFinish: (message, { usage }) => {
      console.log('Token usage:', usage)
      mutate('/api/history')
    },
  })

  const { data: votes } = useSWR<Array<Vote>>(`/api/vote?chatId=${id}`, fetcher)

  const [attachments, setAttachments] = useState<Array<Attachment>>([])
  const isBlockVisible = useBlockSelector((state) => state.isVisible)

  return (
    <>
      <div className="flex flex-col min-w-0 h-dvh bg-background">
        <ChatHeader
          chatId={id}
          selectedModelId={selectedModelId}
          selectedVisibilityType={selectedVisibilityType}
          isReadonly={isReadonly}
        />

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

        <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
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
