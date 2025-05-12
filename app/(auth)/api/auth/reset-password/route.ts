import { db } from '@/lib/db/queries'
import { passwordResetToken, user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { hashSync } from 'bcrypt-ts'

export async function POST(req: Request) {
  const { token, password } = await req.json()

  // Detectar idioma do cabeçalho
  const acceptLanguage = req.headers.get('accept-language') || ''
  const rawLocale = acceptLanguage.split(',')[0].trim()
  const supported = ['pt-BR', 'en']
  const lang = supported.includes(rawLocale) ? (rawLocale as 'pt-BR' | 'en') : 'pt-BR'

  const [resetToken] = await db
    .select()
    .from(passwordResetToken)
    .where(eq(passwordResetToken.token, token))

  const expired = !resetToken || resetToken.expiresAt < new Date()

  if (expired) {
    return new Response(
      lang === 'en' ? 'Invalid or expired token' : 'Token inválido ou expirado',
      { status: 400 }
    )
  }

  const hashed = hashSync(password, 10)

  await db
    .update(user)
    .set({ password: hashed })
    .where(eq(user.id, resetToken.userId))

  await db
    .delete(passwordResetToken)
    .where(eq(passwordResetToken.id, resetToken.id))

  return new Response(
    lang === 'en' ? 'Password successfully updated' : 'Senha atualizada',
    { status: 200 }
  )
}
