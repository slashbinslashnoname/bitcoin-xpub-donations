import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import './config/env';
import { bitcoinRouter } from './routes/bitcoin';
import { getBitcoinService } from './services/factories/bitcoin';
import { initializeWebSocket } from './services/factories/websocket';
import { MonitorService } from './services/monitor';

dotenv.config();

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize services
const bitcoinService = getBitcoinService();
const monitorService = new MonitorService(bitcoinService);

// Initialize WebSocket service first
initializeWebSocket(server, monitorService);

// Routes
app.use('/api/payment/btc', bitcoinRouter);

// Start polling for payment status updates
setInterval(async () => {
  // TODO: Implement polling for all active payment addresses
}, 10000); // Poll every 10 seconds

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 