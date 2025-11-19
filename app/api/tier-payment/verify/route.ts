/**
 * Tier Payment Verification API
 * GET /api/tier-payment/verify
 * Verify and process completed tier payments
 */

import { NextRequest, NextResponse } from 'next/server';
import { modemPayService } from '@/lib/services/modem-pay';
import { completeTierPayment } from '@/lib/services/agent-payments';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json({ error: 'Payment reference is required' }, { status: 400 });
    }

    // Verify payment with ModemPay
    const verificationResult = await modemPayService.verifyPayment(reference);

    if (!verificationResult.success) {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    // Find the payment attempt record
    const attemptQuery = query(
      collection(db, 'tier_payment_attempts'),
      where('reference', '==', reference)
    );
    const attemptSnapshot = await getDocs(attemptQuery);

    if (attemptSnapshot.empty) {
      return NextResponse.json(
        { error: 'Payment attempt not found' },
        { status: 404 }
      );
    }

    const attemptDoc = attemptSnapshot.docs[0];
    const attemptData = attemptDoc.data();
    const { agentId, tier } = attemptData;

    // Mark tier payment as completed
    await completeTierPayment(agentId, tier, reference);

    // Update the payment attempt record
    await updateDoc(attemptDoc.ref, {
      status: 'completed',
      verificationData: {
        transactionId: verificationResult.data?.transactionId,
        paidAt: verificationResult.data?.paidAt,
      },
    });

    // Redirect to agent dashboard with success message
    const redirectUrl = new URL('/agent-dashboard', request.url.origin);
    redirectUrl.searchParams.set('paymentSuccess', 'true');
    redirectUrl.searchParams.set('tier', String(tier));

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Tier payment verification error:', error);

    // Redirect to agent dashboard with error message
    const redirectUrl = new URL('/agent-dashboard', request.url.origin);
    redirectUrl.searchParams.set('paymentError', 'true');

    return NextResponse.redirect(redirectUrl);
  }
}
