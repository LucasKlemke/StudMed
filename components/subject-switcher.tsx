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
    id: 'geral',
    name: 'Geral',
  },
  {
    id: 'fisiologia',
    name: 'Fisiologia',
  },
  {
    id: 'anatomia',
    name: 'Anatomia',
  },
  {
    id: 'bioquimica',
    name: 'Bioquímica',
  },
  {
    id: 'embriologia',
    name: 'Embriologia',
  },
  {
    id: 'histologia',
    name: 'Histologia',
  },
  {
    id: 'patologia',
    name: 'Patologia',
  },
  {
    id: 'farmacologia',
    name: 'Farmacologia',
  },
  {
    id: 'microbiologia',
    name: 'Microbiologia',
  },
  {
    id: 'imunologia',
    name: 'Imunologia',
  },
  {
    id: 'genetica_medica',
    name: 'Genética Médica',
  },
  {
    id: 'parasitologia',
    name: 'Parasitologia',
  },
  {
    id: 'epidemiologia',
    name: 'Epidemiologia',
  },
  {
    id: 'clinica_medica',
    name: 'Clínica médica',
  },
  {
    id: 'pediatria',
    name: 'Pediatria',
  },
  {
    id: 'ginecologia_obstetricia',
    name: 'Ginecologia e obstetrícia',
  },
  {
    id: 'cirurgia_geral',
    name: 'Cirurgia geral',
  },
  {
    id: 'psiquiatria',
    name: 'Psiquiatria',
  },
  {
    id: 'ortopedia_traumatologia',
    name: 'Ortopedia e traumatologia',
  },
  {
    id: 'dermatologia',
    name: 'Dermatologia',
  },
  {
    id: 'oftalmologia',
    name: 'Oftalmologia',
  },
  {
    id: 'otorrinolaringologia',
    name: 'Otorrinolaringologia',
  },
  {
    id: 'neurologia',
    name: 'Neurologia',
  },
  {
    id: 'cardiologia',
    name: 'Cardiologia',
  },
  {
    id: 'radiologia',
    name: 'Radiologia',
  },
  {
    id: 'anestesiologia',
    name: 'Anestesiologia',
  },
  {
    id: 'reumatologia',
    name: 'Reumatologia',
  },
  {
    id: 'endocrinologia',
    name: 'Endocrinologia',
  },
  {
    id: 'oncologia',
    name: 'Oncologia',
  },
  {
    id: 'toxicologia',
    name: 'Toxicologia',
  },
  {
    id: 'nefrologia',
    name: 'Nefrologia',
  },
  {
    id: 'pneumologia',
    name: 'Pneumologia',
  },
  {
    id: 'gastroenterologia',
    name: 'Gastroenterologia',
  },
  {
    id: 'hematologia',
    name: 'Hematologia',
  },
  {
    id: 'infectologia',
    name: 'Infectologia',
  },
]

interface SwitcherProps<T> {
  disabled?: boolean
  className?: string
}

export function SubjectSwitcher<T extends { id: string; name: string }>({
  // selected,

  // onChange,
  //   onCreateNew,

  disabled,
  className,
}: SwitcherProps<T>) {
  const { subject, setSubject }: any = useSubjectStore()
  const [open, setOpen] = React.useState(false)
  const [showNewDialog, setShowNewDialog] = React.useState(false)
  const { width: windowWidth } = useWindowSize()

  const [selectedId, setSelectedId] = React.useState(subject.id)

  const selectedSubject = subjects.find((subject) => subject.id === selectedId)

  const onChange = (item: any) => {
    setSelectedId(item.id)
    // console.log('item', item)
    setSubject(item)
    setOpen(false)
  }

  return (
    <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className={`${className} `} asChild>
          <Button
            disabled={disabled}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label={`Select a ${'Matéria'}`}
            className={'  md:flex md:px-2 md:h-[34px] rounded-2xl'}
          >
            <BookOpen />
            {windowWidth > 768 && (
              <>
                {selectedSubject?.name || `  ${'Matéria'}`}
                <ChevronDownIcon />
              </>
            )}

            {/* <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" /> */}
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
              <CommandGroup heading={'Geral'}>
                {subjects
                  .filter((subject) => subject.id === 'geral')
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
              <CommandGroup heading={'Matéria'}>
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
