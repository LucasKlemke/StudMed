'use client'
import type React from 'react'
import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Loader2, ArrowRight } from 'lucide-react'
import { useSession } from 'next-auth/react'

interface FormData {
  name: string
  cellphone: string
  email: string
  taxId: string
}

interface ApiResponse {
  error?: string
  customerId?: string
  [key: string]: any
}

interface BillingResponse {
  error?: string
  frequency?: string
  methods?: string[]
  products?: any[]
  returnUrl?: string
  completionUrl?: string
  [key: string]: any
}

const ProductPurchase = ({
  customerId,
  onBack,
}: {
  customerId: string
  onBack: () => void
}) => {
  const [loading, setLoading] = useState(false)
  const [billingResult, setBillingResult] = useState<BillingResponse | null>(
    null,
  )

  const handlePurchase = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/webhook/abacatepay/create-billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId }),
      })
      const data = await res.json()
      setBillingResult(data)

      // billingResult abaixo
      //       Billing created: {
      //   error: null,
      //   data: {
      //     products: [ [Object] ],
      //     amount: 2996,
      //     status: 'ACTIVE',
      //     devMode: true,
      //     methods: [ 'PIX' ],
      //     frequency: 'MULTIPLE_PAYMENTS',
      //     allowCoupons: false,
      //     coupons: [],
      //     metadata: {
      //       fee: 100,
      //       returnUrl: 'https:localhostasnoira',
      //       completionUrl: 'https:localhostasnoira'
      //     },
      //     createdAt: '2025-04-24T23:25:20.797Z',
      //     updatedAt: '2025-04-24T23:25:20.797Z',
      //     couponsUsed: [],
      //     url: 'https://abacatepay.com/pay/bill_ZJS4Xt6cjQCQUYy15A0K3sYp',
      //     customer: { id: 'cust_MPa2cjjkfurL3t3DfAF5RsYJ', metadata: [Object] },
      //     id: 'bill_ZJS4Xt6cjQCQUYy15A0K3sYp'
      //   }
      // }

      // Replace this code:
      // If URLs are provided, redirect to the returnUrl
      // if (data.returnUrl && !data.error) {
      //   window.location.href = data.returnUrl
      // }

      // With this code:
      // Redirect to the billing URL if available
      if (data.data?.url && !data.error) {
        window.location.href = data.data.url
      } else if (data.url && !data.error) {
        window.location.href = data.url
      }
    } catch {
      setBillingResult({ error: 'Erro ao processar pagamento.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Finalizar compra</CardTitle>
        <CardDescription>
          Confira os detalhes do produto e finalize sua compra
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-lg">
            <h3 className="font-medium text-lg mb-2">Studmed Pro</h3>
            <p className="text-slate-600 mb-2">Assinatura mensal Studmed</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">Quantidade: 1</span>
              <span className="font-medium text-lg">R$ 29,90</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>R$ 29,90</span>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <Button
              onClick={handlePurchase}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  Gerar PIX
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            <Button variant="outline" onClick={onBack} disabled={loading}>
              Voltar
            </Button>
          </div>
        </div>
      </CardContent>

      {billingResult?.error && (
        <CardFooter className="flex flex-col items-start pt-0">
          <Alert variant="destructive" className="w-full">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{billingResult.error}</AlertDescription>
          </Alert>
        </CardFooter>
      )}
    </Card>
  )
}

const CreateClientForm = () => {
  const { data: session } = useSession()
  const [form, setForm] = useState<FormData>({
    name: '',
    cellphone: '',
    email: session?.user?.email || '',
    taxId: '',
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ApiResponse | null>(null)
  const [isBuying, setIsBuying] = useState(false)
  const [customerId, setCustomerId] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/webhook/abacatepay/create-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      setResult(data)

      // If registration was successful and we have a customerId, move to step 2
      if (!data.error && data.data?.id) {
        setCustomerId(data.data.id)
        setIsBuying(true)
      }
    } catch {
      setResult({ error: 'Erro ao criar cliente.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {isBuying ? (
        <ProductPurchase
          customerId={customerId}
          onBack={() => setIsBuying(false)}
        />
      ) : (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Cadastrar dados de PIX</CardTitle>
            <CardDescription>
              Preencha os dados para prosseguir com a geração de PIX
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="email@exemplo.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Nome completo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cellphone">Celular</Label>
                <Input
                  id="cellphone"
                  name="cellphone"
                  value={form.cellphone}
                  onChange={handleChange}
                  required
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxId">CPF</Label>
                <Input
                  id="taxId"
                  name="taxId"
                  value={form.taxId}
                  onChange={handleChange}
                  required
                  placeholder="000.000.000-00"
                />
              </div>

              <Button type="submit" className="w-full mt-6" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    Continuar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          {result?.error && (
            <CardFooter className="flex flex-col items-start pt-0">
              <Alert variant="destructive" className="w-full">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{result.error}</AlertDescription>
              </Alert>
            </CardFooter>
          )}
        </Card>
      )}
    </>
  )
}

export default function Page() {
  return (
    <div className="container py-10">
      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-medium">
                1
              </div>
              <span className="text-xs mt-1">Cadastro</span>
            </div>
            <div className="flex-1 h-0.5 bg-slate-200 mx-2"></div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 text-slate-600 font-medium">
                2
              </div>
              <span className="text-xs mt-1">Pagamento</span>
            </div>
          </div>
        </div>
      </div>
      <CreateClientForm />
    </div>
  )
}
