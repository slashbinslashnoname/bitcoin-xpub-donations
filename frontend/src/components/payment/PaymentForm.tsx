import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface PaymentFormProps {
  onSubmit: (amount: number) => Promise<void>;
}

export function PaymentForm({ onSubmit }: PaymentFormProps) {
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await onSubmit(Number(amount))
    setIsLoading(false)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Bitcoin Payment</CardTitle>
        <CardDescription className="text-center">
          Enter the amount you want to pay in USD
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium text-center block">
              Amount (USD)
            </label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter USD amount"
              min="0.01"
              step="0.01"
              required
              className="text-center text-lg"
            />
          </div>
    
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Generate Payment Address'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 