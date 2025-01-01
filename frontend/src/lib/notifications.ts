import { toast } from '@/hooks/use-toast'

type PaymentStatus = 'pending' | 'processing' | 'confirmed' | 'failed'

const PAYMENT_MESSAGES = {
  pending: {
    title: 'Waiting for payment',
    description: 'Waiting for payment confirmation, please send payment to the address below...',
  },
  processing: {
    title: 'Payment Processing',
    description: 'Transaction is being confirmed...',
  },
  confirmed: {
    title: 'Payment Confirmed',
    description: 'Your payment has been confirmed on the blockchain!',
  },
  failed: {
    title: 'Payment Failed',
    description: 'There was an issue with your payment. Please try again.',
  },
} as const

export function showPaymentNotification(status: PaymentStatus) {
  const message = PAYMENT_MESSAGES[status]
  
  toast({
    title: message.title,
    description: message.description,
    variant: status === 'confirmed' || status === 'processing' || status === 'pending' ? 'default' : 'destructive',
  })
} 