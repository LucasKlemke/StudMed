'use server';

import { z } from 'zod';
import { randomUUID } from 'crypto'
import { hashSync, genSaltSync } from 'bcrypt-ts'
import { createUser, getUser } from '@/lib/db/queries';
import { sendVerificationEmail } from '@/lib/verify-email'
import { db } from '@/lib/db/queries'
import { emailVerificationToken } from '@/lib/db/schema'

import { signIn } from './auth';

const registerFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome muito curto')
    .max(64, 'Nome muito longo')
    .regex(/^[A-Za-zÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços'),
  email: z.string().email(),
  password: z.string().min(6),
})

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export interface LoginActionState {
  status: 'idle' | 'in_progress' | 'success' | 'failed' | 'invalid_data';
}

export const login = async (
  _: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> => {
  try {
    const validatedData = loginFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    await signIn('credentials', {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    return { status: 'success' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: 'invalid_data' };
    }

    return { status: 'failed' };
  }
};

export interface RegisterActionState {
  status:
    | 'idle'
    | 'in_progress'
    | 'success'
    | 'failed'
    | 'user_exists'
    | 'invalid_data';
}

export const register = async (
  _: RegisterActionState,
  formData: FormData
): Promise<RegisterActionState> => {
  try {
    const validatedData = registerFormSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
    })

    const [existingUser] = await getUser(validatedData.email)
    if (existingUser) return { status: 'user_exists' }

    const token = randomUUID()
    const expires = new Date(Date.now() + 1000 * 60 * 60) // 1 hora
    const hash = hashSync(validatedData.password, genSaltSync(10))

    await db.insert(emailVerificationToken).values({
      name: validatedData.name,
      email: validatedData.email,
      password: hash,
      token,
      expiresAt: expires,
    })

    await sendVerificationEmail(validatedData.email, token)

    return { status: 'success' }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: 'invalid_data' }
    }

    return { status: 'failed' }
  }
}
