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
import { StudMedLogo } from '@/components/studmed-logo'



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
      toast.error('Credenciais inválidas!')
      setInvalidCredentials(true)
    } else if (state.status === 'invalid_data') {
      toast.error('Failed validating your submission!')
    } else if (state.status === 'success') {
      setIsSuccessful(true)
      router.refresh()
    }
  }, [state.status, router])

  const { width: windowWidth } = useWindowSize()

  const [invalidCredentials, setInvalidCredentials] = useState(false)

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get('email') as string)
    formAction(formData)
  }

  return (
    <>
      <div className="flex w-full justify-center items-center py-3 gap-x-3">
        {/* <p className="text-3xl text-primary">Studmed</p>
         */}
        <p className="text-4xl text-primary">Studmed</p>
        <StudMedLogo className="w-12 h-12  text-primary" />
      </div>

      <div className="flex justify-center w-screen items-center bg-background h-[80vh]">
        <div className="w-full md:w-1/3 px-4">
          <p className="pb-5  p-0 md:py-5 text-3xl font-semibold text-start md:text-center">
            Bem-vindo
          </p>
          <AuthForm action={handleSubmit} defaultEmail={email}>
            {invalidCredentials && (
              <Link href={'/recovery'}>Esqueceu a senha ? </Link>
            )}
            <SubmitButton isSuccessful={isSuccessful}>Continuar</SubmitButton>
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
      <div className="w-full gap-x-3 flex justify-center items-center">
        <p className="text-primary text-xs md:text-sm">Termos de uso</p>|
        <p className="text-primary text-xs md:text-sm">
          Política de privacidade
        </p>
      </div>
    </>
  )
}
