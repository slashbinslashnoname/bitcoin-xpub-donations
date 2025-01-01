import { Server } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import { MonitorService } from './monitor';

export class WebSocketService {
  private readonly wss: WebSocketServer;
  private clients: Map<string, WebSocket> = new Map();
  private static instance: WebSocketService;
  private monitorService: MonitorService;

  constructor(server: Server, monitorService: MonitorService) {
    if (WebSocketService.instance) {
      this.wss = WebSocketService.instance.wss;
      this.monitorService = WebSocketService.instance.monitorService;
      WebSocketService.instance = this;
      return;
    }
    
    this.wss = new WebSocketServer({ server });
    this.monitorService = monitorService;
    this.setupMonitoring();
    this.setupWebSocket();
    WebSocketService.instance = this;
  }

  private setupMonitoring() {
    this.monitorService.onStatusChange((address, status) => {
      this.notifyPaymentStatus(address, status, status === 'confirmed');
    });
  }

  private setupWebSocket() {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('New client connected');

      ws.on('message', (message: string) => {
        try {
          console.log('Received message:', message.toString());
          const { type, address } = JSON.parse(message);
          if (type === 'subscribe') {
            this.clients.set(address, ws);
            this.monitorService.addAddress(address);
            console.log(`Client subscribed to address: ${address}`);
            this.notifyPaymentStatus(address, 'pending', false);
          }
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      });

      ws.on('close', () => {
        console.log('Client disconnected');
        for (const [address, client] of this.clients.entries()) {
          if (client === ws) {
            this.clients.delete(address);
            this.monitorService.removeAddress(address);
            console.log(`Client unsubscribed from address: ${address}`);
          }
        }
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });
  }

  public notifyPaymentStatus(address: string, status: string, confirmations?: boolean) {
    const client = this.clients.get(address);
    if (client && client.readyState === WebSocket.OPEN) {
      console.log(`Notifying client about payment status for address: ${address}`);
      console.log(`Status: ${status}, Confirmations: ${confirmations}`);
      client.send(JSON.stringify({ 
        type: 'payment_status',
        data: { 
          status,
          confirmations 
        }
      }));
    }
  }

  public static getInstance(): WebSocketService | null {
    return WebSocketService.instance || null;
  }
} 