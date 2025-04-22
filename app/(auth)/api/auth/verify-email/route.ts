import { db } from '@/lib/db/queries'
import { emailVerificationToken, user } from '@/lib/db/schema'
import { eq, and, lt } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { hashSync } from 'bcrypt-ts'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/register?verified=0', req.url))
  }

  // Busca o token
  const [tokenRecord] = await db
    .select()
    .from(emailVerificationToken)
    .where(eq(emailVerificationToken.token, token))

  // Token inválido ou expirado
  if (
    !tokenRecord ||
    tokenRecord.expiresAt.getTime() < Date.now()
  ) {
    return NextResponse.redirect(new URL('/register?verified=0', req.url))
  }

  // Cria o usuário definitivo
  await db.insert(user).values({
    username: tokenRecord.name,
    email: tokenRecord.email,
    password: tokenRecord.password,
  })

  // Remove o token de verificação
  await db
    .delete(emailVerificationToken)
    .where(eq(emailVerificationToken.token, token))

  return NextResponse.redirect(new URL('/verify-email?verified=1', req.url))

}
