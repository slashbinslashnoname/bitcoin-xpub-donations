import { Router } from 'express';
import { z } from 'zod';
import { getBitcoinService } from '../services/factories/bitcoin';

const router = Router();
const bitcoinService = getBitcoinService();

const paymentRequestSchema = z.object({
  amount: z.number().positive(),
});

router.post('/new', async (req, res) => {
  try {
    const { amount } = paymentRequestSchema.parse(req.body);
    
    const paymentRequest = await bitcoinService.generatePaymentRequest({
      usdAmount: amount,
    });

    res.json({
      address: paymentRequest.address,
      btcAmount: paymentRequest.btcAmount,
      usdAmount: paymentRequest.usdAmount,
    });
  } catch (error) {
    console.error('Payment generation error:', error);
    res.status(400).json({ error: 'Failed to generate payment request' });
  }
});

router.get('/:address/status', async (req, res) => {
  try {
    const status = await bitcoinService.getPaymentStatus(req.params.address);
    
    res.json({
      success: true,
      data: { status },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Failed to get payment status',
    });
  }
});

export const bitcoinRouter = router; 