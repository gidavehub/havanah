'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MdShoppingCart, MdMail, MdAnalytics, MdPerson } from 'react-icons/md';
import styles from './services.module.css';

interface ServiceSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  mockupType: 'checkout' | 'messaging' | 'dashboard';
}

const services: ServiceSection[] = [
  {
    id: 'checkout',
    title: 'Secure Checkout',
    description: 'Complete your purchases with confidence using our secure payment system powered by Monnify.',
    icon: <MdShoppingCart />,
    features: ['End-to-end encryption', 'Multiple payment methods', 'Instant confirmations'],
    mockupType: 'checkout',
  },
  {
    id: 'messaging',
    title: 'Peer-to-Peer Messaging',
    description: 'Communicate directly with agents to negotiate terms and finalize deals seamlessly.',
    icon: <MdMail />,
    features: ['Real-time messaging', 'File sharing', 'Conversation history'],
    mockupType: 'messaging',
  },
  {
    id: 'agentdash',
    title: 'Agent Dashboard',
    description: 'Manage your listings, track payments, and grow your business with our powerful tools.',
    icon: <MdAnalytics />,
    features: ['Listings management', 'Analytics & insights', 'Payment tracking'],
    mockupType: 'dashboard',
  },
  {
    id: 'userdash',
    title: 'User Dashboard',
    description: 'Keep track of your purchases, rentals, and spending in one convenient place.',
    icon: <MdPerson />,
    features: ['Purchase history', 'Rental management', 'Spending insights'],
    mockupType: 'dashboard',
  },
];

const CheckoutMockup = () => (
  <div className={styles.mockup}>
    <div className={styles.macWindow}>
      <div className={styles.macHeader}>
        <div className={styles.macButtons}>
          <div className={styles.buttonRed}></div>
          <div className={styles.buttonYellow}></div>
          <div className={styles.buttonGreen}></div>
        </div>
        <span className={styles.macTitle}>Secure Checkout</span>
      </div>
      <div className={styles.macContent}>
        <div className={styles.checkoutForm}>
          <div className={styles.orderSummary}>
            <h4>Order Summary</h4>
            <div className={styles.orderItem}>
              <span>Premium Supercar</span>
              <span>$250/day</span>
            </div>
            <div className={styles.orderItem}>
              <span>Rental Days</span>
              <span>7</span>
            </div>
            <div className={styles.orderTotal}>
              <span>Total</span>
              <span>$1,750</span>
            </div>
          </div>
          <div className={styles.paymentForm}>
            <div className={styles.inputGroup}>
              <label>Card Number</label>
              <input type="text" placeholder="**** **** **** 1234" disabled />
            </div>
            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label>Expiry</label>
                <input type="text" placeholder="MM/YY" disabled />
              </div>
              <div className={styles.inputGroup}>
                <label>CVV</label>
                <input type="text" placeholder="***" disabled />
              </div>
            </div>
            <button className={styles.payBtn}>Pay $1,750</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const MessagingMockup = () => (
  <div className={styles.mockup}>
    <div className={styles.macWindow}>
      <div className={styles.macHeader}>
        <div className={styles.macButtons}>
          <div className={styles.buttonRed}></div>
          <div className={styles.buttonYellow}></div>
          <div className={styles.buttonGreen}></div>
        </div>
        <span className={styles.macTitle}>Direct Messages</span>
      </div>
      <div className={styles.macContent}>
        <div className={styles.chat}>
          <div className={styles.chatMessage} style={{ alignSelf: 'flex-end' }}>
            <div className={styles.messageBubbleMe}>
              <p>Is the car available on December 25th?</p>
              <span className={styles.timestamp}>2:30 PM</span>
            </div>
          </div>
          <div className={styles.chatMessage}>
            <div className={styles.messageBubble}>
              <p>Yes! It's available. Would you like to reserve it?</p>
              <span className={styles.timestamp}>2:35 PM</span>
            </div>
          </div>
          <div className={styles.chatMessage} style={{ alignSelf: 'flex-end' }}>
            <div className={styles.messageBubbleMe}>
              <p>Perfect! Let's finalize the booking.</p>
              <span className={styles.timestamp}>2:40 PM</span>
            </div>
          </div>
        </div>
        <div className={styles.chatInput}>
          <input type="text" placeholder="Type a message..." disabled />
        </div>
      </div>
    </div>
  </div>
);

const DashboardMockup = () => (
  <div className={styles.mockup}>
    <div className={styles.macWindow}>
      <div className={styles.macHeader}>
        <div className={styles.macButtons}>
          <div className={styles.buttonRed}></div>
          <div className={styles.buttonYellow}></div>
          <div className={styles.buttonGreen}></div>
        </div>
        <span className={styles.macTitle}>Dashboard Analytics</span>
      </div>
      <div className={styles.macContent}>
        <div className={styles.dashboard}>
          <div className={styles.stat}>
            <div className={styles.statValue}>$12,450</div>
            <div className={styles.statLabel}>Total Revenue</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>28</div>
            <div className={styles.statLabel}>Active Listings</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>456</div>
            <div className={styles.statLabel}>Total Views</div>
          </div>
          <div className={styles.chart}>
            <div className={styles.bar} style={{ height: '60%' }}></div>
            <div className={styles.bar} style={{ height: '75%' }}></div>
            <div className={styles.bar} style={{ height: '45%' }}></div>
            <div className={styles.bar} style={{ height: '90%' }}></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const getMockup = (type: string) => {
  switch (type) {
    case 'checkout':
      return <CheckoutMockup />;
    case 'messaging':
      return <MessagingMockup />;
    case 'dashboard':
      return <DashboardMockup />;
    default:
      return <CheckoutMockup />;
  }
};

export default function ServicesSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className={styles.title}>Our Services</h2>
          <p className={styles.subtitle}>
            Comprehensive solutions for all your rental and purchase needs
          </p>
        </motion.div>

        <div className={styles.servicesGrid}>
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              className={styles.serviceCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className={styles.cardHeader}>
                <span className={styles.icon}>{service.icon}</span>
                <h3>{service.title}</h3>
              </div>
              <p className={styles.description}>{service.description}</p>
              <div className={styles.features}>
                {service.features.map((feature, i) => (
                  <div key={i} className={styles.feature}>
                    <span className={styles.checkmark}>✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <div className={styles.mockupContainer}>
                {getMockup(service.mockupType)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
