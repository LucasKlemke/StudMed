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

import {
  Baby,
  Brain,
  Dna,
  Heart,
  Microscope,
  Pill,
  Stethoscope,
  Syringe,
  TestTube,
  Shield,
  Bone,
  Eye,
  Ear,
  Smile,
  Radiation,
  ScanLine,
  Biohazard,
  Activity,
  Flame,
  Thermometer,
  FlaskConical,
  Droplet,
  BookOpenText,
  Apple,
  WormIcon as Virus,
  BugIcon as Bacteria,
  BabyIcon as Kidney,
  TreesIcon as Lungs,
  StickerIcon as Stomach,
} from 'lucide-react'

const pastelColors: Record<string, string> = {
  // anamnese: "text-[] dark: text-[]",
  anatomia: 'text-[#ff8787] dark:text-[#FFC9C9]',
  anestesiologia: 'text-[#ffa94d] dark:text-[#FDCB9E]',
  bioquimica: 'text-[#fab005] dark:text-[#FFE066]',
  cardiologia: 'text-[#ff6b6b] dark:text-[#FFADAD]',
  cirurgia_geral: 'text-[#ffa94d] dark:text-[#FFD6A5]',
  clinica_medica: 'text-[#82c91e] dark:text-[#B5E48C]',
  dermatologia: 'text-[#ff8787] dark:text-[#FFD5CD]',
  embriologia: 'text-[#9775fa] dark:text-[#D0BFFF]',
  endocrinologia: 'text-[#66d9e8] dark:text-[#CAF0F8]',
  epidemiologia: 'text-[#66d9e8] dark:text-[#C5F6FA]',
  farmacologia: 'text-[#69db7c] dark:text-[#B2F2BB]',
  fisiologia: 'text-[#339af0] dark:text-[#A5D8FF]',
  gastroenterologia: 'text-[#f08c00] dark:text-[#FAEDCD]',
  geral: 'text-[#748ffc] dark:text-[#DEE2FF]',
  genetica_medica: 'text-[#f783ac] dark:text-[#FCC2D7]',
  ginecologia_obstetricia: 'text-[#f783ac] dark:text-[#FFDEEB]',
  hematologia: 'text-[#da77f2] dark:text-[#FDC5F5]',
  histologia: 'text-[#20c997] dark:text-[#C3FAE8]',
  imunologia: 'text-[#339af0] dark:text-[#D0EBFF]',
  infectologia: 'text-[#63e6be] dark:text-[#D0F4DE]',
  microbiologia: 'text-[#ffd43b] dark:text-[#FFF3BF]',
  nefrologia: 'text-[#63e6be] dark:text-[#B5EAEA]',
  neurologia: 'text-[#339af0] dark:text-[#D0EBFF]',
  oftalmologia: 'text-[#51cf66] dark:text-[#B2F2BB]',
  oncologia: 'text-[#e599f7] dark:text-[#FFC6FF]',
  ortopedia_traumatologia: 'text-[#94d82d] dark:text-[#D8F5A2]',
  otorrinolaringologia: 'text-[#74c0fc] dark:text-[#A0C4FF]',
  parasitologia: 'text-[#da77f2] dark:text-[#E7C6FF]',
  patologia: 'text-[#ffa94d] dark:text-[#FFD8A8]',
  pediatria: 'text-[#e599f7] dark:text-[#F1C0E8]',
  pneumologia: 'text-[#a9e34b] dark:text-[#CDEAC0]',
  psiquiatria: 'text-[#845ef7] dark:text-[#BDB2FF]',
  radiologia: 'text-[#b197fc] dark:text-[#E0C3FC]',
  reumatologia: 'text-[#91a7ff] dark:text-[#A3C4F3]',
  toxicologia: 'text-[#ff8787] dark:text-[#FFD6D6]',
}

const subjects = [
  {
    id: 'anamnese',
    name: 'Anamnese',
    icon: BookOpen,
  },
  {
    id: 'anatomia',
    name: 'Anatomia',
    icon: Bone,
  },
  {
    id: 'anestesiologia',
    name: 'Anestesiologia',
    icon: Thermometer,
  },
  {
    id: 'bioquimica',
    name: 'Bioquímica',
    icon: FlaskConical,
  },
  {
    id: 'cardiologia',
    name: 'Cardiologia',
    icon: Heart,
  },
  {
    id: 'cirurgia_geral',
    name: 'Cirurgia geral',
    icon: Syringe,
  },
  {
    id: 'clinica_medica',
    name: 'Clínica médica',
    icon: Stethoscope,
  },
  {
    id: 'dermatologia',
    name: 'Dermatologia',
    icon: Flame,
  },
  {
    id: 'embriologia',
    name: 'Embriologia',
    icon: Baby,
  },
  {
    id: 'endocrinologia',
    name: 'Endocrinologia',
    icon: Apple,
  },
  {
    id: 'epidemiologia',
    name: 'Epidemiologia',
    icon: Biohazard,
  },
  {
    id: 'farmacologia',
    name: 'Farmacologia',
    icon: Pill,
  },
  {
    id: 'fisiologia',
    name: 'Fisiologia',
    icon: Activity,
  },
  {
    id: 'gastroenterologia',
    name: 'Gastroenterologia',
    icon: Flame,
  },
  {
    id: 'geral',
    name: 'Geral',
    icon: BookOpenText,
  },
  {
    id: 'genetica_medica',
    name: 'Genética Médica',
    icon: Dna,
  },
  {
    id: 'ginecologia_obstetricia',
    name: 'Ginecologia e obstetrícia',
    icon: Droplet,
  },
  {
    id: 'hematologia',
    name: 'Hematologia',
    icon: Droplet,
  },
  {
    id: 'histologia',
    name: 'Histologia',
    icon: Microscope,
  },
  {
    id: 'imunologia',
    name: 'Imunologia',
    icon: Shield,
  },
  {
    id: 'infectologia',
    name: 'Infectologia',
    icon: Virus,
  },
  {
    id: 'microbiologia',
    name: 'Microbiologia',
    icon: Bacteria,
  },
  {
    id: 'nefrologia',
    name: 'Nefrologia',
    icon: Kidney,
  },
  {
    id: 'neurologia',
    name: 'Neurologia',
    icon: Brain,
  },
  {
    id: 'oftalmologia',
    name: 'Oftalmologia',
    icon: Eye,
  },
  {
    id: 'oncologia',
    name: 'Oncologia',
    icon: Radiation,
  },
  {
    id: 'ortopedia_traumatologia',
    name: 'Ortopedia e traumatologia',
    icon: Bone,
  },
  {
    id: 'otorrinolaringologia',
    name: 'Otorrinolaringologia',
    icon: Ear,
  },
  {
    id: 'parasitologia',
    name: 'Parasitologia',
    icon: Virus,
  },
  {
    id: 'patologia',
    name: 'Patologia',
    icon: TestTube,
  },
  {
    id: 'pediatria',
    name: 'Pediatria',
    icon: Baby,
  },
  {
    id: 'pneumologia',
    name: 'Pneumologia',
    icon: Lungs,
  },
  {
    id: 'psiquiatria',
    name: 'Psiquiatria',
    icon: Smile,
  },
  {
    id: 'radiologia',
    name: 'Radiologia',
    icon: ScanLine,
  },
  {
    id: 'reumatologia',
    name: 'Reumatologia',
    icon: Flame,
  },
  {
    id: 'toxicologia',
    name: 'Toxicologia',
    icon: Biohazard,
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
            className={
              'justify-start md:flex md:px-2 bg-transparent text-xs  rounded-full'
            }
          >
            <BookOpen className="h-2 w-2" />
            {selectedSubject?.name || `  ${'Matéria'}`}
            <ChevronDownIcon />

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
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                      {item.name}
                      <Check
                        className={cn(
                          'ml-auto h-4 w-4',
                          selectedSubject?.id === item.id
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
              <CommandGroup heading={'Matéria'}>
                {subjects
                  .filter(
                    (subject) =>
                      subject.id !== 'geral' && subject.id !== 'anamnese',
                  )
                  ?.sort((a, b) => a.id.localeCompare(b.id))
                  .map((item) => (
                    <CommandItem
                      key={item.id}
                      onSelect={() => {
                        onChange(item)
                      }}
                      className="text-sm p-2.5"
                    >
                      <item.icon
                        className={cn(
                          'h-4 w-4 rounded-sm p-0.5 bg-transparent',
                          pastelColors[item.id] || 'text-muted-foreground',
                        )}
                      />
                      {item.name}
                      <Check
                        className={cn(
                          'ml-auto h-4 w-4',
                          selectedSubject?.id === item.id
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
              {/* Anamnese será um grupo que ira conter varios pacientes, cada paciente deverá ter um promp ja definido
              com o seu problema, informacoes e personalidade
              */}
              <CommandGroup heading={'Anamnsese'}>
                {subjects
                  .filter((subject) => subject.id === 'anamnese')
                  .map((item) => (
                    <CommandItem
                      key={item.id}
                      onSelect={() => {
                        onChange(item)
                      }}
                      className="text-sm"
                    >
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                      {item.name}
                      <Check
                        className={cn(
                          'ml-auto h-4 w-4',
                          selectedSubject?.id === item.id
                            ? 'opacity-100'
                            : 'opacity-0',
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
