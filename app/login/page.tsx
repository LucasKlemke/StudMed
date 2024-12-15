'use client';
import { login, signup } from './actions';

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
  UserRoundPen,
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
import Login from '@/app/login/components/login';
import Cadastro from './components/cadastro';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 sm:h-full md:h-screen items-center bg-gray-100 ">
      <Card className=" h-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl md:text-7xl font-semibold">
            <span className="flex">
              StudMed
               {/* <ActivityIcon className='sm:invisible md:visible' size={50} /> */}
            </span>
          </CardTitle>
          <CardDescription className="text-sm md:text-xl">
            Sua assistente inteligente para otimizar seus estudos na área
            médica.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div>
            <Image
              src={'/estudante.jpg'}
              alt={'estudante'}
              className="rounded-full"
              height={500}
              width={500}
            />
          </div>
        </CardContent>
      </Card>
      <div className="p-5 flex justify-center col-span-1">
        <Tabs defaultValue="login" className="w-2/3">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" disabled={isLoading}>
              Login
            </TabsTrigger>
            <TabsTrigger value="cadastro" disabled={isLoading}>
              Cadastro
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="w-full ">
            <Login isLoading={isLoading} setIsLoading={setIsLoading} />
          </TabsContent>
          <TabsContent value="cadastro">
            <Cadastro isLoading={isLoading} setIsLoading={setIsLoading} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
