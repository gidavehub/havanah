/**
 * ModemPay Payment Service
 * Handles all payment processing with ModemPay SDK
 */

import axios, { AxiosInstance } from 'axios';

interface ModemPayConfig {
  publicKey: string;
  secretKey: string;
  merchantId: string;
}

interface PaymentRequest {
  amount: number;
  currency: string;
  reference: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  description: string;
  metadata?: Record<string, any>;
  callbackUrl?: string;
}

interface PaymentResponse {
  success: boolean;
  data?: {
    authorizationUrl: string;
    accessCode: string;
    reference: string;
  };
  error?: string;
}

interface VerifyPaymentResponse {
  success: boolean;
  data?: {
    reference: string;
    amount: number;
    status: 'success' | 'failed' | 'pending';
    transactionId: string;
    paidAt?: Date;
  };
  error?: string;
}

class ModemPayService {
  private config: ModemPayConfig;
  private apiClient: AxiosInstance;
  private baseUrl = 'https://api.modeempay.com/api/v1';

  constructor() {
    this.config = {
      publicKey: process.env.NEXT_PUBLIC_MODEM_PAY_PUBLIC_KEY || '',
      secretKey: process.env.MODEM_PAY_SECRET_KEY || '',
      merchantId: process.env.NEXT_PUBLIC_MODEM_PAY_MERCHANT_ID || '',
    };

    this.apiClient = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.config.secretKey}`,
        'Content-Type': 'application/json',
        'X-Merchant-Id': this.config.merchantId,
      },
    });
  }

  /**
   * Initialize a payment transaction
   */
  async initializePayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await this.apiClient.post('/transaction/initialize', {
        amount: Math.round(request.amount * 100), // Convert to cents
        email: request.customerEmail,
        phone: request.customerPhone,
        name: request.customerName,
        reference: request.reference,
        description: request.description,
        currency: request.currency || 'GMD',
        callback_url: request.callbackUrl || `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/callback`,
        metadata: request.metadata,
      });

      return {
        success: true,
        data: {
          authorizationUrl: response.data.data.authorization_url,
          accessCode: response.data.data.access_code,
          reference: response.data.data.reference,
        },
      };
    } catch (error: any) {
      console.error('ModemPay initialization error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to initialize payment',
      };
    }
  }

  /**
   * Verify a payment transaction
   */
  async verifyPayment(reference: string): Promise<VerifyPaymentResponse> {
    try {
      const response = await this.apiClient.get(`/transaction/verify/${reference}`);

      const paymentData = response.data.data;
      return {
        success: paymentData.status === 'success',
        data: {
          reference: paymentData.reference,
          amount: paymentData.amount / 100, // Convert from cents
          status: paymentData.status,
          transactionId: paymentData.id,
          paidAt: paymentData.paid_at ? new Date(paymentData.paid_at) : undefined,
        },
      };
    } catch (error: any) {
      console.error('ModemPay verification error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to verify payment',
      };
    }
  }

  /**
   * Create a transfer (payout to agent)
   */
  async createTransfer(
    recipientCode: string,
    amount: number,
    reason: string,
    reference: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await this.apiClient.post('/transfer', {
        source: 'balance',
        reason,
        amount: Math.round(amount * 100), // Convert to cents
        recipient: recipientCode,
        reference,
      });

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      console.error('ModemPay transfer error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create transfer',
      };
    }
  }

  /**
   * Get account balance
   */
  async getBalance(): Promise<{ success: boolean; balance?: number; error?: string }> {
    try {
      const response = await this.apiClient.get('/balance');
      return {
        success: true,
        balance: response.data.data.balance / 100, // Convert from cents
      };
    } catch (error: any) {
      console.error('ModemPay balance error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get balance',
      };
    }
  }

  /**
   * Get transaction history
   */
  async getTransactionHistory(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    success: boolean;
    data?: {
      transactions: any[];
      total: number;
      page: number;
    };
    error?: string;
  }> {
    try {
      const response = await this.apiClient.get('/transactions', {
        params: { page, perPage: limit },
      });

      return {
        success: true,
        data: {
          transactions: response.data.data.data,
          total: response.data.data.total,
          page: response.data.data.current_page,
        },
      };
    } catch (error: any) {
      console.error('ModemPay transaction history error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get transaction history',
      };
    }
  }

  /**
   * Validate webhook signature
   */
  validateWebhookSignature(payload: any, signature: string): boolean {
    try {
      const crypto = require('crypto');
      const hash = crypto
        .createHmac('sha512', this.config.secretKey)
        .update(JSON.stringify(payload))
        .digest('hex');

      return hash === signature;
    } catch (error) {
      console.error('Webhook signature validation error:', error);
      return false;
    }
  }

  /**
   * Format payment amount
   */
  formatAmount(amount: number): string {
    return new Intl.NumberFormat('en-GM', {
      style: 'currency',
      currency: 'GMD',
    }).format(amount);
  }

  /**
   * Generate unique reference
   */
  generateReference(prefix: string = 'TXN'): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const modemPayService = new ModemPayService();
export default ModemPayService;
