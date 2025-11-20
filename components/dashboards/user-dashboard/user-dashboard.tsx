'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/toast/toast';
import styles from './user-dashboard.module.css';

interface UserActivity {
  id: string;
  title: string;
  type: 'purchase' | 'rental';
  amount: number;
  date: string;
  status: 'active' | 'completed' | 'cancelled';
  daysRemaining?: number;
}

interface SpendingSummary {
  thisMonth: number;
  lastMonth: number;
  total: number;
}

const mockActivities: UserActivity[] = [
  {
    id: '1',
    title: 'BMW M5 Rental',
    type: 'rental',
    amount: 1050,
    date: '2024-11-15',
    status: 'active',
    daysRemaining: 3,
  },
  {
    id: '2',
    title: 'Modern Apartment',
    type: 'rental',
    amount: 2500,
    date: '2024-11-01',
    status: 'active',
    daysRemaining: 18,
  },
  {
    id: '3',
    title: 'Luxury Yacht Purchase',
    type: 'purchase',
    amount: 150000,
    date: '2024-10-20',
    status: 'completed',
  },
];

const mockSpending: SpendingSummary = {
  thisMonth: 3550,
  lastMonth: 2100,
  total: 156650,
};

export default function UserDashboard() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'activities' | 'spending' | 'wishlist'>('activities');

  const handleExploreMore = () => {
    toast.info('Redirecting', 'Taking you to explore listings...');
  };

  const handleManageActivity = (activityTitle: string) => {
    toast.success('Activity Details', `Managing: ${activityTitle}`);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>My Dashboard</h1>
          <p className={styles.subtitle}>Manage your purchases and rentals</p>
        </div>
        <button className={styles.btnExplore} onClick={handleExploreMore}>Explore More</button>
      </div>

      {/* Quick Stats */}
      <div className={styles.quickStats}>
        <motion.div
          className={styles.quickStat}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className={styles.statIcon}>🛒</div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Total Spent</span>
            <span className={styles.statValue}>${mockSpending.total.toLocaleString()}</span>
          </div>
        </motion.div>

        <motion.div
          className={styles.quickStat}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className={styles.statIcon}>🔄</div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Active Rentals</span>
            <span className={styles.statValue}>2</span>
          </div>
        </motion.div>

        <motion.div
          className={styles.quickStat}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className={styles.statIcon}>⭐</div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Saved Items</span>
            <span className={styles.statValue}>8</span>
          </div>
        </motion.div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabs}>
        {(['activities', 'spending', 'wishlist'] as const).map((tab) => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'activities' ? '📋 My Rentals & Purchases' : tab === 'spending' ? '💳 Spending' : '❤️ Wishlist'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className={styles.content}>
        {activeTab === 'activities' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.activitiesList}>
              {mockActivities.map((activity) => (
                <motion.div
                  key={activity.id}
                  className={styles.activityCard}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 4, boxShadow: '0 10px 30px rgba(16, 185, 129, 0.1)' }}
                >
                  <div className={styles.activityType}>
                    {activity.type === 'rental' ? '🔄' : '🏷️'}
                  </div>

                  <div className={styles.activityContent}>
                    <h3 className={styles.activityTitle}>{activity.title}</h3>
                    <p className={styles.activityDate}>{activity.date}</p>
                    {activity.daysRemaining && (
                      <div className={styles.daysRemaining}>
                        ⏱️ {activity.daysRemaining} days remaining
                      </div>
                    )}
                  </div>

                  <div className={styles.activityRight}>
                    <span className={styles.activityAmount}>${activity.amount}</span>
                    <span
                      className={`${styles.activityStatus} ${styles[activity.status]}`}
                    >
                      {activity.status}
                    </span>
                  </div>

                  <button className={styles.activityBtn} onClick={() => handleManageActivity(activity.title)}>
                    {activity.status === 'active' ? 'Manage' : 'View Details'}
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'spending' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.spendingSection}>
              <div className={styles.spendingCards}>
                <motion.div
                  className={styles.spendingCard}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h4>This Month</h4>
                  <p className={styles.spendingAmount}>${mockSpending.thisMonth}</p>
                  <span className={styles.spendingChange}>+69% from last month</span>
                </motion.div>

                <motion.div
                  className={styles.spendingCard}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h4>Last Month</h4>
                  <p className={styles.spendingAmount}>${mockSpending.lastMonth}</p>
                  <span className={styles.spendingChange}>Previous period</span>
                </motion.div>

                <motion.div
                  className={styles.spendingCard}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h4>All Time Total</h4>
                  <p className={styles.spendingAmount}>${mockSpending.total.toLocaleString()}</p>
                  <span className={styles.spendingChange}>Lifetime value</span>
                </motion.div>
              </div>

              <motion.div
                className={styles.chartContainer}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h3>Spending Trend</h3>
                <div className={styles.chart}>
                  <div className={styles.chartBars}>
                    {[30, 45, 35, 60, 55, 70, 85].map((height, i) => (
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
            </div>
          </motion.div>
        )}

        {activeTab === 'wishlist' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.wishlistSection}>
              <p className={styles.emptyMessage}>No items in your wishlist yet.</p>
              <button className={styles.btnBrowse}>Browse Listings</button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
