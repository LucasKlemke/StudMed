'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useWindowSize } from 'usehooks-ts'

import { AuthForm } from '@/components/auth-form'
import { SubmitButton } from '@/components/submit-button'
import { StudMedLogo } from '@/components/studmed-logo'

import { register, type RegisterActionState } from '../actions'

export default function Page() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [isSuccessful, setIsSuccessful] = useState(false)

  const [state, formAction] = useActionState<RegisterActionState, FormData>(
    register,
    {
      status: 'idle',
    }
  )

  useEffect(() => {
    if (state.status === 'user_exists') {
      toast.error('Conta ja existente')
    } else if (state.status === 'failed') {
      toast.error('Falha ao criar conta, tente novamente mais tarde')
    } else if (state.status === 'invalid_data') {
      toast.error('Falha ao validar sua submissão!')
    } else if (state.status === 'success') {
      toast.success('Conta criada com sucesso !')
      setIsSuccessful(true)
      router.refresh()
    }
  }, [state, router])

  const { width: windowWidth } = useWindowSize()

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get('email') as string)
    formAction(formData)
  }

  return (
    <div className="dark:bg-background bg-white dark:bg-dot-white/[0.2] bg-dot-black/[0.2] h-screen">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-background bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="flex justify-center w-screen items-center h-[80vh]">
        <div className="w-full md:w-1/3 px-4">
          <div className="flex w-full justify-center items-center py-3 gap-x-3">
            <p className="text-2xl lg:text-4xl text-primary">Studmed</p>
            <StudMedLogo className="w-6 h-6 lg:w-12 lg:h-12 text-primary" />
            <p className="lg:text-3xl">| Cadastro</p>
          </div>
          <AuthForm action={handleSubmit} defaultEmail={email}>
            <SubmitButton isSuccessful={isSuccessful}>Cadastrar</SubmitButton>
            <p className="text-center text-xs md:text-sm text-gray-600 mt-4 dark:text-zinc-400">
              {'Ja tem uma conta? '}
              <Link
                href="/login"
                className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
              >
                Entrar
              </Link>
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
    </div>
  )
}
