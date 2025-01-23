import Form from 'next/form';

import { Input } from './ui/input';
import { Label } from './ui/label';

export function AuthForm({
  action,
  children,
  defaultEmail = '',
}: {
  action: NonNullable<
    string | ((formData: FormData) => void | Promise<void>) | undefined
  >;
  children: React.ReactNode;
  defaultEmail?: string;
}) {
  return (
    <Form action={action} className="flex flex-col gap-4 px-0 md:px-4 sm:px-16 w-full">
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
          autoFocus
          defaultValue={defaultEmail}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label
          htmlFor="password"
          className="text-zinc-600 text-xs md:text-base font-normal dark:text-zinc-400"
        >
          Senha:
        </Label>

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
