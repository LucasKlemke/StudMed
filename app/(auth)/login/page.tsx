'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { AuthForm } from '@/components/auth-form'
import { SubmitButton } from '@/components/submit-button'

import { login, type LoginActionState } from '../actions'
import Image from 'next/image'
import { TypingEffect } from '@/components/typing-effect'
import { useWindowSize } from 'usehooks-ts'

export default function Page() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [isSuccessful, setIsSuccessful] = useState(false)

  const [state, formAction] = useActionState<LoginActionState, FormData>(
    login,
    {
      status: 'idle',
    }
  )

  useEffect(() => {
    if (state.status === 'failed') {
      toast.error('Invalid credentials!')
    } else if (state.status === 'invalid_data') {
      toast.error('Failed validating your submission!')
    } else if (state.status === 'success') {
      setIsSuccessful(true)
      router.refresh()
    }
  }, [state.status, router])

  const { width: windowWidth } = useWindowSize()

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get('email') as string)
    formAction(formData)
  }

  return (
    <div className="grid  md:grid-cols-4 w-screen items-center bg-background h-dvh">
      {windowWidth > 768 && (
        <div className="col-span-2 relative max-w-full overflow-hidden flex flex-col gap-12 bg-primary h-full">
          <Image
            src="/images/doctor-from-future-concept.jpg"
            alt="Picture of the author"
            objectFit="cover"
            fill
            className="w-full h-full top-0 left-0 object-cover"
          />
        </div>
      )}

      <div className="flex flex-col justify-around md:justify-between  col-span-2  h-full max-w-full   ">
        <div className="pl-5 md:py-5 md:px-10 flex justify-start flex-col items-start">
          <h1 className="text-3xl md:text-6xl   font-semibold">Studmed</h1>
          <h1 className="text-xs md:text-sm text-gray-500 dark:text-zinc-400 ">
            Turbine o seu aprendizado
          </h1>
        </div>
        <div className="  flex items-center  ">
          <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col items-start justify-center gap-2 px-4 text-start sm:px-16">
              <h3 className="text-lg md:text-4xl font-semibold dark:text-zinc-50">
                Entrar
              </h3>
              {/* <p className="text-sm text-gray-500 dark:text-zinc-400">
              Use seu email e senha para entrar
            </p> */}
            </div>
            <AuthForm action={handleSubmit} defaultEmail={email}>
              <SubmitButton isSuccessful={isSuccessful}>Entrar</SubmitButton>
              <p className="text-center text-xs md:text-sm text-gray-600 mt-4 dark:text-zinc-400">
                {'Não tem uma conta ? '}
                <Link
                  href="/register"
                  className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
                >
                  Cadastre-se
                </Link>
                {' grátis.'}
              </p>
            </AuthForm>
          </div>
        </div>
        <p className="px-2 py-3 text-gray-600 dark:text-zinc-400 text-xs">
          Todos os direitos reservados
        </p>
      </div>
    </div>
  )
}
