/**
 * Agent Payment Tier System
 * Manages agent transaction counts and payment tier requirements
 * 
 * Tier System:
 * - Tier 1: 200 GMD - After 3 transactions/services
 * - Tier 2: 500 GMD - After 3 more transactions (6 total)
 * - Tier 3: 1000 GMD - After 3 more transactions (9 total)
 */

import { db } from '@/lib/firebase';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  collection,
  where,
  getDocs,
  increment,
  Timestamp,
} from 'firebase/firestore';

export interface AgentPaymentTier {
  agentId: string;
  transactionCount: number;
  totalEarnings: number;
  currentTier: 1 | 2 | 3 | 'unlimited';
  tierPaymentsPaid: {
    tier1?: boolean;
    tier2?: boolean;
    tier3?: boolean;
  };
  lastTransactionDate?: Date;
  nextTierDue?: Date;
  status: 'active' | 'suspended' | 'pending_payment';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface TierPaymentRecord {
  id: string;
  agentId: string;
  tier: 1 | 2 | 3;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  transactionReference?: string;
  dueDate: Timestamp;
  paidDate?: Timestamp;
  createdAt: Timestamp;
}

const TIER_THRESHOLDS = {
  tier1: { transactions: 3, amount: 200, dueTransaction: 3 },
  tier2: { transactions: 6, amount: 500, dueTransaction: 6 },
  tier3: { transactions: 9, amount: 1000, dueTransaction: 9 },
};

/**
 * Initialize agent payment tracking
 */
export async function initializeAgentPaymentTracking(agentId: string) {
  try {
    const paymentDocRef = doc(db, 'agent_payments', agentId);
    const existingDoc = await getDoc(paymentDocRef);

    if (!existingDoc.exists()) {
      await setDoc(paymentDocRef, {
        agentId,
        transactionCount: 0,
        totalEarnings: 0,
        currentTier: 1,
        tierPaymentsPaid: {
          tier1: false,
          tier2: false,
          tier3: false,
        },
        status: 'active',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      } as AgentPaymentTier);
    }
  } catch (error) {
    console.error('Error initializing agent payment tracking:', error);
    throw error;
  }
}

/**
 * Get agent payment tier info
 */
export async function getAgentPaymentTier(agentId: string): Promise<AgentPaymentTier | null> {
  try {
    const paymentDocRef = doc(db, 'agent_payments', agentId);
    const docSnap = await getDoc(paymentDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        lastTransactionDate: data.lastTransactionDate?.toDate(),
        nextTierDue: data.nextTierDue?.toDate(),
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      } as AgentPaymentTier;
    }

    return null;
  } catch (error) {
    console.error('Error getting agent payment tier:', error);
    throw error;
  }
}

/**
 * Record a transaction for agent
 */
export async function recordAgentTransaction(
  agentId: string,
  amount: number,
  description: string = 'Service transaction'
) {
  try {
    const paymentDocRef = doc(db, 'agent_payments', agentId);
    const existingData = await getDoc(paymentDocRef);

    if (!existingData.exists()) {
      await initializeAgentPaymentTracking(agentId);
    }

    const updatedData = await getDoc(paymentDocRef);
    const currentData = updatedData.data() as AgentPaymentTier;

    const newTransactionCount = currentData.transactionCount + 1;
    const newTotalEarnings = currentData.totalEarnings + amount;

    // Determine current tier and if payment is due
    let currentTier = currentData.currentTier;
    let newStatus = currentData.status;
    let nextTierDue: Timestamp | null = null;

    if (newTransactionCount === TIER_THRESHOLDS.tier1.dueTransaction && !currentData.tierPaymentsPaid.tier1) {
      currentTier = 1;
      newStatus = 'pending_payment';
      nextTierDue = Timestamp.fromDate(new Date());
    } else if (newTransactionCount === TIER_THRESHOLDS.tier2.dueTransaction && !currentData.tierPaymentsPaid.tier2) {
      currentTier = 2;
      newStatus = 'pending_payment';
      nextTierDue = Timestamp.fromDate(new Date());
    } else if (newTransactionCount === TIER_THRESHOLDS.tier3.dueTransaction && !currentData.tierPaymentsPaid.tier3) {
      currentTier = 3;
      newStatus = 'pending_payment';
      nextTierDue = Timestamp.fromDate(new Date());
    } else if (newTransactionCount > TIER_THRESHOLDS.tier3.dueTransaction && currentData.tierPaymentsPaid.tier3) {
      currentTier = 'unlimited';
    }

    await updateDoc(paymentDocRef, {
      transactionCount: newTransactionCount,
      totalEarnings: newTotalEarnings,
      currentTier,
      status: newStatus,
      ...(nextTierDue && { nextTierDue }),
      lastTransactionDate: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return {
      transactionCount: newTransactionCount,
      totalEarnings: newTotalEarnings,
      currentTier,
      status: newStatus,
      paymentDueAmount: getPaymentDueAmount(newTransactionCount, currentData.tierPaymentsPaid),
    };
  } catch (error) {
    console.error('Error recording agent transaction:', error);
    throw error;
  }
}

/**
 * Get payment due amount based on transaction count
 */
function getPaymentDueAmount(transactionCount: number, tierPaymentsPaid: any): number {
  if (transactionCount >= 3 && !tierPaymentsPaid.tier1) return TIER_THRESHOLDS.tier1.amount;
  if (transactionCount >= 6 && !tierPaymentsPaid.tier2) return TIER_THRESHOLDS.tier2.amount;
  if (transactionCount >= 9 && !tierPaymentsPaid.tier3) return TIER_THRESHOLDS.tier3.amount;
  return 0;
}

/**
 * Create tier payment record
 */
export async function createTierPaymentRecord(
  agentId: string,
  tier: 1 | 2 | 3
): Promise<TierPaymentRecord> {
  try {
    const tierAmount = {
      1: TIER_THRESHOLDS.tier1.amount,
      2: TIER_THRESHOLDS.tier2.amount,
      3: TIER_THRESHOLDS.tier3.amount,
    }[tier];

    const paymentRef = doc(collection(db, 'tier_payments'));
    const newPaymentRecord: TierPaymentRecord = {
      id: paymentRef.id,
      agentId,
      tier,
      amount: tierAmount,
      currency: 'GMD',
      status: 'pending',
      dueDate: Timestamp.now(),
      createdAt: Timestamp.now(),
    };

    await setDoc(paymentRef, newPaymentRecord);

    return newPaymentRecord;
  } catch (error) {
    console.error('Error creating tier payment record:', error);
    throw error;
  }
}

/**
 * Mark tier payment as completed
 */
export async function completeTierPayment(
  agentId: string,
  tier: 1 | 2 | 3,
  transactionReference: string
) {
  try {
    const paymentDocRef = doc(db, 'agent_payments', agentId);
    const tierPaymentsRef = query(
      collection(db, 'tier_payments'),
      where('agentId', '==', agentId),
      where('tier', '==', tier),
      where('status', '==', 'pending')
    );

    const snapshot = await getDocs(tierPaymentsRef);

    if (!snapshot.empty) {
      const paymentDoc = snapshot.docs[0];
      await updateDoc(paymentDoc.ref, {
        status: 'completed',
        transactionReference,
        paidDate: Timestamp.now(),
      });
    }

    // Update agent payment status
    const agentData = await getDoc(paymentDocRef);
    const currentData = agentData.data() as AgentPaymentTier;

    const tierPaymentKey = `tier${tier}` as keyof typeof currentData.tierPaymentsPaid;
    const updatedTierPayments = {
      ...currentData.tierPaymentsPaid,
      [tierPaymentKey]: true,
    };

    let newStatus = 'active';
    if (
      !updatedTierPayments.tier1 ||
      !updatedTierPayments.tier2 ||
      !updatedTierPayments.tier3
    ) {
      // Still has unpaid tiers
      if (
        (currentData.transactionCount >= 3 && !updatedTierPayments.tier1) ||
        (currentData.transactionCount >= 6 && !updatedTierPayments.tier2) ||
        (currentData.transactionCount >= 9 && !updatedTierPayments.tier3)
      ) {
        newStatus = 'pending_payment';
      }
    } else {
      newStatus = 'active';
    }

    await updateDoc(paymentDocRef, {
      tierPaymentsPaid: updatedTierPayments,
      status: newStatus,
      updatedAt: Timestamp.now(),
    });

    return { success: true, message: `Tier ${tier} payment completed` };
  } catch (error) {
    console.error('Error completing tier payment:', error);
    throw error;
  }
}

/**
 * Check if agent can post services (payment status)
 */
export async function canAgentPostServices(agentId: string): Promise<{
  canPost: boolean;
  reason?: string;
  paymentDue?: number;
  tier?: number;
}> {
  try {
    const paymentTier = await getAgentPaymentTier(agentId);

    if (!paymentTier) {
      // New agent, can post
      return { canPost: true };
    }

    if (paymentTier.status === 'suspended') {
      return {
        canPost: false,
        reason: 'Your account has been suspended. Please contact support.',
      };
    }

    if (paymentTier.status === 'pending_payment') {
      const dueAmount = getPaymentDueAmount(paymentTier.transactionCount, paymentTier.tierPaymentsPaid);
      return {
        canPost: false,
        reason: `Payment of ${dueAmount} GMD is required to continue posting services.`,
        paymentDue: dueAmount,
        tier: Number(paymentTier.currentTier) as 1 | 2 | 3,
      };
    }

    return { canPost: true };
  } catch (error) {
    console.error('Error checking if agent can post services:', error);
    return { canPost: false, reason: 'Error checking account status' };
  }
}

/**
 * Get agent payment history
 */
export async function getAgentPaymentHistory(agentId: string): Promise<TierPaymentRecord[]> {
  try {
    const paymentRecordsRef = query(
      collection(db, 'tier_payments'),
      where('agentId', '==', agentId)
    );

    const snapshot = await getDocs(paymentRecordsRef);
    return snapshot.docs.map(doc => doc.data() as TierPaymentRecord);
  } catch (error) {
    console.error('Error getting agent payment history:', error);
    throw error;
  }
}

/**
 * Get payment summary for agent dashboard
 */
export async function getAgentPaymentSummary(agentId: string): Promise<{
  totalTransactions: number;
  totalEarnings: number;
  currentTier: 1 | 2 | 3 | 'unlimited';
  paymentStatus: 'active' | 'pending_payment' | 'suspended';
  paymentDue: number;
  nextMilestone: string;
}> {
  try {
    const paymentTier = await getAgentPaymentTier(agentId);

    if (!paymentTier) {
      return {
        totalTransactions: 0,
        totalEarnings: 0,
        currentTier: 1,
        paymentStatus: 'active',
        paymentDue: 0,
        nextMilestone: '3 transactions until first tier payment',
      };
    }

    const paymentDue = getPaymentDueAmount(paymentTier.transactionCount, paymentTier.tierPaymentsPaid);
    let nextMilestone = '';

    if (paymentTier.transactionCount < 3) {
      nextMilestone = `${3 - paymentTier.transactionCount} transactions until Tier 1 payment (200 GMD)`;
    } else if (paymentTier.transactionCount < 6) {
      nextMilestone = `${6 - paymentTier.transactionCount} transactions until Tier 2 payment (500 GMD)`;
    } else if (paymentTier.transactionCount < 9) {
      nextMilestone = `${9 - paymentTier.transactionCount} transactions until Tier 3 payment (1000 GMD)`;
    } else {
      nextMilestone = 'Unlimited - All tier payments completed';
    }

    return {
      totalTransactions: paymentTier.transactionCount,
      totalEarnings: paymentTier.totalEarnings,
      currentTier: paymentTier.currentTier,
      paymentStatus: paymentTier.status,
      paymentDue,
      nextMilestone,
    };
  } catch (error) {
    console.error('Error getting agent payment summary:', error);
    throw error;
  }
}
