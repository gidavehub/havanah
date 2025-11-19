/**
 * Tier Payment Checkout API
 * POST /api/tier-payment/checkout
 * Initialize payment for agent tier subscription
 */

import { NextRequest, NextResponse } from 'next/server';
import { modemPayService } from '@/lib/services/modem-pay';
import { completeTierPayment } from '@/lib/services/agent-payments';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const TIER_AMOUNTS = {
  1: 200,
  2: 500,
  3: 1000,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agentId, tier, agentEmail, agentPhone, agentName } = body;

    // Validate required fields
    if (!agentId || !tier || ![1, 2, 3].includes(tier)) {
      return NextResponse.json({ error: 'Invalid tier or agentId' }, { status: 400 });
    }

    if (!agentEmail || !agentPhone) {
      return NextResponse.json(
        { error: 'Agent email and phone are required' },
        { status: 400 }
      );
    }

    const amount = TIER_AMOUNTS[tier as keyof typeof TIER_AMOUNTS];

    // Generate unique reference for this tier payment
    const reference = modemPayService.generateReference(`TIER${tier}_${agentId}`);

    // Initialize payment with ModemPay
    const paymentResult = await modemPayService.initializePayment({
      amount,
      currency: 'GMD',
      reference,
      customerName: agentName || agentEmail,
      customerEmail: agentEmail,
      customerPhone: agentPhone,
      description: `Tier ${tier} Payment - ${amount} GMD - Havanah Agent Subscription`,
      metadata: {
        agentId,
        tier,
        type: 'tier_payment',
      },
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/tier-payment/verify`,
    });

    if (!paymentResult.success) {
      return NextResponse.json(
        { error: paymentResult.error || 'Failed to initialize payment' },
        { status: 500 }
      );
    }

    // Store payment attempt in Firestore
    await addDoc(collection(db, 'tier_payment_attempts'), {
      agentId,
      tier,
      amount,
      reference,
      status: 'initiated',
      authorizationUrl: paymentResult.data?.authorizationUrl,
      createdAt: Timestamp.now(),
    });

    return NextResponse.json({
      success: true,
      authorizationUrl: paymentResult.data?.authorizationUrl,
      accessCode: paymentResult.data?.accessCode,
      reference,
      amount,
      tier,
    });
  } catch (error) {
    console.error('Tier payment error:', error);
    return NextResponse.json(
      { error: 'Failed to process tier payment' },
      { status: 500 }
    );
  }
}
