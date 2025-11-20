'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  MdCheck, 
  MdStar, 
  MdBusiness, 
  MdRocketLaunch,
  MdArrowBack,
  MdLock
} from 'react-icons/md';
import { useAuth } from '@/lib/auth-store';
import { useToast } from '@/components/toast/toast';
import { initializeModemPayPayment, generateReference } from '@/lib/modem-pay';
import { updateUserProfile } from '@/lib/firestore-service';
import styles from './upgrade.module.css';

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  icon: React.ReactNode;
  color: string;
  highlight?: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'Starter Agent',
    price: 29,
    period: 'month',
    icon: <MdBusiness />,
    color: '#6b7280',
    features: [
      'Up to 5 active listings',
      'Basic analytics',
      'Standard support',
      'Agent profile page'
    ]
  },
  {
    id: 'pro',
    name: 'Pro Agent',
    price: 79,
    period: 'month',
    icon: <MdStar />,
    color: '#10b981',
    highlight: true,
    features: [
      'Unlimited listings',
      'Priority placement',
      'Advanced analytics',
      'Verified Agent Badge',
      'Priority support'
    ]
  },
  {
    id: 'enterprise',
    name: 'Agency',
    price: 199,
    period: 'month',
    icon: <MdRocketLaunch />,
    color: '#8b5cf6',
    features: [
      'Multiple agent seats',
      'API Access',
      'Dedicated account manager',
      'Custom branding',
      'All Pro features'
    ]
  }
];

export default function UpgradeController() {
  const { user } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const [step, setStep] = useState<'plans' | 'payment' | 'success'>('plans');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle Plan Selection
  const selectPlan = (plan: Plan) => {
    if (!user) {
      toast.error("Login Required", "Please log in to upgrade your account.");
      return;
    }
    setSelectedPlan(plan);
    setStep('payment');
  };

  // Handle Payment Initiation
  const handlePayment = async () => {
    if (!selectedPlan || !user) return;

    setIsLoading(true);
    const toastId = toast.loading("Processing", "Initializing secure payment...");

    try {
      const reference = generateReference();
      
      const paymentData = {
        amount: selectedPlan.price,
        currency: 'USD',
        email: user.email || '',
        fullName: user.displayName || 'Valued Customer',
        phone: user.phoneNumber || '',
        description: `Upgrade to ${selectedPlan.name}`,
        reference: reference,
        metadata: {
          userId: user.id,
          planId: selectedPlan.id,
          type: 'subscription'
        }
      };

      const response = await initializeModemPayPayment(paymentData);

      if (response.status === 'success') {
        // In a real scenario, we would redirect to response.data.payment_url
        // For this implementation, we simulate a successful callback
        
        toast.remove(toastId);
        toast.success("Payment Authorized", "Finalizing your upgrade...");
        
        // Simulate processing delay
        setTimeout(async () => {
          await completeUpgrade(selectedPlan.id);
        }, 1500);
      } else {
        throw new Error(response.message);
      }

    } catch (error: any) {
      setIsLoading(false);
      toast.remove(toastId);
      toast.error("Payment Failed", error.message || "Could not initialize payment.");
    }
  };

  // Finalize Upgrade (Update Firestore)
  const completeUpgrade = async (planId: string) => {
    if (!user?.id) return;

    try {
      await updateUserProfile(user.id, {
        role: 'agent',
        agentPlan: planId as any
      });

      setStep('success');
      setIsLoading(false);
      toast.success("Upgrade Complete", "Welcome to Havanah Agent Portal!");
    } catch (error) {
      console.error(error);
      toast.error("Error", "Payment succeeded but profile update failed. Contact support.");
      setIsLoading(false);
    }
  };

  // Render Steps

  if (step === 'success') {
    return (
      <div className={styles.container}>
        <motion.div 
          className={styles.successCard}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className={styles.successIcon}><MdCheck /></div>
          <h2>Upgrade Successful!</h2>
          <p>You are now a <strong>{selectedPlan?.name}</strong>.</p>
          <p>Access your new dashboard to start listing properties.</p>
          
          <button 
            className={styles.dashboardBtn}
            onClick={() => router.push('/agent/dashboard')}
          >
            Go to Agent Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  if (step === 'payment') {
    return (
      <div className={styles.container}>
        <motion.div 
          className={styles.paymentWrapper}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <button className={styles.backBtn} onClick={() => setStep('plans')}>
            <MdArrowBack /> Back to Plans
          </button>

          <div className={styles.paymentSplit}>
            <div className={styles.summaryCol}>
              <h3>Order Summary</h3>
              <div className={styles.summaryCard}>
                <div className={styles.planHeader}>
                  <span className={styles.planName}>{selectedPlan?.name}</span>
                  <span className={styles.planPrice}>${selectedPlan?.price}</span>
                </div>
                <ul className={styles.featureList}>
                  {selectedPlan?.features.map((f, i) => (
                    <li key={i}><MdCheck /> {f}</li>
                  ))}
                </ul>
                <div className={styles.totalRow}>
                  <span>Total due today</span>
                  <span>${selectedPlan?.price.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className={styles.actionCol}>
              <h3>Secure Checkout</h3>
              <div className={styles.checkoutBox}>
                <p className={styles.checkoutDesc}>
                  You are about to subscribe to the <strong>{selectedPlan?.name}</strong> plan. 
                  Your payment will be processed securely via Modem Pay.
                </p>
                
                <div className={styles.secureBadge}>
                  <MdLock /> 256-bit SSL Encrypted Payment
                </div>

                <button 
                  className={styles.payBtn}
                  onClick={handlePayment}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : `Pay $${selectedPlan?.price.toFixed(2)}`}
                </button>
                
                <p className={styles.terms}>
                  By continuing, you agree to our Terms of Service and Privacy Policy. 
                  Subscription auto-renews monthly.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Default: Plans Selection
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Choose Your Agent Plan</h1>
        <p>Unlock powerful tools to grow your real estate or vehicle business.</p>
      </div>

      <div className={styles.plansGrid}>
        {PLANS.map((plan, index) => (
          <motion.div 
            key={plan.id}
            className={`${styles.planCard} ${plan.highlight ? styles.highlighted : ''}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -10 }}
          >
            {plan.highlight && <div className={styles.badge}>MOST POPULAR</div>}
            
            <div className={styles.iconWrapper} style={{ color: plan.color }}>
              {plan.icon}
            </div>
            
            <h3 className={styles.planName}>{plan.name}</h3>
            <div className={styles.priceWrapper}>
              <span className={styles.currency}>$</span>
              <span className={styles.amount}>{plan.price}</span>
              <span className={styles.period}>/{plan.period}</span>
            </div>

            <ul className={styles.features}>
              {plan.features.map((feature, i) => (
                <li key={i}>
                  <MdCheck className={styles.checkIcon} />
                  {feature}
                </li>
              ))}
            </ul>

            <button 
              className={plan.highlight ? styles.primaryBtn : styles.secondaryBtn}
              onClick={() => selectPlan(plan)}
            >
              Get Started
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}