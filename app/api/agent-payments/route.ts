/**
 * Agent Payment Tier API
 * Handles agent payment tier checks and payment initiation
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getAgentPaymentTier,
  recordAgentTransaction,
  canAgentPostServices,
  getAgentPaymentSummary,
  createTierPaymentRecord,
} from '@/lib/services/agent-payments';

/**
 * GET /api/agent-payments/tier
 * Get agent payment tier information
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId');
    const action = searchParams.get('action');

    if (!agentId) {
      return NextResponse.json({ error: 'agentId is required' }, { status: 400 });
    }

    if (action === 'summary') {
      const summary = await getAgentPaymentSummary(agentId);
      return NextResponse.json(summary);
    }

    if (action === 'canPost') {
      const result = await canAgentPostServices(agentId);
      return NextResponse.json(result);
    }

    const tierInfo = await getAgentPaymentTier(agentId);
    return NextResponse.json(tierInfo);
  } catch (error) {
    console.error('Agent payment tier error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment tier information' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/agent-payments/record-transaction
 * Record a transaction for agent
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agentId, amount, description, action } = body;

    if (!agentId) {
      return NextResponse.json({ error: 'agentId is required' }, { status: 400 });
    }

    if (action === 'recordTransaction') {
      if (!amount) {
        return NextResponse.json({ error: 'amount is required' }, { status: 400 });
      }

      const result = await recordAgentTransaction(agentId, amount, description);
      return NextResponse.json(result);
    }

    if (action === 'createPaymentRecord') {
      const { tier } = body;
      if (!tier || ![1, 2, 3].includes(tier)) {
        return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
      }

      const paymentRecord = await createTierPaymentRecord(agentId, tier);
      return NextResponse.json(paymentRecord);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Agent payment recording error:', error);
    return NextResponse.json(
      { error: 'Failed to record agent payment' },
      { status: 500 }
    );
  }
}
