import { Badge } from "@/components/ui/badge"

interface ConnectionStatusProps {
  isConnected: boolean
}

export function ConnectionStatus({ isConnected }: ConnectionStatusProps) {
  return (
    <Badge 
      variant={isConnected ? "success" : "destructive"} 
      className="absolute top-4 right-4 transition-colors duration-300"
    >
      {isConnected ? "Connected" : "Disconnected"}
    </Badge>
  )
} 