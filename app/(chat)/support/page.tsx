'use client'
import Link from 'next/link'
import { MessageSquare, Phone, ThumbsUp } from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StudMedLogo } from '@/components/studmed-logo'
import { SidebarToggle } from '@/components/sidebar-toggle'
import { useSidebar } from '@/components/ui/sidebar'
import { useWindowSize } from 'usehooks-ts'

export default function SupportPage() {
  function criarLinkWhatsapp(numero: string, mensagem: string) {
    const numeroLimpo = numero.replace(/\D/g, '') // Remove espaços, parênteses e traços
    const mensagemCodificada = encodeURIComponent(mensagem)
    return `https://wa.me/${numeroLimpo}?text=${mensagemCodificada}`
  }

  const { open } = useSidebar()
  const { width: windowWidth } = useWindowSize()

  const supportLink = criarLinkWhatsapp(
    '+55 (47) 99658-9979',
    `Olá, equipe de suporte do StudMed,

Estou enfrentando um problema com [descreva o problema aqui].
Gostaria de saber como proceder para resolvê-lo.

Informações adicionais:
- Nome: [Seu Nome]
- Email: [Seu Email]

Aguardo retorno. Obrigado!`
  )

  const feedbackLink = criarLinkWhatsapp(
    '+55 (47) 99658-9979',
    `Olá, equipe do StudMed,

Gostaria de compartilhar meu feedback sobre a plataforma. Notei que [descreva o feedback, sugestões ou problemas identificados]. Acredito que [explique como a situação pode ser melhorada].

Fico à disposição para eventuais dúvidas ou mais esclarecimentos.

Obrigado!`
  )

  return (
    <div className="container mx-auto px-4 py-12">
      {(!open || windowWidth < 768) && <SidebarToggle />}
      <div className="mb-12 text-center">
        <div className="flex w-full items-center justify-center p-5 gap-3">
          <StudMedLogo className="h-10 w-10 text-primary" />
        </div>

        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Centro de Suporte
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Estamos aqui para ajudar. Encontre respostas para perguntas comuns ou
          entre em contato com nossa equipe de suporte.
        </p>
      </div>

      <Tabs defaultValue="faqs" className="w-full max-w-4xl mx-auto">
        <TabsList className="grid grid-cols-3 bg-sidebar w-full">
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="contact">Contato</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        {/* FAQs Section */}
        <TabsContent value="faqs" className="mt-6">
          <Card className="bg-sidebar">
            <CardHeader>
              <CardTitle>Perguntas Frequentes</CardTitle>
              <CardDescription>
                Como estamos em fase de MVP, algumas funcionalidades são
                limitadas e novas serão lançadas com o tempo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    Quais funcionalidades estão disponíveis no MVP?
                  </AccordionTrigger>
                  <AccordionContent>
                    Nosso foco atual é oferecer as funcionalidades essenciais
                    para validar a proposta. Funcionalidades mais avançadas já
                    estão sendo desenvolvidas e serão lançadas em breve.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    Como posso me cadastrar e acessar a plataforma?
                  </AccordionTrigger>
                  <AccordionContent>
                    O processo de cadastro é simples e rápido. Utilize o
                    formulário de registro na página inicial para criar sua
                    conta e começar a usar os recursos disponíveis no momento.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    Existe suporte para funcionalidades avançadas?
                  </AccordionTrigger>
                  <AccordionContent>
                    No momento, oferecemos apenas o suporte para os recursos
                    básicos. Com o avanço do projeto, funcionalidades avançadas
                    serão implementadas e suportadas.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>
                    Quando novas funcionalidades estarão disponíveis?
                  </AccordionTrigger>
                  <AccordionContent>
                    Estamos constantemente trabalhando para melhorar a
                    plataforma. Fique atento às nossas atualizações, pois novos
                    recursos serão lançados conforme a evolução do projeto.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>
                    Como posso enviar feedback ou relatar problemas?
                  </AccordionTrigger>
                  <AccordionContent>
                    Valorizamos sua opinião! Use o link de contato ou acesse a
                    seção de Feedback para nos enviar suas sugestões e reportar
                    qualquer problema.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>

            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Não encontrou o que procurava? Entre em contato com nossa equipe
                de suporte para obter assistência.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Contact Support Section */}
        <TabsContent value="contact" className="mt-6">
          <Card className="bg-sidebar">
            <CardHeader>
              <CardTitle>Contato com o Suporte</CardTitle>
              <CardDescription>
                Entre em contato com nossa equipe de suporte para obter
                assistência personalizada.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={supportLink}>
                <Button className="w-full">
                  <Phone /> Enviar mensagem no WhatssApp
                </Button>
              </Link>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <p className="text-sm">
                  Fique a vontade para mandar sua mensagem diretamente para nós
                </p>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Feedback Section */}
        <TabsContent value="feedback" className="mt-6">
          <Card className="bg-sidebar">
            <CardHeader>
              <CardTitle>Feedback e Sugestões</CardTitle>
              <CardDescription>
                Ajude-nos a melhorar nossa plataforma compartilhando suas ideias
                e reportando problemas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={feedbackLink}>
                <Button className="w-full">
                  <Phone /> Enviar mensagem no WhatssApp
                </Button>
              </Link>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2">
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-8 w-8" />
                <p className="text-sm">
                  Seu feedback nos ajuda a melhorar nossa plataforma para todos.
                  Obrigado por dedicar um tempo para compartilhar seus
                  pensamentos!
                </p>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
