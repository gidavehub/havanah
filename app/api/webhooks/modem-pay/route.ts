/**
 * ModemPay Webhook Handler
 * POST /api/webhooks/modem-pay
 * Handles payment notifications from ModemPay
 */

import { NextRequest, NextResponse } from 'next/server';
import { modemPayService } from '@/lib/services/modem-pay';
import { paymentService, bookingService } from '@/lib/services/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate webhook signature (if ModemPay provides one)
    const signature = request.headers.get('x-modem-pay-signature');
    if (signature && !modemPayService.validateWebhookSignature(body, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const { event, data } = body;

    switch (event) {
      case 'charge.success':
        await handlePaymentSuccess(data);
        break;
      case 'charge.failed':
        await handlePaymentFailed(data);
        break;
      case 'charge.dispute':
        await handlePaymentDispute(data);
        break;
      default:
        console.log('Unknown event:', event);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

/**
 * Handle successful payment
 */
async function handlePaymentSuccess(data: any) {
  try {
    const { reference, amount, id } = data;

    // Find payment record
    const payment = await paymentService.getByTransactionId(id);

    if (!payment) {
      console.warn('Payment record not found for transaction:', id);
      return;
    }

    // Update payment status
    await paymentService.updateStatus(payment.id, 'completed', id);

    // Update booking status
    if (payment.bookingId) {
      await bookingService.update(payment.bookingId, {
        status: 'confirmed',
        payment: {
          status: 'completed',
          method: 'modem-pay',
          transactionId: id,
          amount: amount / 100,
          reference,
        },
      });
    }

    console.log('Payment successful:', reference);
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(data: any) {
  try {
    const { reference, id, reason } = data;

    // Find payment record
    const payment = await paymentService.getByTransactionId(id);

    if (!payment) {
      console.warn('Payment record not found for transaction:', id);
      return;
    }

    // Update payment status
    await paymentService.updateStatus(payment.id, 'failed', id);

    // Update booking status
    if (payment.bookingId) {
      await bookingService.update(payment.bookingId, {
        status: 'pending',
      });
    }

    console.log('Payment failed:', reference, reason);
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

/**
 * Handle payment dispute
 */
async function handlePaymentDispute(data: any) {
  try {
    const { reference, id, reason } = data;

    // Find payment record
    const payment = await paymentService.getByTransactionId(id);

    if (!payment) {
      console.warn('Payment record not found for transaction:', id);
      return;
    }

    // Update booking status
    if (payment.bookingId) {
      await bookingService.update(payment.bookingId, {
        status: 'dispute',
      });
    }

    console.log('Payment dispute:', reference, reason);
  } catch (error) {
    console.error('Error handling payment dispute:', error);
  }
}
