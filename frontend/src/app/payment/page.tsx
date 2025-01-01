'use client'

import { Congratulations } from '@/components/payment/Congratulations'
import { ConnectionStatus } from '@/components/payment/ConnectionStatus'
import { PaymentForm } from '@/components/payment/PaymentForm'
import { PreviousStep } from '@/components/payment/PreviousStep'
import { QRCodeDisplay } from '@/components/payment/QRCodeDisplay'
import { Toaster } from '@/components/ui/toaster'
import { useWebSocket } from '@/hooks/useWebSocket'
import { showPaymentNotification } from '@/lib/notifications'
import { useState } from 'react'

export default function PaymentPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [paymentData, setPaymentData] = useState<{
    address: string;
    btcAmount: number;
    usdAmount: number;
    currency: 'BTC' | 'ETH';
  } | null>(null)
  const [status, setStatus] = useState<'pending' | 'processing' | 'confirmed' | 'failed'>('pending')

  const handlePaymentSubmit = async (amount: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/btc/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      })
      
      const data = await response.json()
      setPaymentData({
        address: data.address,
        btcAmount: data.btcAmount,
        usdAmount: data.usdAmount,
        currency: 'BTC',
      })
    } catch (error) {
      console.error('Failed to generate payment address:', error)
    }
  }

  useWebSocket(paymentData?.address ?? null, {
    onMessage: ({ status }) => {
      setStatus(status)
      showPaymentNotification(status)
    },
    onConnectionChange: setIsConnected
  })

  const handlePrevious = () => {
    setPaymentData(null)
    setStatus('pending')
    setIsConnected(false)
  }

  return (
    <div className="container mx-auto py-8 space-y-6 relative">
      <ConnectionStatus isConnected={isConnected} />
      {status === 'processing' ? (
        <Congratulations onReset={handlePrevious} />
      ) : !paymentData ? (
        <PaymentForm onSubmit={handlePaymentSubmit} />
      ) : (
        <>
          <QRCodeDisplay {...paymentData} />
          <PreviousStep handlePrevious={handlePrevious} />
        </>
      )}
      <Toaster />
    </div>
  )
} 