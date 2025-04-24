'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'
import { StudMedLogo } from '@/components/studmed-logo'

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const verified = searchParams.get('verified')

  useEffect(() => {
    if (verified === '1') {
      toast.success('Email verificado com sucesso!')
      setTimeout(() => router.push('/login'), 3000)
    } else if (verified === '0') {
      toast.error('Link de verificação inválido ou expirado')
    }
  }, [verified, router])

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
            <p className="lg:text-3xl">| Verificação</p>
          </div>

          <div className="mt-6 text-center space-y-4">
            <h1 className="text-2xl font-bold text-primary">
              {verified === '1'
                ? 'Email verificado com sucesso!'
                : verified === '0'
                ? 'Link inválido ou expirado'
                : 'Confirme seu e-mail'}
            </h1>

            <p className="text-muted-foreground text-sm">
              {verified === null
                ? 'Enviamos um link de confirmação para o e-mail informado. Aguardando a confirmação...'
                : verified === '0'
                ? 'O link de verificação é inválido ou expirou. Solicite um novo link.'
                : 'Você será redirecionado para o login em instantes.'}
            </p>

            {verified === null && (
              <p className="text-sm text-zinc-400 mt-4">O link é válido por 1 hora.</p>
            )}
          </div>
        </div>
      </div>

      <div className="w-full gap-x-3 flex justify-center items-center">
        <p className="text-primary text-xs md:text-sm">Termos de uso</p>|
        <p className="text-primary text-xs md:text-sm">Política de privacidade</p>
      </div>
    </div>
  )
}
