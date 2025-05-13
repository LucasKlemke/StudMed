'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { StudMedLogo } from '@/components/studmed-logo'
import { useTranslations } from 'next-intl'

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const t = useTranslations('Auth.ResetPassword')

  const router = useRouter()
  const token = searchParams.get('token') || ''

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error(t('passwordsDoNotMatch'))
      return
    }

    setLoading(true)

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    setLoading(false)

    if (res.ok) {
      toast.success(t('success'))
      router.push('/login')
    } else {
      toast.error(t('error'))
    }
  }

  return (
    <div className="dark:bg-background bg-white dark:bg-dot-white/[0.2] bg-dot-black/[0.2] h-screen">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-background bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="flex justify-center w-screen items-center h-[80vh]">
        <div className="w-full md:w-1/3 px-4">
          <div className="flex w-full justify-center items-center py-3 gap-x-3">
            <p className="text-2xl lg:text-4xl text-primary">StudMed</p>
            <StudMedLogo className="w-6 h-6 lg:w-12 lg:h-12 text-primary" />
            <p className="lg:text-3xl">| {t('title')}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <Input
              type="password"
              placeholder={t('newPasswordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder={t('confirmPasswordPlaceholder')}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? t('submitting') : t('submit')}
            </Button>
            <p className="text-center text-xs md:text-sm text-gray-600 mt-4 dark:text-zinc-400">
              {t('rememberedPassword')}{' '}
              <Link
                href="/login"
                className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
              >
                {t('backToLogin')}
              </Link>
            </p>
          </form>
        </div>
      </div>
      <div className="w-full gap-x-3 flex justify-center items-center">
        <p className="text-primary text-xs md:text-sm">{t('termsOfUse')}</p>|
        <p className="text-primary text-xs md:text-sm">{t('privacyPolicy')}</p>
      </div>
    </div>
  )
}
