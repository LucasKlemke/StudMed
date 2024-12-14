'use client';
import { PlusIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { NavMain } from '@/components/nav-main';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from './ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { deleteHistory, getHistory } from '@/app/app/chat/__actions/chat';
import { useHistoryStore } from '@/store/history';
import { ciclo_clinico } from '@/lib/materias';
import { useSubjectStore } from '@/store/subject';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { ciclo_basico } from '@/lib/materias';
import path from 'path';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { setOpen, open } = useSidebar();
  const { history, setHistory }: any = useHistoryStore();
  const { subject, setSubject }: any = useSubjectStore();
  const [modal, setModal] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const subjectParam = searchParams.get('subject');
  const pathname = usePathname();

  const fetchHistory = async () => {
    const history = await getHistory();
    setHistory(history);
  };

  useEffect(() => {
    router.push(`?subject=${ciclo_basico[0].nome}`);
    fetchHistory();
  }, []);

  return (
    <>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader className="pt-5">
          <Link href={`/app/chat?subject=${ciclo_basico[0].nome}`}>
            <Button className={'w-1/2 rounded-full'}>
              <PlusIcon />
              {open && 'Novo Chat'}
            </Button>
          </Link>
        </SidebarHeader>
        {/* ---- HISTORICO ---- */}
        <SidebarContent>
          <NavMain items={history} />
        </SidebarContent>
        <SidebarFooter>
          {/* ---- Botao para abrir modal de Materias ---- */}
          {open && <SidebarGroupLabel>Matéria</SidebarGroupLabel>}
          {open && (
            <Button
              disabled={pathname !== '/app/chat'}
              variant="outlined"
              className={`${
                ciclo_basico.find((materia) => materia.nome === subjectParam)
                  ?.text
              } flex justify-start font-bold`}
              onClick={() => setModal(true)}
            >
              {
                ciclo_basico.find((materia) => materia.nome === subjectParam)
                  ?.title
              }
            </Button>
          )}

          {open && <SidebarGroupLabel>Matéria</SidebarGroupLabel>}
          {open && <Button>Sobre</Button>}
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <Dialog open={modal} onOpenChange={setModal}>
        <DialogContent className="max-w-7xl">
          <DialogHeader>
            <DialogTitle>Selecionar matéria</DialogTitle>
            <DialogDescription>Selecione a matéria</DialogDescription>
            <Tabs defaultValue="account">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="account">1. Ciclo Básico</TabsTrigger>
                <TabsTrigger value="password">2. Ciclo Clinico</TabsTrigger>
              </TabsList>
              <TabsContent value="account">
                <Input placeholder="Procurar Matéria" />
                <div className="grid grid-rows-10 grid-flow-col gap-4 p-4 ">
                  {ciclo_basico.map((materia) => (
                    <Link
                      href={`?${new URLSearchParams({
                        subject: materia.nome,
                      })}`}
                    >
                      <Button
                        key={materia.nome}
                        className={`${materia.bg} flex justify-start w-[300px] rounded-full`}
                        onClick={() => {
                          // setSubject(materia);
                          setModal(false);
                        }}
                      >
                        {materia.title}
                      </Button>
                    </Link>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="password">
                <Input placeholder="Procurar Matéria" />
                <div className="grid grid-rows-6 grid-flow-col gap-4 p-4 ">
                  {ciclo_clinico.map((materia) => (
                    <Button
                      key={materia.nome}
                      className={`${materia.bg} flex justify-start rounded-full w-[300px]`}
                    >
                      {materia.nome}
                    </Button>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
