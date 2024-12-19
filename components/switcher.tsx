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

const subjects = [
  {
    id: 'fisiologia',
    name: 'Fisiologia',
  },
  // {
  //   id: 'anatomia',
  //   name: 'Anatomia',
  // },
  {
    id: 'bioquimica',
    name: 'Bioquímica',
  },
  // {
  //   id: 'embriologia',
  //   name: 'Embriologia',
  // },
  // {
  //   id: 'histologia',
  //   name: 'Histologia',
  // },
  // {
  //   id: 'patologia',
  //   name: 'Patologia',
  // },
  // {
  //   id: 'farmacologia',
  //   name: 'Farmacologia',
  // },
  // {
  //   id: 'microbiologia',
  //   name: 'Microbiologia',
  // },
  // {
  //   id: 'imunologia',
  //   name: 'Imunologia',
  // },
]

interface SwitcherProps<T> {
  disabled?: boolean
  className?: string
}

export function Switcher<T extends { id: string; name: string }>({
  // selected,

  // onChange,
  //   onCreateNew,

  disabled,
  className,
}: SwitcherProps<T>) {
  const { subject, setSubject }: any = useSubjectStore()
  const [open, setOpen] = React.useState(false)
  const [showNewDialog, setShowNewDialog] = React.useState(false)

  const [selectedId, setSelectedId] = React.useState(subject.id)

  const selectedSubject = subjects.find((subject) => subject.id === selectedId)

  const onChange = (item: any) => {
    setSelectedId(item.id)
    console.log('item', item)
    setSubject(item)
    setOpen(false)
  }

  return (
    <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className={`${className}`} asChild>
          <Button
            disabled={disabled}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label={`Select a ${'Matéria'}`}
            className={'hidden md:flex md:px-2 md:h-[34px] rounded-2xl'}
          >
            <BookOpen />
            {selectedSubject?.name || `  ${'Matéria'}`}
            {/* <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" /> */}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput
              placeholder={`Buscar ${'Matéria'.toLowerCase()}...`}
            />
            <CommandList>
              <CommandEmpty>
                Nenhuma {'Matéria'.toLowerCase()} encontrada.
              </CommandEmpty>
              <CommandGroup heading={'Matéria'}>
                {subjects?.map((item) => (
                  <CommandItem
                    key={item.id}
                    onSelect={() => {
                      onChange(item)
                    }}
                    className="text-sm"
                  >
                    {item.name}
                    {/* <CheckIcon
                        className={cn(
                          'ml-auto h-4 w-4',
                          selected === item.id ? 'opacity-100' : 'opacity-0'
                        )}
                      /> */}
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
