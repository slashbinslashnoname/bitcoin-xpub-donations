import { BIP32Factory } from 'bip32';
import { networks, payments } from 'bitcoinjs-lib'; // Import payments and networks
import { EventEmitter } from 'events';
import * as tinysecp from 'tiny-secp256k1'; // Import tiny-secp256k1
import { z } from 'zod';
import { env } from '../config/env';
import { fromZPub } from '../utils/bitcoin';
import { getWebSocketService } from './factories/websocket';
import { priceService } from './price';
import { WebSocketService } from './websocket';

// Verify that we're getting the environment variables
console.log('Bitcoin Service Config:', {
  xpubExists: !!env.BITCOIN_XPUB,
  network: env.BITCOIN_NETWORK,
})

const envSchema = z.object({
  BITCOIN_XPUB: z.string().min(1),
});

const { BITCOIN_XPUB } = envSchema.parse(process.env);

const bip32 = BIP32Factory(tinysecp);
interface TxRef {
  txid: string;
  version: number;
  locktime: number;
  vin: unknown[];
  vout: unknown[];
  size: number;
  weight: number;
  fee: number;
  status: {
    confirmed: boolean;
  };
}

interface PaymentRequest {
  usdAmount: number;
}

export class BitcoinService {
  private currentIndex = 0;
  private eventEmitter = new EventEmitter();
  private wsService: WebSocketService | null = null;

  constructor() {
    this.wsService = getWebSocketService();
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.eventEmitter.on('payment_status', (address: string, status: string, confirmations: boolean) => {
      if (this.wsService) {
        this.wsService.notifyPaymentStatus(address, status, confirmations);
      }
    });
  }

  async generatePaymentAddress(): Promise<string> {
    try {
      let address = '';
      let hasFunds = true;

      while (hasFunds) {
        const hdNode = BITCOIN_XPUB.startsWith('zpub')
          ? fromZPub(BITCOIN_XPUB)
          : bip32.fromBase58(BITCOIN_XPUB);

        const childNode = hdNode
          .derive(0) // External chain
          .derive(this.currentIndex); // Address index

        // Convert public key to Buffer
        const publicKeyBuffer = Buffer.from(childNode.publicKey);
        const network = env.BITCOIN_NETWORK === 'mainnet' 
          ? networks.bitcoin 
          : networks.testnet;

        const payment = payments.p2wpkh({
          pubkey: publicKeyBuffer,
          network
        });

        if (!payment || !payment.address) {
          throw new Error('Failed to generate Bitcoin address');
        }

        address = payment.address;

        // Check if the address has funds
        const status = await this.getPaymentStatus(address);
        console.log(`Payment status: ${status}`);
        hasFunds = status === 'confirmed' || status === 'processing';

        if (hasFunds) {
          console.log(`Generated address has funds: ${address}`);
          this.currentIndex++; // Increment index if funds are present
        }
      }

      console.log(`Generated address: ${address}`);
      console.log(`Current index: ${this.currentIndex}`);

      return address;
    } catch (error) {
      console.error('Error generating Bitcoin address:', error);
      throw new Error('Failed to generate Bitcoin address');
    }
  }

  async getPaymentStatus(address: string): Promise<'pending' | 'processing' | 'confirmed' | 'failed'> {
    try {
      console.log(`Getting payment status for address: ${address}`);
      const [confirmedResponse, mempoolResponse] = await Promise.all([
        fetch(`https://blockstream.info/api/address/${address}/txs`),
        fetch(`https://blockstream.info/api/address/${address}/txs/mempool`)
      ]);
      
      console.log('Checking transaction status for address:', address);
      const confirmedTxs = await confirmedResponse.json() as TxRef[];
      const mempoolTxs = await mempoolResponse.json() as TxRef[];
      

      if (confirmedTxs && confirmedTxs.length > 0) {
        const confirmedTx = confirmedTxs.find((tx: TxRef) => tx.status.confirmed === true);
        if (confirmedTx) {
          console.log('Found confirmed transaction');
          this.eventEmitter.emit('payment_status', address, 'confirmed', true);
          return 'confirmed';
        }
      }
      
      if (mempoolTxs && mempoolTxs.length > 0) {
        console.log('Found pending transaction in mempool');
        this.eventEmitter.emit('payment_status', address, 'processing', false);
        return 'processing';
      }

      console.log('No transactions found');
      this.eventEmitter.emit('payment_status', address, 'pending', false);
      return 'pending';
    } catch (error) {
      console.error('Error checking payment status:', error);
      throw new Error('Failed to retrieve payment status');
    }
  }

  async generatePaymentRequest(request: PaymentRequest): Promise<{
    address: string;
    btcAmount: number;
    usdAmount: number;
  }> {
    try {
      const address = await this.generatePaymentAddress();
      const btcAmount = await priceService.convertUSDToCrypto(request.usdAmount, 'BTC');

      return {
        address,
        btcAmount,
        usdAmount: request.usdAmount,
      };
    } catch (error) {
      console.error('Error generating payment request:', error);
      throw new Error('Failed to generate payment request');
    }
  }

  onNewAddress(callback: (address: string) => void) {
    this.eventEmitter.on('new-address', callback);
  }
}

export const bitcoinService = new BitcoinService(); 