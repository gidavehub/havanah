/**
 * Payment Checkout API
 * POST /api/checkout
 * Initialize payment with ModemPay
 */

import { NextRequest, NextResponse } from 'next/server';
import { modemPayService } from '@/lib/services/modem-pay';
import { paymentService } from '@/lib/services/firestore';
import * as Types from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      bookingId,
      userId,
      agentId,
      amount,
      customerName,
      customerEmail,
      customerPhone,
      description,
    } = body;

    // Validate required fields
    if (!bookingId || !userId || !agentId || !amount || !customerEmail || !customerPhone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate unique reference
    const reference = modemPayService.generateReference(`BKG_${bookingId}`);

    // Initialize payment with ModemPay
    const paymentResult = await modemPayService.initializePayment({
      amount,
      currency: 'GMD',
      reference,
      customerName: customerName || customerEmail,
      customerEmail,
      customerPhone,
      description: description || `Booking #${bookingId}`,
      metadata: {
        bookingId,
        userId,
        agentId,
      },
    });

    if (!paymentResult.success) {
      return NextResponse.json({ error: paymentResult.error }, { status: 400 });
    }

    // Create payment record in Firestore
    const paymentId = await paymentService.create({
      bookingId,
      userId,
      agentId,
      amount,
      status: 'pending',
      method: 'modem-pay',
      reference,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      data: {
        paymentId,
        authorizationUrl: paymentResult.data?.authorizationUrl,
        accessCode: paymentResult.data?.accessCode,
        reference,
      },
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
