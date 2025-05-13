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
import { useTranslations } from 'next-intl'

export default function AccountInfo({
  user,
  subscription,
}: {
  user: User
  subscription: any
}) {
  const t = useTranslations('UserInfo.AccountInfo')
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
          <Card className="bg-background shadow-lg border  rounded-xl overflow-hidden">
            <CardHeader className="bg-sidebar">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-x-2 ">
                  <CreditCard className="h-5 w-5 text-emerald-500" />
                  {t('title')}
                </CardTitle>
                {subscription?.status === 'active' ? (
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 px-3">
                    <BadgeCheck className="h-4 w-4 mr-1" />
                    {t('activeBadge')}
                  </Badge>
                ) : (
                  <Badge className="bg-destructive text-destructive-foreground  px-3">
                    <BadgeAlert className="h-4 w-4 mr-1" />
                    {t('inactiveBadge')}
                  </Badge>
                )}
              </div>
              <CardDescription className="text-slate-500">
                {t('cardDescription')}
              </CardDescription>
            </CardHeader>
            {!subscription ? (
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <ShieldOff className="h-12 w-12 text-slate-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {t('noSubscription')}
                  </h3>
                  <p className="text-slate-500 max-w-md">
                    {t('noSubscriptionDescription')}
                  </p>
                </div>

                <Separator className="my-6 bg-slate-200" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="flex flex-col items-center p-4">
                    <Zap className="h-8 w-8 text-primary mb-3" />
                    <h4 className="font-medium mb-1">{t('feature1Title')}</h4>
                    <p className="text-sm text-slate-500 text-center">
                      {t('feature1Description')}
                    </p>
                  </div>

                  <div className="flex flex-col items-center p-4">
                    <Star className="h-8 w-8 text-primary mb-3" />
                    <h4 className="font-medium mb-1">{t('feature2Title')}</h4>
                    <p className="text-sm text-slate-500 text-center">
                      {t('feature2Description')}
                    </p>
                  </div>

                  <div className="flex flex-col items-center p-4">
                    <CreditCard className="h-8 w-8 text-primary mb-3" />
                    <h4 className="font-medium mb-1">{t('feature3Title')}</h4>
                    <p className="text-sm text-slate-500 text-center">
                      {t('feature3Description')}
                    </p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <PaymentButton>{t('paymentButton')}</PaymentButton>
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
                            {t('nextBilling')}{' '}
                            <span className="font-medium ">
                              {new Date(
                                new Date(
                                  subscription.billing_cycle_anchor * 1000,
                                ).setMonth(
                                  new Date(
                                    subscription.billing_cycle_anchor * 1000,
                                  ).getMonth() + 1,
                                ),
                              ).toLocaleDateString('pt-BR')}
                            </span>
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm ">
                          <CreditCard className="h-4 w-4 text-slate-400" />
                          <span>
                            {t('price')}{' '}
                            <span className="font-medium ">
                              {(subscription.plan.amount / 100).toLocaleString(
                                'pt-BR',
                                {
                                  style: 'currency',
                                  currency: 'BRL',
                                },
                              )}
                            </span>
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm ">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span className="flex items-center gap-1">
                            {t('cicle')}
                            <span className="font-medium  ml-1">
                              {subscription.plan.interval === 'month' &&
                                t('cycle')}
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
                          {t('changePaymentMethod')}
                        </Button>
                      </Link>
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
