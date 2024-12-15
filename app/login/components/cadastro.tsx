'use client';
import React, { useEffect } from 'react';
import { login, signup } from '@/app/login/actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ActivityIcon,
  Circle,
  CircleCheck,
  Loader,
  Loader2,
  LogIn,
  MailCheck,
  TriangleAlert,
  User,
  UserPen,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const formSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'As senhas não conferem',
        path: ['confirmPassword'],
      });
    }
  });

const Cadastro = ({
  isLoading,
  setIsLoading,
}: {
  isLoading: boolean;
  setIsLoading: (arg0: boolean) => void;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [error, setError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const onLogin = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const error = await signup({ email: data.email, password: data.password });

    if (error) {
      console.log(error);
      setError(true);
      setSuccess(false);
    } else {
      setError(false);
      setSuccess(true);
    }

    setIsLoading(false);
  };
  //localhost:3000/auth/confirm?token_hash=pkce_cbd86585a5a525ee845640ee81e61a24893456fd7f72dda8442b90e2&amp;type=signup
  //stud-med-ai.vercel.app/app/chat/auth/confirm?token_hash=pkce_0a3e00c0187bf0fde04a4639c0beb7917395ed5580fc5a1ce6963d78&amp;type=signup

  https: http: return (
    <Form {...form}>
      <form
        className="space-y-4 flex flex-col justify-center "
        onSubmit={form.handleSubmit(onLogin)}
      >
        <div className="flex justify-center items-center space-x-3">
          {/* <UserPen size={30} /> */}
          <h1 className="font-normal text-xl md:text-4xl">Cadastro</h1>
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs md:text-base">Email</FormLabel>
              <FormControl>
                <Input className="text-xs md:text-base" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs md:text-base">Senha</FormLabel>
              <FormControl>
                <Input
                  className="text-xs md:text-base"
                  {...field}
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />{' '}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs md:text-base">
                Confirmar Senha
              </FormLabel>
              <FormControl>
                <Input
                  className="text-xs md:text-base"
                  {...field}
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && (
          <div className="text-red-500 text-sm flex items-center gap-x-2">
            <TriangleAlert size={15} />
            Algo deu errado
          </div>
        )}
        {success && (
          <div className="text-green-500  ">
            <span className="flex items-center gap-x-2 text-md">
              <CircleCheck size={15} /> Cadastro realizado com sucesso
            </span>
            <span className="flex items-center gap-x-2 text-sm">
              Um link de confirmação foi enviado ao seu email{' '}
              <MailCheck size={15} />
            </span>
          </div>
        )}
        <Button
          disabled={isLoading}
          className="w-1/2 self-end rounded-full text-xs md:text-base"
          type="submit"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : 'Cadastrar'}
        </Button>
      </form>
    </Form>
  );
};

export default Cadastro;
