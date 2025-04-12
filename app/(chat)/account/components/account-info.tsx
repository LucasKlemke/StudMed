import type React from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  BadgeCheck,
  Calendar,
  CreditCard,
  X,
  Shield,
  Clock,
  ShieldOff,
  Zap,
  Star,
  BadgeAlert,
} from 'lucide-react'
import type { User } from 'next-auth'
// import PaymentButton from './payment-button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import Form from 'next/form'
import { cancelSubscriptionAction } from '../_actions/cancel-subscription-action'
import Link from 'next/link'
import PaymentButton from './payment-button'

export default function AccountInfo({
  user,
  subscription,
}: {
  user: User
  subscription: any
}) {
  // const [originalName, setOriginalName] = useState(user?.username)
  // const [name, setName] = useState(originalName)
  // const [email, setEmail] = useState(user?.email)
  // const [isEditing, setIsEditing] = useState(false)
  // const [avatar, setAvatar] = useState('/placeholder.svg?height=100&width=100')

  // useEffect(() => {
  //   if (name !== originalName) {
  //     setIsEditing(true)
  //   }
  // }, [name])

  // const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
  //   setName(e.target.value)
  // const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
  //   setEmail(e.target.value)

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   // Here you would typically send the updated info to your backend
  //   console.log('Updated info:', { name, email, avatar })

  //   // Uncomment and implement the update function
  //   // await update({ username: name })

  //   setIsEditing(false)
  //   window.location.reload()
  // }

  // const getInitials = (name: string) => {
  //   return name
  //     ? name
  //         .split(' ')
  //         .map((n) => n[0])
  //         .join('')
  //         .toUpperCase()
  //     : 'U'
  // }

  return (
    <>
      {user && (
        <div className="space-y-8 ">
          {/* <Card className="bg-background shadow-lg border  rounded-xl overflow-hidden">
            <CardHeader className="bg-sidebar pb-6">
              <CardTitle className="flex items-center gap-x-2 ">
                <UserCircle className="h-5 w-5 text-emerald-500" />
                Informações do perfil
              </CardTitle>
              <CardDescription className="text-slate-500">
                Gerencie suas informações pessoais e configurações de conta
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row gap-8 mb-6">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative group">
                      <Avatar className="h-28 w-28 ring-2 ring-offset-2 ">
                        <AvatarImage src={avatar} alt={name || 'User'} />
                        <AvatarFallback className="text-xl bg-emerald-100 text-emerald-600 font-medium">
                          {getInitials(name || '')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white h-10 w-10"
                          type="button"
                        >
                          <Upload className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs font-medium "
                      type="button"
                    >
                      Alterar foto
                    </Button>
                  </div>

                  <div className="flex-1 space-y-5">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-slate-700 font-medium"
                      >
                        Nome
                      </Label>
                      <Input
                        className={`${
                          isEditing
                            ? 'border-emerald-500 ring-1 ring-emerald-500/20'
                            : 'border-slate-200'
                        } focus-visible:ring-emerald-500/20 h-11`}
                        id="name"
                        value={name}
                        onChange={handleNameChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-slate-700 font-medium"
                      >
                        Email
                      </Label>
                      <div className="flex gap-x-3">
                        <Input
                          disabled
                          id="email"
                          type="email"
                          value={email as string}
                          onChange={handleEmailChange}
                          className="flex-1  h-11"
                        />
                        <Button
                          disabled
                          className="rounded-full "
                          type="button"
                        >
                          Editar
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="password"
                        className="text-slate-700 font-medium"
                      >
                        Senha
                      </Label>
                      <div className="flex gap-x-3">
                        <Input
                          disabled
                          id="password"
                          type="password"
                          value={'••••••••••••••••'}
                          className="flex-1  h-11"
                        />
                        <Button
                          disabled
                          className="rounded-full "
                          type="button"
                        >
                          Editar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end p-6 b">
              {isEditing && (
                <>
                  <Button
                    type="submit"
                    onClick={handleSubmit}
                    className="mr-3 bg-emerald-500 hover:bg-emerald-600"
                  >
                    Salvar alterações
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setName(originalName)
                      setIsEditing(false)
                    }}
                    className="border-slate-200 text-slate-700 hover:bg-slate-100"
                  >
                    Cancelar
                  </Button>
                </>
              )}
            </CardFooter>
          </Card> */}

          <Card className="bg-background shadow-lg border  rounded-xl overflow-hidden">
            <CardHeader className="bg-sidebar">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-x-2 ">
                  <CreditCard className="h-5 w-5 text-emerald-500" />
                  Minha assinatura
                </CardTitle>
                {subscription?.status === 'active' ? (
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 px-3">
                    <BadgeCheck className="h-4 w-4 mr-1" />
                    Ativo
                  </Badge>
                ) : (
                  <Badge className="bg-destructive text-destructive-foreground  px-3">
                    <BadgeAlert className="h-4 w-4 mr-1" />
                    Inativo
                  </Badge>
                )}
              </div>
              <CardDescription className="text-slate-500">
                Gerencie sua assinatura e informações de pagamento
              </CardDescription>
            </CardHeader>
            {!subscription ? (
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <ShieldOff className="h-12 w-12 text-slate-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Nenhuma assinatura ativa
                  </h3>
                  <p className="text-slate-500 max-w-md">
                    Você ainda não possui uma assinatura ativa. Assine agora
                    para acessar todos os recursos premium.
                  </p>
                </div>

                <Separator className="my-6 bg-slate-200" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="flex flex-col items-center p-4">
                    <Zap className="h-8 w-8 text-primary mb-3" />
                    <h4 className="font-medium mb-1">Acesso Premium</h4>
                    <p className="text-sm text-slate-500 text-center">
                      Acesso ilimitado a todos os recursos da plataforma
                    </p>
                  </div>

                  <div className="flex flex-col items-center p-4">
                    <Star className="h-8 w-8 text-primary mb-3" />
                    <h4 className="font-medium mb-1">Recursos Exclusivos</h4>
                    <p className="text-sm text-slate-500 text-center">
                      Funcionalidades disponíveis apenas para assinantes
                    </p>
                  </div>

                  <div className="flex flex-col items-center p-4">
                    <CreditCard className="h-8 w-8 text-primary mb-3" />
                    <h4 className="font-medium mb-1">Pagamento Flexível</h4>
                    <p className="text-sm text-slate-500 text-center">
                      Cancele a qualquer momento sem compromisso
                    </p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <PaymentButton>Assinar agora</PaymentButton>
                </div>
              </CardContent>
            ) : (
              <CardContent className="p-6">
                <div className=" rounded-xl p-6 border ">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-emerald-500" />
                        <span className="font-semibold  text-lg">
                          {subscription.plan.nickname}
                        </span>
                      </div>

                      <Separator className="my-4 bg-slate-200" />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm ">
                          <Clock className="h-4 w-4 text-slate-400" />
                          <span>
                            Próxima cobrança:{' '}
                            <span className="font-medium ">
                              {new Date(
                                new Date(
                                  subscription.billing_cycle_anchor * 1000
                                ).setMonth(
                                  new Date(
                                    subscription.billing_cycle_anchor * 1000
                                  ).getMonth() + 1
                                )
                              ).toLocaleDateString('pt-BR')}
                            </span>
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm ">
                          <CreditCard className="h-4 w-4 text-slate-400" />
                          <span>
                            Valor:{' '}
                            <span className="font-medium ">
                              {(subscription.plan.amount / 100).toLocaleString(
                                'pt-BR',
                                {
                                  style: 'currency',
                                  currency: 'BRL',
                                }
                              )}
                            </span>
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm ">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span className="flex items-center gap-1">
                            Ciclo:
                            <span className="font-medium  ml-1">
                              {subscription.plan.interval === 'month' &&
                                'Mensal'}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-3 w-full md:w-auto">
                      <Link
                        target="_blank"
                        href={process.env.STRIPE_CUSTOMER_PORTAL_URL ?? ''}
                      >
                        <Button
                          variant="outline"
                          className="px-4 py-2 h-auto text-sm w-full md:w-fit font-medium "
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          Alterar método de pagamento
                        </Button>
                      </Link>

                      <Form action={cancelSubscriptionAction}>
                        <input
                          type="hidden"
                          name="subscriptionId"
                          value={subscription.id}
                        />
                        <Button className="px-4 py-2 text-sm w-full font-medium bg-rose-500 hover:bg-rose-600 text-white">
                          <X className="h-4 w-4 mr-2" /> Cancelar assinatura
                        </Button>
                      </Form>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </>
  )
}
