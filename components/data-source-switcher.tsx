// components/switcher.tsx

'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
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

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { BookOpen, Check, ChevronDownIcon } from 'lucide-react'
import { useSubjectStore } from '@/store/subject'
import { useWindowSize } from 'usehooks-ts'

const subjects = [
  {
    id: 'padrao',
    name: 'Padrão',
  },
  {
    id: 'livros',
    name: 'Livros',
  },
]

interface SwitcherProps<T> {
  disabled?: boolean
  className?: string
}

export function DataSourceSwitcher<T extends { id: string; name: string }>({
  // selected,

  // onChange,
  //   onCreateNew,

  disabled,
  className,
}: SwitcherProps<T>) {
  const [dataSource, setDatasource] = React.useState(subjects[0])
  const [open, setOpen] = React.useState(false)
  const [showNewDialog, setShowNewDialog] = React.useState(false)
  const { width: windowWidth } = useWindowSize()

  const [selectedId, setSelectedId] = React.useState(dataSource.id)

  const selectedSubject = subjects.find((subject) => subject.id === selectedId)

  const onChange = (item: any) => {
    setSelectedId(item.id)
    // console.log('item', item)
    setDatasource(item)
    setOpen(false)
  }

  return (
    <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className={`${className} `} asChild>
          <Button
            disabled
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label={`Select a ${'Fonte'}`}
            className={
              'justify-start md:flex md:px-2 bg-transparent  rounded-lg'
            }
          >
            <>
              {selectedSubject?.name || `  ${'Fonte'}`}
              <ChevronDownIcon />
            </>

            {/* <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" /> */}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput
              placeholder={`Buscar ${'Fonte'.toLowerCase()}...`}
            />
            <CommandList>
              <CommandEmpty>
                Nenhuma {'Fonte'.toLowerCase()} encontrada.
              </CommandEmpty>
              <CommandGroup heading={'Fontes'}>
                {subjects
                  .filter((subject) => subject.id !== 'geral')
                  ?.sort((a, b) => a.id.localeCompare(b.id))
                  .map((item) => (
                    <CommandItem
                      key={item.id}
                      onSelect={() => {
                        onChange(item)
                      }}
                      className="text-sm"
                    >
                      {item.name}
                      <Check
                        className={cn(
                          'ml-auto h-4 w-4',
                          selectedSubject?.id === item.id
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
          </Command>
        </PopoverContent>
      </Popover>
    </Dialog>
  )
}
