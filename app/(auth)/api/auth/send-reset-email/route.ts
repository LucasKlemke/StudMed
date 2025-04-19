import { db } from '@/lib/db/queries'
import { user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { sendResetEmail } from '@/lib/send-reset-email'

export async function POST(req: Request) {
  const { email } = await req.json()

  const [existingUser] = await db
    .select()
    .from(user)
    .where(eq(user.email, email))

  if (!existingUser) {
    return new Response('Usuário não encontrado', { status: 404 })
  }

  await sendResetEmail(existingUser.email, existingUser.id)

  return new Response('Email enviado', { status: 200 })
}
