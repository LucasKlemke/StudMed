'use client'

import { useState } from 'react'

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const customerData = {
      customerId: 'ID_DO_CLIENTE', // Substitua pelo ID real
      amount: 2990, // R$29,90
      interval: 'month',
    }

    try {
      const response = await fetch('/api/webhook/abacatepay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData),
      })

      const data = await response.json()
      if (response.ok) {
        alert('Assinatura criada com sucesso!')
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Erro ao processar a assinatura')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Criar Assinatura</h1>
      <form onSubmit={handleSubmit}>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {loading ? 'Processando...' : 'Assinar por R$29,90/mês'}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  )
}
