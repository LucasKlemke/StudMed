import { db } from '@/lib/db/queries'
import { user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { sendResetEmail } from '@/lib/send-reset-email'

export async function POST(req: Request) {
  const { email } = await req.json()

  // Captura do idioma via cabeçalho Accept-Language
  const langHeader = req.headers.get('accept-language')
  const rawLocale = langHeader?.split(',')[0].trim() || 'pt-BR'
  const lang = ['en', 'pt-BR'].includes(rawLocale) ? (rawLocale as 'en' | 'pt-BR') : 'pt-BR'

  const [existingUser] = await db
    .select()
    .from(user)
    .where(eq(user.email, email))

  if (!existingUser) {
    return new Response(lang === 'en' ? 'User not found' : 'Usuário não encontrado', { status: 404 })
  }

  await sendResetEmail(existingUser.email, existingUser.id, lang)

  return new Response(lang === 'en' ? 'Email sent' : 'Email enviado', { status: 200 })
}
