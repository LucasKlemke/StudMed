import { Resend } from 'resend'

export async function sendVerificationEmail(email: string, token: string) {
  const verifyLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-email?token=${token}`
  const resend = new Resend(process.env.RESEND_API_KEY)

  await resend.emails.send({
    from: 'StudMed <no-reply@studmed.com.br>',
    to: email,
    subject: 'Confirme seu e-mail',
    html: `
      <div style="font-family: sans-serif; padding: 24px; max-width: 480px; margin: auto; background-color: #f9f9f9; border-radius: 8px;">
        <div style="text-align: center;">
          <h2 style="color: #1e1e1e;">Bem-vindo ao StudMed</h2>
          <p style="color: #555;">Clique no botão abaixo para confirmar seu e-mail e ativar sua conta.</p>
          <a href="${verifyLink}" style="display: inline-block; padding: 12px 24px; background-color: #10b981; color: white; border-radius: 6px; text-decoration: none;">
            Confirmar E-mail
          </a>
          <p style="color: #888; font-size: 12px; margin-top: 24px;">Esse link expira em 1 hora.</p>
        </div>
      </div>
    `,
  })
}
