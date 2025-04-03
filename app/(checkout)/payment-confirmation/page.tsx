import { Check, Package, Truck } from 'lucide-react'
import Link from 'next/link'

import { Button, buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

const CheckoutReturnPage = () => {
  return (
    <div className="flex max-w-lg items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sidebar">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Pagamento confirmado !</CardTitle>
          <CardDescription>
            Sua assinatura foi criada com sucesso. Você pode começar a usar o
            StudMed imediatamente.
          </CardDescription>
        </CardHeader>

        <CardFooter className="flex flex-col">
          <Link href="/" className='w-full'>
            <Button className="w-full">Começar a usar</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

export default CheckoutReturnPage
