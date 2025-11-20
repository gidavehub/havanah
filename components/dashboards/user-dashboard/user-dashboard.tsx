'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  MdApartment, 
  MdDirectionsCar, 
  MdSell, 
  MdArrowForward, 
  MdAccessTime,
  MdNotifications
} from 'react-icons/md';
import { useAuth } from '@/lib/auth-store';
import styles from './user-dashboard.module.css';

// Mock Data (In a real app, fetch this via the services hooks)
const activeServices = [
  {
    id: '1',
    title: 'Audi A4 Rental',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=1000&auto=format&fit=crop',
    type: 'Rental',
    startDate: 'June 1, 2024',
    endDate: 'July 1, 2024',
    timeLeft: '15 days',
    progress: 50,
    status: 'active'
  },
  {
    id: '2',
    title: 'Downtown Loft',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1000&auto=format&fit=crop',
    type: 'Lease',
    startDate: 'Jan 15, 2024',
    endDate: 'Jan 15, 2025',
    timeLeft: '6 months',
    progress: 45,
    status: 'active'
  },
  {
    id: '3',
    title: 'Porsche 911 Carrera',
    image: 'https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=1000&auto=format&fit=crop',
    type: 'Owned',
    purchaseDate: 'March 22, 2024',
    status: 'completed'
  }
];

const spendingData = [40, 65, 35, 85, 55, 90]; // Mock percentages for chart

export default function UserDashboard() {
  const { user } = useAuth();

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <header className={styles.header}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.welcomeText}
        >
          <h1 className={styles.title}>
            Welcome back, <span className={styles.userName}>{user?.displayName?.split(' ')[0] || 'Olivia'}</span>!
          </h1>
          <p className={styles.subtitle}>
            You have {activeServices.filter(s => s.status === 'active').length} active rentals and 1 purchased vehicle.
          </p>
        </motion.div>
        
        <div className={styles.headerActions}>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={styles.notificationBtn}
          >
            <MdNotifications className={styles.bellIcon} />
            <span className={styles.badge}>2</span>
          </motion.button>
        </div>
      </header>

      {/* Main Grid */}
      <div className={styles.dashboardGrid}>
        
        {/* Left Column: Services */}
        <div className={styles.mainContent}>
          <div className={styles.sectionHeader}>
            <h2>My Services</h2>
          </div>

          <div className={styles.cardsList}>
            {activeServices.map((service, index) => (
              <motion.div 
                key={service.id}
                className={styles.serviceCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: '0 12px 30px rgba(16, 185, 129, 0.1)' }}
              >
                {/* Card Background Glow Effect */}
                <div className={styles.cardGlow} />

                <div className={styles.cardImageContainer}>
                  <img src={service.image} alt={service.title} className={styles.cardImage} />
                  <div className={styles.cardBadge}>{service.type}</div>
                </div>
                
                <div className={styles.cardContent}>
                  <div className={styles.cardInfo}>
                    <h3>{service.title}</h3>
                    
                    {service.status === 'active' ? (
                      <>
                        <div className={styles.dateRange}>
                          <span>Start: {service.startDate}</span>
                          <span>End: {service.endDate}</span>
                        </div>
                        
                        <div className={styles.progressContainer}>
                          <div className={styles.progressHeader}>
                            <span className={styles.progressLabel}>
                              <MdAccessTime /> Time Remaining
                            </span>
                            <span className={styles.progressValue}>{service.timeLeft}</span>
                          </div>
                          <div className={styles.progressBarBg}>
                            <motion.div 
                              className={styles.progressBarFill} 
                              initial={{ width: 0 }}
                              animate={{ width: `${service.progress}%` }}
                              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className={styles.purchaseDate}>Purchased on {service.purchaseDate}</p>
                    )}
                  </div>

                  <div className={styles.cardActions}>
                    {service.status === 'active' ? (
                      <>
                        <button className={styles.btnSecondary}>Extend</button>
                        <button className={styles.btnPrimary}>Manage</button>
                      </>
                    ) : (
                      <button className={styles.btnPrimary}>View Documents</button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column: Sidebar Widgets */}
        <aside className={styles.sideWidgets}>
          
          {/* Quick Actions */}
          <motion.div 
            className={styles.widget}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3>Quick Actions</h3>
            <div className={styles.actionGrid}>
              <Link href="/explore?category=rent&type=house" passHref>
                <motion.div className={styles.actionCard} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <div className={styles.actionIcon}><MdApartment /></div>
                  <span>Book Apartment</span>
                </motion.div>
              </Link>
              <Link href="/explore?category=rent&type=car" passHref>
                <motion.div className={styles.actionCard} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <div className={styles.actionIcon}><MdDirectionsCar /></div>
                  <span>Rent a Car</span>
                </motion.div>
              </Link>
              <Link href="/explore?category=sale" passHref>
                <motion.div className={`${styles.actionCard} ${styles.fullWidth}`} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <div className={styles.actionIcon}><MdSell /></div>
                  <span>Browse For Sale</span>
                </motion.div>
              </Link>
            </div>
          </motion.div>

          {/* Spending Summary */}
          <motion.div 
            className={styles.widget}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3>Spending Summary</h3>
            <div className={styles.spendingCard}>
              <div className={styles.spendingRow}>
                <span className={styles.spendingLabel}>Total Spent</span>
                <span className={styles.spendingValue}>$12,450.75</span>
              </div>
              <div className={styles.spendingRow}>
                <span className={styles.spendingLabel}>Last Month</span>
                <span className={styles.spendingValue}>$2,100.00</span>
              </div>

              <div className={styles.chartContainer}>
                {spendingData.map((height, i) => (
                  <div key={i} className={styles.chartColumn}>
                    <div className={styles.chartBarTrack}>
                      <motion.div 
                        className={`${styles.chartBar} ${i === spendingData.length - 1 ? styles.activeBar : ''}`}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 0.6, delay: 0.4 + (i * 0.1) }}
                      />
                    </div>
                    <span className={styles.chartLabel}>{['J','F','M','A','M','J'][i]}</span>
                  </div>
                ))}
              </div>

              <button className={styles.btnOutline}>
                View Full History <MdArrowForward />
              </button>
            </div>
          </motion.div>

        </aside>
      </div>
    </div>
  );
}