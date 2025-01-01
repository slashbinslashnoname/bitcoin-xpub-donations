export interface PaymentRequest {
  amount: number;
  orderId: string;
}

export interface PaymentResponse {
  success: boolean;
  data?: {
    address: string;
    amount: number;
    orderId: string;
  };
  error?: string;
}

export interface PaymentStatus {
  success: boolean;
  data?: {
    status: 'pending' | 'confirmed' | 'failed';
  };
  error?: string;
} 