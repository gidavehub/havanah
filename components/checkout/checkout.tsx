'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { initializeModemPayPayment, generateReference } from '@/lib/modem-pay';
import { useToast } from '@/components/toast/toast';
import styles from './checkout.module.css';

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  priceType: string;
}

interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  agreeToTerms: boolean;
}

const mockCartItems: CartItem[] = [
  {
    id: '1',
    title: 'BMW M5 Rental',
    price: 150,
    quantity: 7,
    priceType: '/day',
  },
];

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const toast = useToast();
  const [step, setStep] = useState<'summary' | 'payment' | 'confirmation'>('summary');
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    email: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    agreeToTerms: false,
  });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionReference, setTransactionReference] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');

  const total = mockCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const finalAmount = parseFloat((total * 1.15).toFixed(2));

  // Check if payment was successful from redirect
  useEffect(() => {
    const status = searchParams.get('status');
    const reference = searchParams.get('reference');

    if (status === 'success' && reference) {
      setTransactionReference(reference);
      setStep('confirmation');
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const target = e.target as HTMLInputElement;
    const checked = target.checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      toast.error('Validation Error', 'Full name is required');
      return false;
    }
    if (!formData.email.trim()) {
      toast.error('Validation Error', 'Email is required');
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error('Validation Error', 'Phone number is required');
      return false;
    }
    if (paymentMethod === 'card') {
      if (!formData.cardNumber.trim()) {
        toast.error('Validation Error', 'Card number is required');
        return false;
      }
      if (!formData.expiryDate.trim()) {
        toast.error('Validation Error', 'Expiry date is required');
        return false;
      }
      if (!formData.cvv.trim()) {
        toast.error('Validation Error', 'CVV is required');
        return false;
      }
    }
    if (!formData.agreeToTerms) {
      toast.warning('Terms Required', 'Please agree to the terms and conditions');
      return false;
    }
    return true;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Initialize payment with Modem Pay
      const reference = generateReference();
      setTransactionReference(reference);
      const loadingId = toast.loading('Processing Payment', 'Initializing Modem Pay...');

      const paymentData = {
        amount: finalAmount,
        currency: 'USD',
        email: formData.email,
        fullName: formData.fullName,
        phone: formData.phone,
        description: `Havanah Order - ${mockCartItems.map((item) => item.title).join(', ')}`,
        reference: reference,
        metadata: {
          items: mockCartItems,
          paymentMethod: paymentMethod,
          cardLast4: paymentMethod === 'card' ? formData.cardNumber.slice(-4) : undefined,
        },
      };

      const response = await initializeModemPayPayment(paymentData);

      if (response.status === 'success') {
        toast.remove(loadingId);
        toast.success('Payment Initiated', 'Redirecting to payment gateway...');
        // In production, redirect to Modem Pay payment page
        // window.location.href = response.data.checkout_url;

        // For demo, simulate successful payment
        setTimeout(() => {
          setProcessing(false);
          setStep('confirmation');
          toast.success('Payment Successful!', 'Your transaction has been completed.');
        }, 2000);
      } else {
        toast.remove(loadingId);
        toast.error('Payment Failed', response.message || 'Payment initialization failed');
        setProcessing(false);
      }
    } catch (err) {
      toast.error('Payment Error', err instanceof Error ? err.message : 'An error occurred during payment');
      setProcessing(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className={styles.title}>Secure Checkout</h1>
          <div className={styles.steps}>
            <div className={`${styles.step} ${step === 'summary' ? styles.active : ''}`}>
              <span className={styles.stepNumber}>1</span>
              <span>Summary</span>
            </div>
            <div className={styles.stepDivider}></div>
            <div className={`${styles.step} ${step === 'payment' ? styles.active : ''}`}>
              <span className={styles.stepNumber}>2</span>
              <span>Payment</span>
            </div>
            <div className={styles.stepDivider}></div>
            <div className={`${styles.step} ${step === 'confirmation' ? styles.active : ''}`}>
              <span className={styles.stepNumber}>3</span>
              <span>Confirmation</span>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className={styles.content}>
          {step === 'summary' && (
            <motion.div
              className={styles.section}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className={styles.sectionTitle}>Order Summary</h2>

              <div className={styles.orderItems}>
                {mockCartItems.map((item) => (
                  <div key={item.id} className={styles.orderItem}>
                    <div className={styles.itemInfo}>
                      <h3 className={styles.itemTitle}>{item.title}</h3>
                      <p className={styles.itemDetail}>
                        ${item.price}{item.priceType} x {item.quantity}
                      </p>
                    </div>
                    <div className={styles.itemPrice}>
                      ${item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.summary}>
                <div className={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>${total}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Tax</span>
                  <span>${(total * 0.1).toFixed(2)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Service Fee</span>
                  <span>${(total * 0.05).toFixed(2)}</span>
                </div>
                <div className={styles.summaryTotal}>
                  <span>Total</span>
                  <span>${(total * 1.15).toFixed(2)}</span>
                </div>
              </div>

              <div className={styles.terms}>
                <p>
                  ✓ Secure payment powered by Modem Pay<br />
                  ✓ 24/7 customer support<br />
                  ✓ Full refund guarantee if not satisfied
                </p>
              </div>

              <button
                className={styles.btnPrimary}
                onClick={() => setStep('payment')}
              >
                Proceed to Payment
              </button>
            </motion.div>
          )}

          {step === 'payment' && (
            <motion.div
              className={styles.section}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className={styles.sectionTitle}>Payment Information</h2>

              {error && (
                <motion.div
                  className={styles.errorAlert}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  ⚠️ {error}
                </motion.div>
              )}

              <form onSubmit={handlePayment} className={styles.form}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                  </div>
                </div>

                <div className={styles.paymentMethodSection}>
                  <h3 className={styles.cardTitle}>Payment Method</h3>
                  <div className={styles.methodOptions}>
                    <label className={styles.methodOption}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'card' | 'bank')}
                      />
                      <span>💳 Credit/Debit Card</span>
                    </label>
                    <label className={styles.methodOption}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank"
                        onChange={(e) => setPaymentMethod(e.target.value as 'card' | 'bank')}
                      />
                      <span>🏦 Bank Transfer</span>
                    </label>
                  </div>
                </div>

                {paymentMethod === 'card' && (
                  <div className={styles.cardSection}>
                    <h3 className={styles.cardTitle}>Card Information</h3>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className={styles.input}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required={paymentMethod === 'card'}
                      />
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Expiry Date</label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          className={styles.input}
                          placeholder="MM/YY"
                          maxLength={5}
                          required={paymentMethod === 'card'}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>CVV</label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          className={styles.input}
                          placeholder="123"
                          maxLength={3}
                          required={paymentMethod === 'card'}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'bank' && (
                  <div className={styles.bankSection}>
                    <h3 className={styles.cardTitle}>Bank Transfer Details</h3>
                    <div className={styles.bankInfo}>
                      <p><strong>Bank Name:</strong> First Digital Bank</p>
                      <p><strong>Account Number:</strong> 1234567890</p>
                      <p><strong>Account Name:</strong> Havanah Rentals</p>
                      <p><strong>Routing Number:</strong> 021000021</p>
                      <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                        Please use your reference number as payment description
                      </p>
                    </div>
                  </div>
                )}

                <div className={styles.termsCheckbox}>
                  <input
                    type="checkbox"
                    id="terms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className={styles.checkbox}
                  />
                  <label htmlFor="terms" className={styles.checkboxLabel}>
                    I agree to the terms and conditions and privacy policy
                  </label>
                </div>

                <div className={styles.buttonGroup}>
                  <button
                    type="button"
                    className={styles.btnSecondary}
                    onClick={() => setStep('summary')}
                    disabled={processing}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className={styles.btnPrimary}
                    disabled={processing}
                  >
                    {processing ? 'Processing...' : `Pay $${finalAmount.toFixed(2)}`}
                  </button>
                </div>
              </form>

              <div className={styles.securityBadge}>
                <span>🔒</span> Secured by Modem Pay
              </div>
            </motion.div>
          )}

          {step === 'confirmation' && (
            <motion.div
              className={styles.section}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className={styles.successIcon}>✓</div>
              <h2 className={styles.successTitle}>Payment Successful!</h2>
              <p className={styles.successMessage}>
                Your transaction has been completed successfully. A confirmation email has been sent.
              </p>

              <div className={styles.confirmationDetails}>
                <div className={styles.detailRow}>
                  <span>Confirmation Number</span>
                  <span className={styles.detailValue}>{transactionReference || 'HVN-2024-123456'}</span>
                </div>
                <div className={styles.detailRow}>
                  <span>Amount Paid</span>
                  <span className={styles.detailValue}>${finalAmount.toFixed(2)}</span>
                </div>
                <div className={styles.detailRow}>
                  <span>Payment Method</span>
                  <span className={styles.detailValue}>
                    {paymentMethod === 'card' ? `Card ending in ${formData.cardNumber.slice(-4)}` : 'Bank Transfer'}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span>Date</span>
                  <span className={styles.detailValue}>{new Date().toLocaleDateString()}</span>
                </div>
              </div>

              <div className={styles.nextSteps}>
                <h3>What's Next?</h3>
                <ul>
                  <li>✓ Check your email for order confirmation</li>
                  <li>✓ Track your rental in the dashboard</li>
                  <li>✓ Contact support if you have any questions</li>
                </ul>
              </div>

              <div className={styles.buttonGroup}>
                <button className={styles.btnPrimary}>
                  Go to Dashboard
                </button>
                <button className={styles.btnSecondary}>
                  Continue Shopping
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Sidebar - Order Summary (Sticky) */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarCard}>
          <h3 className={styles.sidebarTitle}>Order Summary</h3>

          <div className={styles.sidebarItems}>
            {mockCartItems.map((item) => (
              <div key={item.id} className={styles.sidebarItem}>
                <span>{item.title}</span>
                <span className={styles.sidebarPrice}>
                  ${item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className={styles.sidebarBreakdown}>
            <div className={styles.breakdownRow}>
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className={styles.breakdownRow}>
              <span>Tax (10%)</span>
              <span>${(total * 0.1).toFixed(2)}</span>
            </div>
            <div className={styles.breakdownRow}>
              <span>Service Fee (5%)</span>
              <span>${(total * 0.05).toFixed(2)}</span>
            </div>
          </div>

          <div className={styles.sidebarTotal}>
            <span>Total</span>
            <span className={styles.totalPrice}>${finalAmount.toFixed(2)}</span>
          </div>

          <div className={styles.sidebarFeatures}>
            <div className={styles.feature}>
              <span>🔒</span> Secure Payment
            </div>
            <div className={styles.feature}>
              <span>💳</span> Multiple Methods
            </div>
            <div className={styles.feature}>
              <span>✓</span> Money-Back Guarantee
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
