import type { ChatRequestOptions, CreateMessage, Message } from 'ai'
import { toast } from 'sonner'
import { useSWRConfig } from 'swr'
import { useCopyToClipboard } from 'usehooks-ts'

import type { Vote } from '@/lib/db/schema/vote'
import { getMessageIdFromAnnotations } from '@/lib/utils'

import { CopyIcon, ThumbDownIcon, ThumbUpIcon } from './icons'
import { Button } from './ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'
import { memo } from 'react'
import equal from 'fast-deep-equal'
import { ArrowDownWideNarrow, ArrowUpNarrowWide, ArrowUpWideNarrow, ChevronDown, ChevronUp, MessageCircleQuestion, NotebookPen } from 'lucide-react'

export function PureMessageActions({
  chatId,
  message,
  vote,
  isLoading,
  append,
}: {
  chatId: string
  message: Message
  vote: Vote | undefined
  isLoading: boolean
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>
}) {
  const { mutate } = useSWRConfig()
  const [_, copyToClipboard] = useCopyToClipboard()

  if (isLoading) return null
  if (message.role === 'user') return null
  if (message.toolInvocations && message.toolInvocations.length > 0) return null

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-row gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="py-1 px-2 h-fit text-primary"
              variant="inverted"
              onClick={async () => {
                await copyToClipboard(message.content as string)
                toast.success('Copied to clipboard!')
              }}
            >
              <CopyIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copiar</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="py-1 px-2 h-fit text-primary !pointer-events-auto"
              disabled={vote?.isUpvoted}
              variant="inverted"
              onClick={async () => {
                const messageId = getMessageIdFromAnnotations(message)

                const upvote = fetch('/api/vote', {
                  method: 'PATCH',
                  body: JSON.stringify({
                    chatId,
                    messageId,
                    type: 'up',
                  }),
                })

                toast.promise(upvote, {
                  loading: 'Upvoting Response...',
                  success: () => {
                    mutate<Array<Vote>>(
                      `/api/vote?chatId=${chatId}`,
                      (currentVotes) => {
                        if (!currentVotes) return []

                        const votesWithoutCurrent = currentVotes.filter(
                          (vote) => vote.messageId !== message.id
                        )

                        return [
                          ...votesWithoutCurrent,
                          {
                            chatId,
                            messageId: message.id,
                            isUpvoted: true,
                          },
                        ]
                      },
                      { revalidate: false }
                    )

                    return 'Resposta avaliada!'
                  },
                  error: 'Failed to upvote response.',
                })
              }}
            >
              <ThumbUpIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Resposta correta</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="py-1 px-2 h-fit text-primary !pointer-events-auto"
              variant="inverted"
              disabled={vote && !vote.isUpvoted}
              onClick={async () => {
                const messageId = getMessageIdFromAnnotations(message)

                const downvote = fetch('/api/vote', {
                  method: 'PATCH',
                  body: JSON.stringify({
                    chatId,
                    messageId,
                    type: 'down',
                  }),
                })

                toast.promise(downvote, {
                  loading: 'Downvoting Response...',
                  success: () => {
                    mutate<Array<Vote>>(
                      `/api/vote?chatId=${chatId}`,
                      (currentVotes) => {
                        if (!currentVotes) return []

                        const votesWithoutCurrent = currentVotes.filter(
                          (vote) => vote.messageId !== message.id
                        )

                        return [
                          ...votesWithoutCurrent,
                          {
                            chatId,
                            messageId: message.id,
                            isUpvoted: false,
                          },
                        ]
                      },
                      { revalidate: false }
                    )

                    return 'Resposta avaliada!'
                  },
                  error: 'Failed to downvote response.',
                })
              }}
            >
              <ThumbDownIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Resposta incorreta</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="py-1 px-2 h-fit text-primary !pointer-events-auto"
              variant="inverted"
              onClick={async () => {
                append({
                  role: 'user',
                  content: `Por favor, gere questões para melhor fixação do conteúdo.`,
                })
              }}
            >
              <NotebookPen />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Gerar questões</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="py-1 px-2 h-fit text-primary !pointer-events-auto"
              variant="inverted"
              onClick={async () => {
                append({
                  role: 'user',
                  content: `Por favor, simplifique a resposta, abortanto os pontos mais essênciais.`,
                })
              }}
            >
              <ArrowDownWideNarrow />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Simplificar</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="py-1 px-2 h-fit text-primary !pointer-events-auto"
              variant="inverted"
              onClick={async () => {
                append({
                  role: 'user',
                  content: `Por favor, torne o conteúdo o mais detalhado possível, aprofunde-se o máximo possível nos detalhes.`,
                })
              }}
            >
              <ArrowUpWideNarrow/>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Detalhar</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

export const MessageActions = memo(
  PureMessageActions,
  (prevProps, nextProps) => {
    if (!equal(prevProps.vote, nextProps.vote)) return false
    if (prevProps.isLoading !== nextProps.isLoading) return false

    return true
  }
)
