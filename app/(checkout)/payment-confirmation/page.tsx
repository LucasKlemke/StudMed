'use client'

import { Check, CreditCard, PartyPopper } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
import { useReward } from 'react-rewards'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const CheckoutReturnPage = () => {
  const { reward, isAnimating } = useReward('rewardId', 'confetti', {
    elementCount: 150,
    spread: 120,
    lifetime: 400,
  })

  useEffect(() => {
    // Trigger confetti when component mounts
    const timer = setTimeout(() => {
      reward()
    }, 300)

    return () => clearTimeout(timer)
  }, [reward])

  return (
    <div
      className="flex min-h-[80vh] items-center justify-center p-4"
      id="rewardId"
    >
      <Card className="w-full max-w-md overflow-hidden border-2 border-green-400">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90 z-10" />
          <Image
            src="https://media4.giphy.com/media/etOX3h7ApZuDe7Fc5w/giphy.gif?cid=6c09b952fyum2hs13e0fw5net7xqkur9gaxg5qid1lxpbp3d&ep=v1_gifs_search&rid=giphy.gif&ct=g"
            alt="Kermit dancing with joy"
            className="w-full object-cover"
            height={100}
            width={100}
          />
        </div>

        <CardHeader className="text-center relative z-20 -mt-10 pt-0">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 border-4 border-background shadow-lg">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <div className="space-y-2">
            <Badge
              variant="outline"
              className="bg-green-100 text-green-700 border-green-300 px-3 py-1 text-sm font-medium"
            >
              <PartyPopper className="mr-1 h-4 w-4" /> Sucesso!
            </Badge>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
              Pagamento confirmado!
            </CardTitle>
          </div>
          <CardDescription className="mt-3 text-base">
            Sua assinatura foi criada com sucesso. Você pode começar a usar o
            StudMed imediatamente.{' '}
            <span className="text-green-500 font-medium">Yay! 🎉</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <CreditCard className="h-4 w-4" />
            <span>Transação processada com sucesso</span>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col pb-6">
          <Link href="/" className="w-full">
            <Button className="w-full h-12 text-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-md hover:shadow-lg">
              Começar a usar agora! 🚀
            </Button>
          </Link>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Kermit está dançando de alegria por você ter se juntado a nós!
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default CheckoutReturnPage
