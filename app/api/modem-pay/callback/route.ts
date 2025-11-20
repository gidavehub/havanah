import { NextRequest, NextResponse } from 'next/server';

/**
 * Modem Pay Callback Handler
 * Receives payment status updates from Modem Pay
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { reference, transaction_id, status, amount, email, metadata } = body;

    // Verify webhook signature (important for security)
    const signature = request.headers.get('x-modem-pay-signature');
    if (!verifySignature(body, signature)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Log payment callback for debugging
    console.log('[Modem Pay Callback]', {
      reference,
      transaction_id,
      status,
      amount,
      email,
      timestamp: new Date().toISOString(),
    });

    // Handle different payment statuses
    if (status === 'success') {
      // Update order/transaction in your database
      await handleSuccessfulPayment({
        reference,
        transaction_id,
        amount,
        email,
        metadata,
      });
    } else if (status === 'failed') {
      // Handle payment failure
      await handleFailedPayment({
        reference,
        transaction_id,
        email,
      });
    } else if (status === 'pending') {
      // Handle pending payment
      await handlePendingPayment({
        reference,
        transaction_id,
        email,
      });
    }

    // Acknowledge receipt of callback
    return NextResponse.json(
      {
        success: true,
        message: 'Callback received',
        reference,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Modem Pay Callback Error]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Verify webhook signature from Modem Pay
 */
function verifySignature(payload: any, signature?: string): boolean {
  // In production, implement proper signature verification
  // using HMAC-SHA256 with your webhook secret
  if (!signature) return false;

  // This is a placeholder - implement actual verification in production
  const secret = process.env.MODEM_PAY_WEBHOOK_SECRET || '';
  const crypto = require('crypto');
  
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');

  return signature === expectedSignature;
}

/**
 * Handle successful payment
 */
async function handleSuccessfulPayment(paymentData: any) {
  try {
    // TODO: Update your database with successful payment
    // Example: await updateOrderStatus(paymentData.reference, 'completed');
    
    console.log('[Payment Successful]', {
      reference: paymentData.reference,
      amount: paymentData.amount,
      email: paymentData.email,
    });

    // TODO: Send confirmation email
    // Example: await sendPaymentConfirmationEmail(paymentData.email, paymentData);
  } catch (error) {
    console.error('[Handle Success Payment Error]', error);
  }
}

/**
 * Handle failed payment
 */
async function handleFailedPayment(paymentData: any) {
  try {
    // TODO: Update your database with failed payment
    // Example: await updateOrderStatus(paymentData.reference, 'failed');

    console.log('[Payment Failed]', {
      reference: paymentData.reference,
      email: paymentData.email,
    });

    // TODO: Send failure notification email
    // Example: await sendPaymentFailureEmail(paymentData.email, paymentData);
  } catch (error) {
    console.error('[Handle Failed Payment Error]', error);
  }
}

/**
 * Handle pending payment
 */
async function handlePendingPayment(paymentData: any) {
  try {
    // TODO: Update your database with pending payment
    // Example: await updateOrderStatus(paymentData.reference, 'pending');

    console.log('[Payment Pending]', {
      reference: paymentData.reference,
      email: paymentData.email,
    });
  } catch (error) {
    console.error('[Handle Pending Payment Error]', error);
  }
}
