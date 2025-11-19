/**
 * Payment Verification API
 * POST /api/verify-payment
 * Verify payment with ModemPay
 */

import { NextRequest, NextResponse } from 'next/server';
import { modemPayService } from '@/lib/services/modem-pay';
import { paymentService, bookingService } from '@/lib/services/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reference } = body;

    if (!reference) {
      return NextResponse.json({ error: 'Reference is required' }, { status: 400 });
    }

    // Verify with ModemPay
    const verifyResult = await modemPayService.verifyPayment(reference);

    if (!verifyResult.success) {
      return NextResponse.json({ error: verifyResult.error }, { status: 400 });
    }

    // Find and update payment record
    const payment = await paymentService.getByTransactionId(verifyResult.data?.transactionId || '');

    if (!payment) {
      return NextResponse.json({ error: 'Payment record not found' }, { status: 404 });
    }

    // Update payment status
    await paymentService.updateStatus(payment.id, 'completed', verifyResult.data?.transactionId);

    // Update booking status to confirmed
    if (payment.bookingId) {
      await bookingService.update(payment.bookingId, {
        status: 'confirmed',
        payment: {
          status: 'completed',
          method: 'modem-pay',
          transactionId: verifyResult.data?.transactionId,
          amount: payment.amount,
          reference,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        paymentId: payment.id,
        bookingId: payment.bookingId,
        status: 'completed',
        amount: payment.amount,
        reference,
      },
    });
  } catch (error: any) {
    console.error('Verification error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
