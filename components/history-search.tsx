// components/switcher.tsx

'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Dialog } from '@/components/ui/dialog'

import useSWR from 'swr'

import type { Chat } from '@/lib/db/schema/chat'
import { fetcher } from '@/lib/utils'

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { Check, Search } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useWindowSize } from 'usehooks-ts'

interface SwitcherProps<T> {
  user: any
  disabled?: boolean
  className?: string
}

export function HistorySearch<
  T extends { id: string; name: string; user: any }
>({
  // selected,

  // onChange,
  //   onCreateNew,
  user,
  disabled,
  className,
}: SwitcherProps<T>) {
  const {
    data: history,
    isLoading,
    mutate,
  } = useSWR<Array<Chat>>(user ? '/api/history' : null, fetcher, {
    fallbackData: [],
  })
  const [open, setOpen] = React.useState(false)
  const [showNewDialog, setShowNewDialog] = React.useState(false)
  const pathname = usePathname()
  const { width: windowWidth } = useWindowSize()
  React.useEffect(() => {
    mutate()
  }, [pathname, mutate])
  function formatDate(dateString: string) {
    const date = new Date(dateString)

    const day = String(date.getDate()).padStart(2, '0') // Ensures two digits
    const month = String(date.getMonth() + 1).padStart(2, '0') // Month is 0-indexed
    const year = String(date.getFullYear()).slice(2) // Gets last two digits of the year

    return `${day}/${month}/${year}`
  }

  return (
    <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className={`${className} `} asChild>
          <Button
            role="combobox"
            disabled={disabled}
            aria-expanded={open}
            variant="outline"
            className="md:px-2 md:h-fit rounded-2xl"
          >
            <Search />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={` ${
            windowWidth > 768 && 'absolute left-0 w-[500px]'
          } p-0 `}
        >
          <Command>
            <CommandInput placeholder={`Buscar ${'chat'.toLowerCase()}...`} />
            {isLoading ? (
              <>
                {[44, 32, 28, 64, 52].map((item) => (
                  <div
                    key={item}
                    className="rounded-md h-8 flex gap-2 px-2 items-center"
                  >
                    <div
                      className="h-4 rounded-md flex-1 max-w-[--skeleton-width] bg-sidebar-accent-foreground/10"
                      style={
                        {
                          '--skeleton-width': `${item}%`,
                        } as React.CSSProperties
                      }
                    />
                  </div>
                ))}
              </>
            ) : (
              <CommandList>
                <CommandEmpty>
                  Nenhum {'chat'.toLowerCase()} encontrado.
                </CommandEmpty>
                <CommandGroup
                  className="hover:bg-transparent"
                  heading={'Histórico'}
                >
                  {history?.map((item) => (
                    <CommandItem key={item.id} className="text-sm ">
                      <Link href={`/chat/${item.id}`}>
                        {item.title}
                        <span className="text-xs ml-2 font-light">
                            {`${new Date(item.createdAt).getDate()} de ${new Date(item.createdAt).toLocaleString('pt-BR', { month: 'long' })}, ${new Date(item.createdAt).getFullYear()}`}
                        </span>
                      </Link>

                      <Check className={'ml-auto h-4 w-4 opacity-0'} /> 
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            )}

            <CommandSeparator />
          </Command>
        </PopoverContent>
      </Popover>
    </Dialog>
  )
}
