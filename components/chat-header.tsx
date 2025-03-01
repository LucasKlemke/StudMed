'use client'

import { useRouter } from 'next/navigation'
import { useWindowSize } from 'usehooks-ts'

import { ModelSelector } from '@/components/model-selector'
import { SidebarToggle } from '@/components/sidebar-toggle'
import { Button } from '@/components/ui/button'
import { PlusIcon, VercelIcon } from './icons'
import { useSidebar } from './ui/sidebar'
import { memo } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { VisibilityType, VisibilitySelector } from './visibility-selector'
import { SubjectSwitcher } from './subject-switcher'
import { DataFontSwitcher } from './datafont-switcher'
import { EditIcon } from 'lucide-react'
import { StudMedLogo } from './studmed-logo'

function PureChatHeader({
  chatId,
  selectedModelId,
  selectedVisibilityType,
  isReadonly,
}: {
  chatId: string
  selectedModelId: string
  selectedVisibilityType: VisibilityType
  isReadonly: boolean
}) {
  const router = useRouter()
  const { open } = useSidebar()

  const { width: windowWidth } = useWindowSize()

  // console.log('chatId', chatId)

  return (
    <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2 ">
      {(!open || windowWidth < 768) && <SidebarToggle />}

      {(!open || windowWidth < 768) && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="md:px-2 md:h-fit rounded-2xl"
              onClick={() => {
                router.push('/')
                router.refresh()
              }}
            >
              <EditIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Novo chat</TooltipContent>
        </Tooltip>
      )}

      <Button
        variant="outline"
        className="text-primary hover:text-primary cursor-default hover:bg-transparent border-none md:flex md:px-2 md:h-[34px] order-4 rounded-2xl text-3xl"
      >
        Studmed
      </Button>

      {/* {!isReadonly && (
        <ModelSelector
          selectedModelId={selectedModelId}
          className="order-1 md:order-2 rounded-2xl"
        />
      )} */}

      {/* {!isReadonly && (
        <DataFontSwitcher className="order-2 md:order-2 rounded-2xl" />
      )} */}

      {!isReadonly && windowWidth <= 425 && <SubjectSwitcher />}

      {!isReadonly && (
        <VisibilitySelector
          chatId={chatId}
          selectedVisibilityType={selectedVisibilityType}
          className="order-1 md:order-3 rounded-2xl"
        />
      )}

      {/* <Button
        className="bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 hidden md:flex py-1.5 px-2 h-fit md:h-[34px] order-4 md:ml-auto"
        asChild
      >
        <Link
          href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fai-chatbot&env=AUTH_SECRET,OPENAI_API_KEY&envDescription=Learn%20more%20about%20how%20to%20get%20the%20API%20Keys%20for%20the%20application&envLink=https%3A%2F%2Fgithub.com%2Fvercel%2Fai-chatbot%2Fblob%2Fmain%2F.env.example&demo-title=AI%20Chatbot&demo-description=An%20Open-Source%20AI%20Chatbot%20Template%20Built%20With%20Next.js%20and%20the%20AI%20SDK%20by%20Vercel.&demo-url=https%3A%2F%2Fchat.vercel.ai&stores=%5B%7B%22type%22:%22postgres%22%7D,%7B%22type%22:%22blob%22%7D%5D"
          target="_noblank"
        >
          <VercelIcon size={16} />
          Deploy with Vercel
        </Link>
      </Button> */}
    </header>
  )
}

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
  return prevProps.selectedModelId === nextProps.selectedModelId
})
