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
import { useTranslations } from 'next-intl'

const pastelColors: Record<string, string> = {
  fisiologia: 'text-[#339af0] dark:text-[#A5D8FF]',
  anatomia: 'text-[#ff8787] dark:text-[#FFC9C9]',
  bioquimica: 'text-[#fab005] dark:text-[#FFE066]',
  embriologia: 'text-[#9775fa] dark:text-[#D0BFFF]',
  histologia: 'text-[#20c997] dark:text-[#C3FAE8]',
  patologia: 'text-[#ffa94d] dark:text-[#FFD8A8]',
  farmacologia: 'text-[#69db7c] dark:text-[#B2F2BB]',
  genetica_medica: 'text-[#f783ac] dark:text-[#FCC2D7]',
  imunologia: 'text-[#339af0] dark:text-[#D0EBFF]',
  microbiologia: 'text-[#ffd43b] dark:text-[#FFF3BF]',
  parasitologia: 'text-[#da77f2] dark:text-[#E7C6FF]',
  epidemiologia: 'text-[#66d9e8] dark:text-[#C5F6FA]',
  clinica_medica: 'text-[#82c91e] dark:text-[#B5E48C]',
  pediatria: 'text-[#e599f7] dark:text-[#F1C0E8]',
  ginecologia_obstetricia: 'text-[#f783ac] dark:text-[#FFDEEB]',
  cirurgia_geral: 'text-[#ffa94d] dark:text-[#FFD6A5]',
  psiquiatria: 'text-[#845ef7] dark:text-[#BDB2FF]',
  ortopedia_traumatologia: 'text-[#94d82d] dark:text-[#D8F5A2]',
  dermatologia: 'text-[#ff8787] dark:text-[#FFD5CD]',
  oftalmologia: 'text-[#51cf66] dark:text-[#B2F2BB]',
  otorrinolaringologia: 'text-[#74c0fc] dark:text-[#A0C4FF]',
  neurologia: 'text-[#339af0] dark:text-[#D0EBFF]',
  cardiologia: 'text-[#ff6b6b] dark:text-[#FFADAD]',
  radiologia: 'text-[#b197fc] dark:text-[#E0C3FC]',
  anestesiologia: 'text-[#ffa94d] dark:text-[#FDCB9E]',
  reumatologia: 'text-[#91a7ff] dark:text-[#A3C4F3]',
  endocrinologia: 'text-[#66d9e8] dark:text-[#CAF0F8]',
  oncologia: 'text-[#e599f7] dark:text-[#FFC6FF]',
  toxicologia: 'text-[#ff8787] dark:text-[#FFD6D6]',
  nefrologia: 'text-[#63e6be] dark:text-[#B5EAEA]',
  pneumologia: 'text-[#a9e34b] dark:text-[#CDEAC0]',
  gastroenterologia: 'text-[#f08c00] dark:text-[#FAEDCD]',
  hematologia: 'text-[#da77f2] dark:text-[#FDC5F5]',
  infectologia: 'text-[#63e6be] dark:text-[#D0F4DE]',
  geral: 'text-[#748ffc] dark:text-[#DEE2FF]',
}

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
  const t = useTranslations('Chat.SubjectSwitcher')

  const subjects = [
    {
      id: 'geral',
      name: t('subjectName1'),
      icon: BookOpenText,
    },
    {
      id: 'fisiologia',
      name: t('subjectName2'),
      icon: Activity,
    },
    {
      id: 'anatomia',
      name: t('subjectName3'),
      icon: Bone,
    },
    {
      id: 'bioquimica',
      name: t('subjectName4'),
      icon: FlaskConical,
    },
    {
      id: 'embriologia',
      name: t('subjectName5'),
      icon: Baby,
    },
    {
      id: 'histologia',
      name: t('subjectName6'),
      icon: Microscope,
    },
    {
      id: 'patologia',
      name: t('subjectName7'),
      icon: TestTube,
    },
    {
      id: 'farmacologia',
      name: t('subjectName8'),
      icon: Pill,
    },
    {
      id: 'microbiologia',
      name: t('subjectName9'),
      icon: Bacteria,
    },
    {
      id: 'imunologia',
      name: t('subjectName10'),
      icon: Shield,
    },
    {
      id: 'genetica_medica',
      name: t('subjectName11'),
      icon: Dna,
    },
    {
      id: 'parasitologia',
      name: t('subjectName12'),
      icon: Virus,
    },
    {
      id: 'epidemiologia',
      name: t('subjectName13'),
      icon: Biohazard,
    },
    {
      id: 'clinica_medica',
      name: t('subjectName14'),
      icon: Stethoscope,
    },
    {
      id: 'pediatria',
      name: t('subjectName15'),
      icon: Baby,
    },
    {
      id: 'ginecologia_obstetricia',
      name: t('subjectName16'),
      icon: Droplet,
    },
    {
      id: 'cirurgia_geral',
      name: t('subjectName17'),
      icon: Syringe,
    },
    {
      id: 'psiquiatria',
      name: t('subjectName18'),
      icon: Smile,
    },
    {
      id: 'ortopedia_traumatologia',
      name: t('subjectName19'),
      icon: Bone,
    },
    {
      id: 'dermatologia',
      name: t('subjectName20'),
      icon: Flame,
    },
    {
      id: 'oftalmologia',
      name: t('subjectName21'),
      icon: Eye,
    },
    {
      id: 'otorrinolaringologia',
      name: t('subjectName22'),
      icon: Ear,
    },
    {
      id: 'neurologia',
      name: t('subjectName23'),
      icon: Brain,
    },
    {
      id: 'cardiologia',
      name: t('subjectName24'),
      icon: Heart,
    },
    {
      id: 'radiologia',
      name: t('subjectName25'),
      icon: ScanLine,
    },
    {
      id: 'anestesiologia',
      name: t('subjectName26'),
      icon: Thermometer,
    },
    {
      id: 'reumatologia',
      name: t('subjectName27'),
      icon: Flame,
    },
    {
      id: 'endocrinologia',
      name: t('subjectName28'),
      icon: Apple,
    },
    {
      id: 'oncologia',
      name: t('subjectName29'),
      icon: Radiation,
    },
    {
      id: 'toxicologia',
      name: t('subjectName30'),
      icon: Biohazard,
    },
    {
      id: 'nefrologia',
      name: t('subjectName31'),
      icon: Kidney,
    },
    {
      id: 'pneumologia',
      name: t('subjectName32'),
      icon: Lungs,
    },
    {
      id: 'gastroenterologia',
      name: t('subjectName33'),
      icon: Flame,
    },
    {
      id: 'hematologia',
      name: t('subjectName34'),
      icon: Droplet,
    },
    {
      id: 'infectologia',
      name: t('subjectName35'),
      icon: Virus,
    },
  ]

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
            <CommandInput placeholder={t('placeholder')} />
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
            </CommandList>
            <CommandSeparator />
          </Command>
        </PopoverContent>
      </Popover>
    </Dialog>
  )
}
