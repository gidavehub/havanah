import { NextRequest, NextResponse } from 'next/server';
import { verifyModemPayPayment } from '@/lib/modem-pay';

/**
 * Verify payment status endpoint
 * GET /api/modem-pay/verify?reference=HVN-xxx-xxx
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json(
        { error: 'Reference is required' },
        { status: 400 }
      );
    }

    // Verify payment with Modem Pay
    const result = await verifyModemPayPayment(reference);

    return NextResponse.json(result, {
      status: result.status === 'error' ? 400 : 200,
    });
  } catch (error) {
    console.error('[Payment Verification Error]', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
