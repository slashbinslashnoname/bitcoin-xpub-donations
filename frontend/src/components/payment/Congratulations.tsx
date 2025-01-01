import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

interface CongratulationsProps {
  onReset: () => void
}

export function Congratulations({ onReset }: CongratulationsProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
        <CardTitle className="text-2xl">Payment Successful!</CardTitle>
        <CardDescription>
          Your payment has been confirmed on the blockchain
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Button onClick={onReset}>Make Another Payment</Button>
      </CardContent>
    </Card>
  )
} 