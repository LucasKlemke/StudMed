import Form from 'next/form'
import { Input } from './ui/input'
import { Label } from './ui/label'
import Link from 'next/link'

export function AuthForm({
  action,
  children,
  defaultEmail = '',
  showNameField = false,
}: {
  action: NonNullable<
    string | ((formData: FormData) => void | Promise<void>) | undefined
  >
  children: React.ReactNode
  defaultEmail?: string
  showNameField?: boolean
}) {
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
            Nome:
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
          Email:
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
            Senha:
          </Label>
          <Link
            href="/forgot-password"
            className="text-xs text-primary hover:underline"
          >
            Esqueceu a senha?
          </Link>
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
