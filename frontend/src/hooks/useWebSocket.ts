import { useEffect, useRef } from 'react'

interface WebSocketMessage {
  type: string
  data: {
    status: 'pending' | 'confirmed' | 'failed'
    confirmations?: boolean
  }
}

interface WebSocketHookOptions {
  onMessage: (data: WebSocketMessage['data']) => void
  onConnectionChange: (isConnected: boolean) => void
}

export function useWebSocket(address: string | null, { onMessage, onConnectionChange }: WebSocketHookOptions) {
  const ws = useRef<WebSocket | null>(null)
  const reconnectTimeout = useRef<NodeJS.Timeout>()
  const connectionTimeout = useRef<NodeJS.Timeout>()

  const connect = () => {
    if (!address) return
    
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'
    ws.current = new WebSocket(wsUrl)

    ws.current.onopen = () => {
      console.log('WebSocket connected, subscribing to:', address)
      clearTimeout(reconnectTimeout.current)
      
      // Debounce connection status change
      clearTimeout(connectionTimeout.current)
      connectionTimeout.current = setTimeout(() => {
        onConnectionChange(true)
      }, 1000)

      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ type: 'subscribe', address }))
      }
    }

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error)
      handleDisconnect()
    }

    ws.current.onclose = () => {
      console.log('WebSocket disconnected')
      handleDisconnect()
    }

    ws.current.onmessage = (event) => {
      try {
        console.log('WebSocket message received:', event.data)
        const message: WebSocketMessage = JSON.parse(event.data)
        if (message.type === 'payment_status') {
          onMessage(message.data)
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }
  }

  const handleDisconnect = () => {
    clearTimeout(connectionTimeout.current)
    onConnectionChange(false)

    // Attempt to reconnect after a delay
    clearTimeout(reconnectTimeout.current)
    reconnectTimeout.current = setTimeout(() => {
      console.log('Attempting to reconnect...')
      connect()
    }, 5000)
  }

  useEffect(() => {
    connect()

    return () => {
      clearTimeout(reconnectTimeout.current)
      clearTimeout(connectionTimeout.current)
      ws.current?.close()
    }
  }, [address])

  return ws.current
} 