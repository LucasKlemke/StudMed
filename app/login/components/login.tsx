'use client';
import React from 'react';
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
  Loader,
  Loader2,
  LogIn,
  TriangleAlert,
  User,
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

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const Login = ({
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

  const onLogin = async (data: z.infer<typeof formSchema>) => {
    console.log(data);
    setIsLoading(true);
    const error = await login({ email: data.email, password: data.password });

    if (error) {
      setError(true);
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form
        className="space-y-4 flex flex-col justify-center "
        onSubmit={form.handleSubmit(onLogin)}
      >
        <div className="flex justify-center items-center space-x-3">
          {/* <User size={30} /> */}
          <h1 className="font-normal text-xl md:text-4xl">Entrar</h1>
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
        />
        {error && (
          <div className="text-red-500 text-sm flex items-center gap-x-2">
            <TriangleAlert size={15} />
            Email ou senha inválidos
          </div>
        )}
        <Button
          disabled={isLoading}
          className="w-1/2 self-end rounded-full text-xs md:text-base"
          type="submit"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : 'Entrar'}
        </Button>

        <div className="space-x-2 flex">
          {/* <Button className="w-full" variant="outline" formAction={signup}>
              Cadastrar
            </Button> */}
        </div>
      </form>
    </Form>
  );
};

export default Login;
