import { db } from '@/lib/db/queries'
import { passwordResetToken } from '@/lib/db/schema'
import { Resend } from 'resend'
import { randomUUID } from 'crypto'

export async function sendResetEmail(
  email: string,
  userId: string,
  lang: 'pt-BR' | 'en' = 'pt-BR'
) {
  const token = randomUUID()
  const expires = new Date(Date.now() + 1000 * 60 * 60) // 1 hora

  await db.insert(passwordResetToken).values({ userId, token, expiresAt: expires })

  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`
  const resend = new Resend(process.env.RESEND_API_KEY)

  const subject = lang === 'en' ? 'Reset Your Password' : 'Redefinição de Senha'

  const html = `
    <div style="font-family: sans-serif; padding: 24px; max-width: 480px; margin: auto; background-color: #f9f9f9; border-radius: 8px;">
      <div style="text-align: center;">
        <h2 style="color: #1e1e1e; font-size: 24px; margin-bottom: 12px;">
          ${lang === 'en' ? 'Reset Your Password' : 'Redefinição de Senha'}
        </h2>
        <p style="color: #555; font-size: 15px; margin-bottom: 24px;">
          ${
            lang === 'en'
              ? 'We received a request to reset your password. Click the button below to continue:'
              : 'Recebemos uma solicitação para redefinir sua senha. Clique no botão abaixo para continuar:'
          }
        </p>
        <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #10b981; color: white; border-radius: 6px; text-decoration: none; font-weight: bold;">
          ${lang === 'en' ? 'Reset Password' : 'Redefinir Senha'}
        </a>
        <p style="color: #888; font-size: 12px; margin-top: 32px; line-height: 1.5;">
          ${
            lang === 'en'
              ? 'If you didn’t request this, you can safely ignore this email.<br />This link is valid for 1 hour.'
              : 'Se você não solicitou essa alteração, ignore este e-mail.<br />Este link é válido por 1 hora e será inutilizado após esse período.'
          }
        </p>
      </div>
    </div>
  `

  await resend.emails.send({
    from: 'StudMed <no-reply@studmed.com.br>',
    to: email,
    subject,
    html,
  })
}
