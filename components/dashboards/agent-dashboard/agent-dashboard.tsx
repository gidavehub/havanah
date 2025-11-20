'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/toast/toast';
import styles from './agent-dashboard.module.css';

interface AgentStats {
  totalRevenue: number;
  activeListings: number;
  totalViews: number;
  pendingPayments: number;
}

interface Listing {
  id: string;
  title: string;
  category: string;
  price: number;
  views: number;
  inquiries: number;
  status: 'active' | 'sold' | 'rented';
}

interface Transaction {
  id: string;
  buyer: string;
  property: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'confirmed';
}

const mockStats: AgentStats = {
  totalRevenue: 52340,
  activeListings: 18,
  totalViews: 2150,
  pendingPayments: 3400,
};

const mockListings: Listing[] = [
  {
    id: '1',
    title: 'Luxury Penthouse Downtown',
    category: 'House - Rent',
    price: 5000,
    views: 245,
    inquiries: 12,
    status: 'active',
  },
  {
    id: '2',
    title: 'BMW M5 Sports Car',
    category: 'Car - Rent',
    price: 150,
    views: 890,
    inquiries: 45,
    status: 'active',
  },
];

const mockTransactions: Transaction[] = [
  {
    id: '1',
    buyer: 'John Smith',
    property: 'BMW M5 Rental',
    amount: 1050,
    date: '2024-11-18',
    status: 'completed',
  },
  {
    id: '2',
    buyer: 'Sarah Johnson',
    property: 'Penthouse Rent',
    amount: 5000,
    date: '2024-11-17',
    status: 'pending',
  },
];

export default function AgentDashboard() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'transactions'>('overview');

  const handleNewListing = () => {
    toast.success('Feature Coming Soon', 'New listing feature will be available shortly!');
  };

  const handleEditListing = (listingTitle: string) => {
    toast.info('Edit Mode', `Editing: ${listingTitle}`);
  };

  const handleDeleteListing = (listingTitle: string) => {
    toast.warning('Delete Listing', `Are you sure you want to delete: ${listingTitle}?`);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Agent Dashboard</h1>
          <p className={styles.subtitle}>Welcome back! Here's your business performance.</p>
        </div>
        <button className={styles.btnNew} onClick={handleNewListing}>+ New Listing</button>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabs}>
        {(['overview', 'listings', 'transactions'] as const).map((tab) => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'overview' ? '📊 Overview' : tab === 'listings' ? '🏠 Listings' : '💳 Transactions'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className={styles.content}>
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Stats Grid */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>💰</div>
                <div className={styles.statContent}>
                  <h3 className={styles.statLabel}>Total Revenue</h3>
                  <p className={styles.statValue}>${mockStats.totalRevenue.toLocaleString()}</p>
                  <span className={styles.statChange}>+12% from last month</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>📋</div>
                <div className={styles.statContent}>
                  <h3 className={styles.statLabel}>Active Listings</h3>
                  <p className={styles.statValue}>{mockStats.activeListings}</p>
                  <span className={styles.statChange}>2 added this week</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>👀</div>
                <div className={styles.statContent}>
                  <h3 className={styles.statLabel}>Total Views</h3>
                  <p className={styles.statValue}>{mockStats.totalViews}</p>
                  <span className={styles.statChange}>+8% engagement</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>⏳</div>
                <div className={styles.statContent}>
                  <h3 className={styles.statLabel}>Pending Payments</h3>
                  <p className={styles.statValue}>${mockStats.pendingPayments}</p>
                  <span className={styles.statChange}>3 transactions waiting</span>
                </div>
              </div>
            </div>

            {/* Chart Placeholder */}
            <motion.div
              className={styles.chartSection}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className={styles.chartTitle}>Monthly Revenue Trend</h3>
              <div className={styles.chart}>
                <div className={styles.chartBars}>
                  {[40, 65, 45, 75, 90, 55, 100].map((height, i) => (
                    <motion.div
                      key={i}
                      className={styles.chartBar}
                      style={{ height: `${height}%` }}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'listings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.listingsSection}>
              <h3 className={styles.sectionTitle}>Your Listings</h3>
              <div className={styles.listingsTable}>
                <div className={styles.tableHeader}>
                  <div className={styles.tableCell}>Property</div>
                  <div className={styles.tableCell}>Category</div>
                  <div className={styles.tableCell}>Price</div>
                  <div className={styles.tableCell}>Views</div>
                  <div className={styles.tableCell}>Inquiries</div>
                  <div className={styles.tableCell}>Status</div>
                  <div className={styles.tableCell}>Actions</div>
                </div>

                {mockListings.map((listing) => (
                  <motion.div
                    key={listing.id}
                    className={styles.tableRow}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ backgroundColor: 'rgba(16, 185, 129, 0.05)' }}
                  >
                    <div className={styles.tableCell}>{listing.title}</div>
                    <div className={styles.tableCell}>{listing.category}</div>
                    <div className={styles.tableCell}>${listing.price}</div>
                    <div className={styles.tableCell}>{listing.views}</div>
                    <div className={styles.tableCell}>{listing.inquiries}</div>
                    <div className={styles.tableCell}>
                      <span className={`${styles.badge} ${styles[listing.status]}`}>
                        {listing.status}
                      </span>
                    </div>
                    <div className={styles.tableCell}>
                      <div className={styles.actionButtons}>
                        <button className={styles.btnEdit} onClick={() => handleEditListing(listing.title)}>Edit</button>
                        <button className={styles.btnDelete} onClick={() => handleDeleteListing(listing.title)}>Delete</button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'transactions' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.transactionsSection}>
              <h3 className={styles.sectionTitle}>Recent Transactions</h3>
              <div className={styles.transactionsList}>
                {mockTransactions.map((transaction) => (
                  <motion.div
                    key={transaction.id}
                    className={styles.transactionCard}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -4 }}
                  >
                    <div className={styles.transactionContent}>
                      <div className={styles.transactionInfo}>
                        <h4 className={styles.transactionTitle}>{transaction.buyer}</h4>
                        <p className={styles.transactionProperty}>{transaction.property}</p>
                        <span className={styles.transactionDate}>{transaction.date}</span>
                      </div>
                      <div className={styles.transactionRight}>
                        <div className={styles.transactionAmount}>
                          ${transaction.amount.toLocaleString()}
                        </div>
                        <span
                          className={`${styles.transactionStatus} ${styles[transaction.status]}`}
                        >
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
