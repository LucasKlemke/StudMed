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
} from "lucide-react"

const pastelColors: Record<string, string> = {
  fisiologia: "text-[#A5D8FF]",     
  anatomia: "text-[#FFC9C9]",     
  bioquimica: "text-[#FFE066]",    
  embriologia: "text-[#D0BFFF]",      
  histologia: "text-[#C3FAE8]",     
  patologia: "text-[#FFD8A8]",     
  farmacologia: "text-[#B2F2BB]",  
  genetica_medica: "text-[#FCC2D7]",
  imunologia: "text-[#D0EBFF]",
  microbiologia: "text-[#FFF3BF]",
  parasitologia: "text-[#E7C6FF]",
  epidemiologia: "text-[#C5F6FA]",
  clinica_medica: "text-[#B5E48C]",
  pediatria: "text-[#F1C0E8]",
  ginecologia_obstetricia: "text-[#FFDEEB]",
  cirurgia_geral: "text-[#FFD6A5]",
  psiquiatria: "text-[#BDB2FF]",
  ortopedia_traumatologia: "text-[#D8F5A2]",
  dermatologia: "text-[#FFD5CD]",
  oftalmologia: "text-[#B2F2BB]",
  otorrinolaringologia: "text-[#A0C4FF]",
  neurologia: "text-[#D0EBFF]",
  cardiologia: "text-[#FFADAD]",
  radiologia: "text-[#E0C3FC]",
  anestesiologia: "text-[#FDCB9E]",
  reumatologia: "text-[#A3C4F3]",
  endocrinologia: "text-[#CAF0F8]",
  oncologia: "text-[#FFC6FF]",
  toxicologia: "text-[#FFD6D6]",
  nefrologia: "text-[#B5EAEA]",
  pneumologia: "text-[#CDEAC0]",
  gastroenterologia: "text-[#FAEDCD]",
  hematologia: "text-[#FDC5F5]",
  infectologia: "text-[#D0F4DE]",
  geral: "text-[#DEE2FF]" 
}

const subjects = [
  {
    id: 'geral',
    name: 'Geral',
    icon: BookOpenText 
  },
  {
    id: 'fisiologia',
    name: 'Fisiologia',
    icon: Activity 
  },
  {
    id: 'anatomia',
    name: 'Anatomia',
    icon: Bone 
  },
  {
    id: 'bioquimica',
    name: 'Bioquímica',
    icon: FlaskConical 
  },
  {
    id: 'embriologia',
    name: 'Embriologia',
    icon: Baby 
  },
  {
    id: 'histologia',
    name: 'Histologia',
    icon: Microscope 
  },
  {
    id: 'patologia',
    name: 'Patologia',
    icon: TestTube 
  },
  {
    id: 'farmacologia',
    name: 'Farmacologia',
    icon: Pill 
  },
  {
    id: 'microbiologia',
    name: 'Microbiologia',
    icon: Bacteria 
  },
  {
    id: 'imunologia',
    name: 'Imunologia',
    icon: Shield 
  },
  {
    id: 'genetica_medica',
    name: 'Genética Médica',
    icon: Dna 
  },
  {
    id: 'parasitologia',
    name: 'Parasitologia',
    icon: Virus 
  },
  {
    id: 'epidemiologia',
    name: 'Epidemiologia',
    icon: Biohazard 
  },
  {
    id: 'clinica_medica',
    name: 'Clínica médica',
    icon: Stethoscope 
  },
  {
    id: 'pediatria',
    name: 'Pediatria',
    icon: Baby 
  },
  {
    id: 'ginecologia_obstetricia',
    name: 'Ginecologia e obstetrícia',
    icon: Droplet 
  },
  {
    id: 'cirurgia_geral',
    name: 'Cirurgia geral',
    icon: Syringe 
  },
  {
    id: 'psiquiatria',
    name: 'Psiquiatria',
    icon: Smile 
  },
  {
    id: 'ortopedia_traumatologia',
    name: 'Ortopedia e traumatologia',
    icon: Bone 
  },
  {
    id: 'dermatologia',
    name: 'Dermatologia',
    icon: Flame 
  },
  {
    id: 'oftalmologia',
    name: 'Oftalmologia',
    icon: Eye 
  },
  {
    id: 'otorrinolaringologia',
    name: 'Otorrinolaringologia',
    icon: Ear 
  },
  {
    id: 'neurologia',
    name: 'Neurologia',
    icon: Brain 
  },
  {
    id: 'cardiologia',
    name: 'Cardiologia',
    icon: Heart 
  },
  {
    id: 'radiologia',
    name: 'Radiologia',
    icon: ScanLine 
  },
  {
    id: 'anestesiologia',
    name: 'Anestesiologia',
    icon: Thermometer 
  },
  {
    id: 'reumatologia',
    name: 'Reumatologia',
    icon: Flame 
  },
  {
    id: 'endocrinologia',
    name: 'Endocrinologia',
    icon: Apple 
  },
  {
    id: 'oncologia',
    name: 'Oncologia',
    icon: Radiation 
  },
  {
    id: 'toxicologia',
    name: 'Toxicologia',
    icon: Biohazard 
  },
  {
    id: 'nefrologia',
    name: 'Nefrologia',
    icon: Kidney 
  },
  {
    id: 'pneumologia',
    name: 'Pneumologia',
    icon: Lungs 
  },
  {
    id: 'gastroenterologia',
    name: 'Gastroenterologia',
    icon: Flame 
  },
  {
    id: 'hematologia',
    name: 'Hematologia',
    icon: Droplet 
  },
  {
    id: 'infectologia',
    name: 'Infectologia',
    icon: Virus 
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
      <Popover open={open} onOpenChange={setOpen} >
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
                      className="text-sm p-2.5"
                    >
                     <item.icon
                        className={cn(
                          "h-4 w-4 rounded-sm bg-muted p-0.5",
                          pastelColors[item.id] || "text-muted-foreground"
                        )}
                      />
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
