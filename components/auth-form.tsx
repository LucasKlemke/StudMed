import Form from 'next/form'
import { Input } from './ui/input'
import { Label } from './ui/label'
import Link from 'next/link'
import { useTranslations } from 'next-intl'


export function AuthForm({
  action,
  children,
  defaultEmail = '',
  showNameField = false,
  showForgotPasswordLink = false,
}: {
  action: NonNullable<
    string | ((formData: FormData) => void | Promise<void>) | undefined
  >
  children: React.ReactNode
  defaultEmail?: string
  showNameField?: boolean
  showForgotPasswordLink?: boolean
}) {
  const t = useTranslations('Auth.AuthForm')

  return (
    <Form
      action={action}
      className="flex flex-col gap-4 px-0 md:px-4 sm:px-16 w-full"
    >
      {showNameField && (
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="name"
            className="text-zinc-600 text-xs md:text-base font-normal dark:text-zinc-400"
          >
            {t('name')}
          </Label>

          <Input
            id="name"
            name="name"
            className="bg-muted text-xs md:text-sm"
            type="text"
            required
            autoFocus
          />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Label
          htmlFor="email"
          className="text-zinc-600 text-xs md:text-base font-normal dark:text-zinc-400"
        >
          {t('email')}
        </Label>

        <Input
          id="email"
          name="email"
          className="bg-muted text-xs md:text-sm"
          type="email"
          autoComplete="email"
          required
          defaultValue={defaultEmail}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <Label
            htmlFor="password"
            className="text-zinc-600 text-xs md:text-base font-normal dark:text-zinc-400"
          >
             {t('password')}
          </Label>
          {showForgotPasswordLink && (
            <Link
              href="/forgot-password"
              className="text-xs text-primary hover:underline"
            >
               {t('forgotPassword')}
            </Link>
          )}
        </div>

        <Input
          id="password"
          name="password"
          className="bg-muted text-xs md:text-sm"
          type="password"
          required
        />
      </div>

      {children}
    </Form>
  )
}
