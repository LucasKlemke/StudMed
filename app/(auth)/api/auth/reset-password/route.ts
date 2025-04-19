import { db } from '@/lib/db/queries'
import { passwordResetToken, user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { hashSync } from 'bcrypt-ts'

export async function POST(req: Request) {
  const { token, password } = await req.json()

  const [resetToken] = await db
    .select()
    .from(passwordResetToken)
    .where(eq(passwordResetToken.token, token))

  if (!resetToken || resetToken.expiresAt < new Date()) {
    return new Response('Token inválido ou expirado', { status: 400 })
  }

  const hashed = hashSync(password, 10)

  await db
    .update(user)
    .set({ password: hashed })
    .where(eq(user.id, resetToken.userId))

  await db
    .delete(passwordResetToken)
    .where(eq(passwordResetToken.id, resetToken.id))

  return new Response('Senha atualizada', { status: 200 })
}
