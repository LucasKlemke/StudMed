import { cn, generateUUID } from '@/lib/utils'
import { ClockRewind, CopyIcon, PlayIcon, RedoIcon, UndoIcon } from './icons'
import { Button } from './ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { useCopyToClipboard } from 'usehooks-ts'
import { toast } from 'sonner'
import { ConsoleOutput, UIBlock } from './block'
import {
  Dispatch,
  memo,
  SetStateAction,
  startTransition,
  useCallback,
  useState,
} from 'react'
import { Download, Loader, Loader2 } from 'lucide-react'

interface BlockActionsProps {
  block: UIBlock
  handleVersionChange: (type: 'next' | 'prev' | 'toggle' | 'latest') => void
  currentVersionIndex: number
  isCurrentVersion: boolean
  isContentDirty: boolean
  mode: 'read-only' | 'edit' | 'diff'
  setConsoleOutputs: Dispatch<SetStateAction<Array<ConsoleOutput>>>
}

export function RunCodeButton({
  block,
  setConsoleOutputs,
}: {
  block: UIBlock
  setConsoleOutputs: Dispatch<SetStateAction<Array<ConsoleOutput>>>
}) {
  const [pyodide, setPyodide] = useState<any>(null)

  const isPython = true
  const codeContent = block.content

  const updateConsoleOutput = useCallback(
    (runId: string, content: string | null, status: 'completed' | 'failed') => {
      setConsoleOutputs((consoleOutputs) => {
        const index = consoleOutputs.findIndex((output) => output.id === runId)

        if (index === -1) return consoleOutputs

        const updatedOutputs = [...consoleOutputs]
        updatedOutputs[index] = {
          id: runId,
          content,
          status,
        }

        return updatedOutputs
      })
    },
    [setConsoleOutputs]
  )

  const loadAndRunPython = useCallback(async () => {
    const runId = generateUUID()

    setConsoleOutputs((consoleOutputs) => [
      ...consoleOutputs,
      {
        id: runId,
        content: null,
        status: 'in_progress',
      },
    ])

    let currentPyodideInstance = pyodide

    if (isPython) {
      if (!currentPyodideInstance) {
        // @ts-expect-error - pyodide is not defined
        const newPyodideInstance = await loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/',
        })

        setPyodide(newPyodideInstance)
        currentPyodideInstance = newPyodideInstance
      }

      try {
        await currentPyodideInstance.runPythonAsync(`
            import sys
            import io
            sys.stdout = io.StringIO()
          `)

        await currentPyodideInstance.runPythonAsync(codeContent)

        const output: string = await currentPyodideInstance.runPythonAsync(
          `sys.stdout.getvalue()`
        )

        updateConsoleOutput(runId, output, 'completed')
      } catch (error: any) {
        updateConsoleOutput(runId, error.message, 'failed')
      }
    }
  }, [pyodide, codeContent, isPython, setConsoleOutputs, updateConsoleOutput])

  return (
    <Button
      variant="outline"
      className="py-1.5 px-2 h-fit dark:hover:bg-zinc-700"
      onClick={() => {
        startTransition(() => {
          loadAndRunPython()
        })
      }}
      disabled={block.status === 'streaming'}
    >
      <PlayIcon size={18} /> Run
    </Button>
  )
}

function PureBlockActions({
  block,
  handleVersionChange,
  currentVersionIndex,
  isCurrentVersion,
  isContentDirty,
  mode,

  setConsoleOutputs,
}: BlockActionsProps) {
  const [_, copyToClipboard] = useCopyToClipboard()
  const [loadingPdf, setLoadingPdf] = useState(false)
  const downloadPdf = async (markdownString: string, documentTitle: string) => {
    console.log(documentTitle)
    setLoadingPdf(true)
    function sanitizeString(input: string) {
      // Step 1: Remove special characters except spaces
      const noSpecialChars = input.replace(/[^a-zA-Z0-9 ]/g, '')

      // Step 2: Replace one or more spaces with a single underscore
      const replacedSpaces = noSpecialChars.replace(/\s+/g, '_')

      return replacedSpaces
    }

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include authentication headers if necessary
          // 'Authorization': `Bearer ${yourAuthToken}`,
        },
        body: JSON.stringify({ markdown: markdownString }),
      })

      if (!response.ok) {
        let errorMessage = 'Failed to generate PDF.'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (jsonError) {
          console.error('Failed to parse error response as JSON:', jsonError)
          // Optionally, you can extract text from the response
          const errorText = await response.text()
          if (errorText) {
            errorMessage = errorText
          }
        }
        throw new Error(errorMessage)
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(new Blob([blob]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${sanitizeString(documentTitle)}.pdf`) // or any other extension
      document.body.appendChild(link)
      link.click()
      link.parentNode?.removeChild(link)
    } catch (error: any) {
      toast.error(error.message || 'Algo deu errado.')
    } finally {
      setLoadingPdf(false)
      toast.success('PDF gerado com sucesso!')
    }
  }

  return (
    <div className="flex flex-row gap-1">
      {block.kind === 'code' && (
        <RunCodeButton block={block} setConsoleOutputs={setConsoleOutputs} />
      )}

      {block.kind === 'text' && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'p-2 h-fit !pointer-events-auto dark:hover:bg-zinc-700 border-none bg-transparent',
                {
                  'bg-muted': mode === 'diff',
                }
              )}
              onClick={() => {
                handleVersionChange('toggle')
              }}
              disabled={
                block.status === 'streaming' || currentVersionIndex === 0
              }
            >
              <ClockRewind size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Ver mudanças</TooltipContent>
        </Tooltip>
      )}

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className="p-2 h-fit dark:hover:bg-zinc-700 border-none bg-transparent !pointer-events-auto"
            onClick={() => {
              handleVersionChange('prev')
            }}
            disabled={currentVersionIndex === 0 || block.status === 'streaming'}
          >
            <UndoIcon size={18} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Ver versão anterior</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className="p-2 h-fit dark:hover:bg-zinc-700 border-none bg-transparent !pointer-events-auto"
            onClick={() => {
              handleVersionChange('next')
            }}
            disabled={isCurrentVersion || block.status === 'streaming'}
          >
            <RedoIcon size={18} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Ver próxima versão</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className="p-2 h-fit dark:hover:bg-zinc-700 border-none bg-transparent !pointer-events-auto"
            onClick={() => {
              downloadPdf(block.content, document?.title ?? block.title)
            }}
            disabled={
              block.status === 'streaming' || loadingPdf || isContentDirty
            }
          >
            {loadingPdf || isContentDirty ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Download size={18} />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Baixar em PDF</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="inverted"
            className="p-2 h-fit text-primary dark:hover:bg-zinc-700"
            onClick={() => {
              copyToClipboard(block.content)
              toast.success('Copiado para a área de transferência!')
            }}
            disabled={block.status === 'streaming'}
          >
            <CopyIcon size={18} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Copiar para área de transferência</TooltipContent>
      </Tooltip>
    </div>
  )
}

export const BlockActions = memo(PureBlockActions, (prevProps, nextProps) => {
  if (prevProps.block.status !== nextProps.block.status) return false
  if (prevProps.currentVersionIndex !== nextProps.currentVersionIndex)
    return false
  if (prevProps.isCurrentVersion !== nextProps.isCurrentVersion) return false

  return true
})
