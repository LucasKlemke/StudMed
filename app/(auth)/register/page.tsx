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
import { useTranslations } from 'next-intl'

export default function Page() {
  const router = useRouter()
  const t = useTranslations('Auth.Register')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSuccessful, setIsSuccessful] = useState(false)

  const [state, formAction] = useActionState<RegisterActionState, FormData>(
    register,
    {
      status: 'idle',
    }
  )

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const verified = params.get('verified')

    if (verified === '1') {
      toast.success(t('emailVerified'))
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } else if (verified === '0') {
      toast.error(t('expiredLink'))
    }

    if (state.status === 'user_exists') {
      toast.error(t('emailExists'))
      setEmail('')
    } else if (state.status === 'failed') {
      toast.error(t('createFailed'))
    } else if (state.status === 'invalid_data') {
      toast.error(t('invalidData'))
    } else if (state.status === 'success') {
      router.push('/verify-email')
      setIsSuccessful(true)
    }
  }, [state, router, t])

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
            <Link href="/home" className="flex items-center gap-3">
              <p className="text-2xl lg:text-4xl text-primary">StudMed</p>
              <StudMedLogo className="w-6 h-6 lg:w-12 lg:h-12 text-primary" />
            </Link>
            <p className="lg:text-3xl">| {t('title')}</p>
          </div>
          <AuthForm action={handleSubmit} showNameField>
            <SubmitButton isSuccessful={isSuccessful}>
              {t('submit')}
            </SubmitButton>
            <p className="text-center text-xs md:text-sm text-gray-600 mt-4 dark:text-zinc-400">
              {t('alreadyHaveAccount')}{' '}
              <Link
                href="/login"
                className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
              >
                {t('login')}
              </Link>
            </p>
          </AuthForm>
        </div>
      </div>
      <div className="w-full gap-x-3 flex justify-center items-center">
        <p className="text-primary text-xs md:text-sm">{t('termsOfUse')}</p>|
        <p className="text-primary text-xs md:text-sm">{t('privacyPolicy')}</p>
      </div>
    </div>
  )
}
