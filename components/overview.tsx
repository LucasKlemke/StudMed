import { GraduationCap } from 'lucide-react'
import { TextFade } from './text-fade'
import { TypingEffect } from './typing-effect'
import { useSession } from 'next-auth/react'

export const Overview = () => {
  const { data:session } = useSession()

  return (
    <TextFade direction="up">
      <div
        key="overview"
        className="max-w-3xl mx-auto md:mt-20 flex justify-center"
      >
        <div className="rounded-xl font-normal p-6 flex flex-col justify-center gap-2 leading-relaxed text-center max-w-xl">
          <div className="flex flex-col justify-center gap-4 items-center">
            <TypingEffect text={`Bem-vindo de volta ${session.user.username} 👋`} />
          </div>

          {/* <p className="font-light">Study Assistant</p> */}
        </div>
      </div>
    </TextFade>
  )
}
