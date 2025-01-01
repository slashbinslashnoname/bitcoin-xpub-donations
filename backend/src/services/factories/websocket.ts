import { Server } from 'http'
import { MonitorService } from '../monitor'
import { WebSocketService } from '../websocket'

let wsService: WebSocketService | null = null

export function getWebSocketService(): WebSocketService | null {
  return wsService
}

export function initializeWebSocket(server: Server, monitorService: MonitorService): void {
  wsService = new WebSocketService(server, monitorService)
} 