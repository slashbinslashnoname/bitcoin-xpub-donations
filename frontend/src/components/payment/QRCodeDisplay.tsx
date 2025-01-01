import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Copy } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeDisplayProps {
  address: string;
  btcAmount: number;
  usdAmount: number;
}

export function QRCodeDisplay({ address, btcAmount, usdAmount }: QRCodeDisplayProps) {
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(address)
    toast({
      title: 'Address copied',
      description: 'Payment address copied to clipboard',
    })
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Scan or Copy Address</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <QRCodeSVG
          value={`bitcoin:${address}?amount=${btcAmount}`}
          size={256}
          level="H"
          includeMargin
          className="rounded-lg"
        />
        
        <div className="w-full p-4 bg-muted rounded-md flex items-center justify-between">
          <code className="text-sm truncate max-w-[200px]">{address}</code>
          <Button variant="ghost" size="sm" onClick={copyToClipboard}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-sm text-muted-foreground space-y-1">
          <p>Please send:</p>
          <p className="font-mono">{btcAmount.toFixed(8)} BTC</p>
          <p className="text-xs">≈ ${usdAmount.toFixed(2)} USD</p>
        </div>
      </CardContent>
    </Card>
  )
} 