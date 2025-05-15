'use client'

import type {
  Attachment,
  ChatRequest,
  ChatRequestOptions,
  CreateMessage,
  Message,
} from 'ai'
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
import { SubscriptionModal } from '@/components/subscription-modal'
import { isOverWeeklyMessageLimit } from '@/lib/db/isOverWeeklyMessageLimit'

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
  // verify language
  const userLanguage =
    typeof window !== 'undefined'
      ? navigator.language === 'pt-BR'
        ? 'ptBR'
        : 'en'
      : 'en'

  const { mutate } = useSWRConfig()

  const { subject, webSearch, bookRag }: any = useSubjectStore()

  const {
    messages,
    setMessages,
    handleSubmit: chatHandleSubmit,
    input,
    setInput,
    append: chatAppend,
    isLoading,
    stop,
    reload,
  } = useChat({
    id,
    body: {
      id,
      modelId: selectedModelId,
      subject: subject.id,
      webSearch,
      bookRag,
      userLanguage,
    },
    initialMessages,
    onFinish: (message, { usage }) => {
      // console.log(message)
      // console.log('Token usage:', usage)
      mutate('/api/history')
    },
  })
  const [blockedMessageUser, setBlockedMessageUser] = useState(false)
  const [openSubscriptionModal, setOpenSubscriptionModal] = useState(false)

  // Handles form submission by checking if the user is over their weekly message limit.
  // If the user is within the limit or has a subscription, the submission proceeds.
  // Otherwise, the user is blocked, and a subscription modal is displayed.
  async function handleSubmit(
    event?: {
      preventDefault?: () => void
    },
    chatRequestOptions?: ChatRequestOptions,
  ) {
    const overLimit = await isOverWeeklyMessageLimit(user.id!)

    if (subscription || !overLimit) {
      chatHandleSubmit(event, chatRequestOptions)
    } else {
      console.log('PASSOU 1')
      setBlockedMessageUser(true)
      setOpenSubscriptionModal(true)
    }
  }

  async function append(
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions,
  ): Promise<string | null | undefined> {
    const overLimit = await isOverWeeklyMessageLimit(user.id!)

    if (subscription || !overLimit) {
      return chatAppend(message, chatRequestOptions)
    } else {
      console.log('PASSOU 2')
      setBlockedMessageUser(true)
      setOpenSubscriptionModal(true)
    }
  }

  const { data: votes } = useSWR<Array<Vote>>(`/api/vote?chatId=${id}`, fetcher)

  const [attachments, setAttachments] = useState<Array<Attachment>>([])
  const isBlockVisible = useBlockSelector((state) => state.isVisible)

  return (
    <>
      {openSubscriptionModal && (
        <SubscriptionModal onClose={() => setOpenSubscriptionModal(false)} />
      )}

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
                  (invocation) => invocation.toolName === 'webScraping',
                ),
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
                blockedMessageUser={blockedMessageUser}
                isLoading={isLoading}
                stop={stop}
                attachments={attachments}
                setAttachments={setAttachments}
                messages={messages.filter(
                  (message) =>
                    !message.toolInvocations ||
                    !message.toolInvocations.some(
                      (invocation) => invocation.toolName === 'webScraping',
                    ),
                )}
                setMessages={setMessages}
                append={append}
              />
            )}
          </form>
        </div>
      </div>

      <Block
        blockedMessageUser={blockedMessageUser}
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
