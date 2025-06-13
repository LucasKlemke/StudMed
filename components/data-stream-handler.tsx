'use client'

import { useChat } from 'ai/react'
import { useEffect, useRef } from 'react'
import { BlockKind } from './block'
import { Suggestion } from '@/lib/db/schema'
import { initialBlockData, useBlock } from '@/hooks/use-block'
import { useUserMessageId } from '@/hooks/use-user-message-id'



type DataStreamDelta = {
  type:
    | 'text-delta'
    | 'code-delta'
    | 'title'
    | 'id'
    | 'suggestion'
    | 'clear'
    | 'finish'
    | 'user-message-id'
    | 'kind'
  content: string | Suggestion
}

export function DataStreamHandler({ id }: { id: string }) {
  // Obtém o fluxo de dados do chat usando o hook useChat
  const { data: dataStream } = useChat({ id })
  // Hook para definir o ID da mensagem do usuário recebido do servidor
  const { setUserMessageIdFromServer } = useUserMessageId()
  // Hook para atualizar o bloco de dados exibido na interface
  const { setBlock } = useBlock()
  // Ref para armazenar o índice do último delta processado
  const lastProcessedIndex = useRef(-1)

  useEffect(() => {
    // Se não houver dados no fluxo, não faz nada
    if (!dataStream?.length) return

    // Obtém apenas os novos deltas que ainda não foram processados
    const newDeltas = dataStream.slice(lastProcessedIndex.current + 1)
    // Atualiza o índice do último delta processado
    lastProcessedIndex.current = dataStream.length - 1

    // Itera sobre cada novo delta recebido
    ;(newDeltas as DataStreamDelta[]).forEach((delta: DataStreamDelta) => {
      // Se o delta for do tipo 'user-message-id', atualiza o ID da mensagem do usuário e retorna
      if (delta.type === 'user-message-id') {
        setUserMessageIdFromServer(delta.content as string)
        return
      }

      // Atualiza o bloco de dados conforme o tipo do delta recebido
      setBlock((draftBlock) => {
        // Se não houver bloco atual, inicializa um novo bloco com status 'streaming'
        if (!draftBlock) {
          return { ...initialBlockData, status: 'streaming' }
        }

        // Manipula o delta de acordo com seu tipo
        switch (delta.type) {
          case 'id':
            // Atualiza o documentId do bloco
            return {
              ...draftBlock,
              documentId: delta.content as string,
              status: 'streaming',
            }

          case 'title':
            // Atualiza o título do bloco
            return {
              ...draftBlock,
              title: delta.content as string,
              status: 'streaming',
            }

          case 'kind':
            // Atualiza o tipo (kind) do bloco
            return {
              ...draftBlock,
              kind: delta.content as BlockKind,
              status: 'streaming',
            }

          case 'text-delta':
            // Adiciona o novo texto ao conteúdo existente e pode tornar o bloco visível dependendo do tamanho do conteúdo
            return {
              ...draftBlock,
              content: draftBlock.content + (delta.content as string),
              isVisible:
                draftBlock.status === 'streaming' &&
                draftBlock.content.length > 400 &&
                draftBlock.content.length < 450
                  ? true
                  : draftBlock.isVisible,
              status: 'streaming',
            }

          case 'code-delta':
            // Atualiza o conteúdo do bloco com o novo código e pode tornar o bloco visível dependendo do tamanho do conteúdo
            return {
              ...draftBlock,
              content: delta.content as string,
              isVisible:
                draftBlock.status === 'streaming' &&
                draftBlock.content.length > 300 &&
                draftBlock.content.length < 310
                  ? true
                  : draftBlock.isVisible,
              status: 'streaming',
            }

          case 'clear':
            // Limpa o conteúdo do bloco
            return {
              ...draftBlock,
              content: '',
              status: 'streaming',
            }

          case 'finish':
            // Marca o bloco como finalizado (idle)
            return {
              ...draftBlock,
              status: 'idle',
            }

          default:
            // Para qualquer outro tipo de delta, retorna o bloco sem alterações
            return draftBlock
        }
      })
    })
  // O efeito depende do fluxo de dados, da função de atualizar o bloco e da função de atualizar o ID da mensagem do usuário
  }, [dataStream, setBlock, setUserMessageIdFromServer])

  // Este componente não renderiza nada na interface
  return null
}
