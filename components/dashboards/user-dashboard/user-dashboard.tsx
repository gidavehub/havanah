'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  MdApartment, 
  MdDirectionsCar, 
  MdSell, 
  MdArrowForward, 
  MdAccessTime,
  MdNotifications,
  MdCheckCircle,
  MdCancel,
  MdHourglassEmpty
} from 'react-icons/md';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  getDoc,
  doc,
  Timestamp
} from 'firebase/firestore';
import { getFirestoreInstance } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-store';
import { useToast } from '@/components/toast/toast';
import styles from './user-dashboard.module.css';

// Types
interface ServiceItem {
  id: string;
  listingId: string;
  title: string;
  image: string;
  type: 'house' | 'car';
  category: 'rent' | 'sale';
  status: 'pending' | 'accepted' | 'rejected';
  amount?: number;
  startDate?: any;
  endDate?: any;
  createdAt: any;
}

interface SpendingData {
  total: number;
  monthly: number[];
}

export default function UserDashboard() {
  const { user, loading: authLoading } = useAuth();
  const toast = useToast();

  // State
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [spending, setSpending] = useState<SpendingData>({ total: 0, monthly: [0,0,0,0,0,0] });

  // Fetch User Data
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      try {
        const db = getFirestoreInstance();
        
        // Fetch Inquiries/Applications made by user
        const inquiriesRef = collection(db, 'inquiries');
        const q = query(
          inquiriesRef, 
          where('userId', '==', user.id),
          orderBy('createdAt', 'desc')
        );
        
        const snapshot = await getDocs(q);
        const items: ServiceItem[] = [];
        let totalSpent = 0;

        // We need to fetch listing details for images/titles if not stored in inquiry
        // Optimisation: In production, store small snapshot of listing in inquiry to avoid N+1 reads
        // Here we assume title is in inquiry, but image might need fetch or default
        
        for (const docSnap of snapshot.docs) {
          const data = docSnap.data();
          
          // Helper to get image (in real app, fetch listing doc if needed)
          // For now, we'll use a placeholder if not present, or assume we passed it
          let imageUrl = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop';
          
          // Try to fetch listing image if we have listingId
          if (data.listingId) {
            try {
              const listingSnap = await getDoc(doc(db, 'listings', data.listingId));
              if (listingSnap.exists()) {
                const lData = listingSnap.data();
                if (lData.images && lData.images.length > 0) {
                  imageUrl = lData.images[0];
                }
              }
            } catch (e) {
              // Ignore fetch error
            }
          }

          items.push({
            id: docSnap.id,
            listingId: data.listingId,
            title: data.listingTitle || 'Unknown Listing',
            image: imageUrl,
            type: data.listingType || 'house', // Ensure these fields exist in inquiry creation
            category: data.listingCategory || 'rent',
            status: data.status,
            amount: data.offerAmount || 0,
            createdAt: data.createdAt
          });

          if (data.status === 'accepted' && data.offerAmount) {
            totalSpent += data.offerAmount;
          }
        }

        setServices(items);
        setSpending({
          total: totalSpent,
          monthly: [10, 25, 15, 30, 40, 60] // Mock chart data distribution for visual
        });
        setIsLoading(false);

      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Load Error", "Failed to load your dashboard");
        setIsLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchData();
    }
  }, [user, authLoading, toast]);

  // Categorize services
  const activeServices = services.filter(s => s.status === 'accepted');
  const pendingApplications = services.filter(s => s.status === 'pending');

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    // Handle Firestore Timestamp
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  if (authLoading || isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

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
            Welcome back, <span className={styles.userName}>{user?.displayName?.split(' ')[0] || 'User'}</span>!
          </h1>
          <p className={styles.subtitle}>
            You have {activeServices.length} active services and {pendingApplications.length} pending applications.
          </p>
        </motion.div>
        
        <div className={styles.headerActions}>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={styles.notificationBtn}
          >
            <MdNotifications className={styles.bellIcon} />
            {pendingApplications.length > 0 && (
              <span className={styles.badge}>{pendingApplications.length}</span>
            )}
          </motion.button>
        </div>
      </header>

      {/* Main Grid */}
      <div className={styles.dashboardGrid}>
        
        {/* Left Column: Services & Applications */}
        <div className={styles.mainContent}>
          
          {/* Active Services Section */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2>Active Services</h2>
            </div>

            {activeServices.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No active rentals or purchases yet.</p>
                <Link href="/explore" className={styles.btnPrimarySmall}>Explore Listings</Link>
              </div>
            ) : (
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
                    <div className={styles.cardGlow} />
                    <div className={styles.cardImageContainer}>
                      <img src={service.image} alt={service.title} className={styles.cardImage} />
                      <div className={styles.cardBadge}>{service.category}</div>
                    </div>
                    
                    <div className={styles.cardContent}>
                      <div className={styles.cardInfo}>
                        <h3>{service.title}</h3>
                        <div className={styles.statusRow}>
                          <span className={`${styles.statusPill} ${styles.accepted}`}>
                            <MdCheckCircle /> Active
                          </span>
                          <span className={styles.dateText}>Started: {formatDate(service.createdAt)}</span>
                        </div>
                        {service.amount && (
                          <p className={styles.amountText}>${service.amount.toLocaleString()}</p>
                        )}
                      </div>

                      <div className={styles.cardActions}>
                        <button className={styles.btnPrimary}>Manage</button>
                        <button className={styles.btnSecondary}>Documents</button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Applications Section */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2>Applications History</h2>
            </div>
            
            <div className={styles.applicationsList}>
              {services.filter(s => s.status !== 'accepted').length === 0 && (
                <p className={styles.emptyText}>No pending or past applications.</p>
              )}
              
              {services.filter(s => s.status !== 'accepted').map((app) => (
                <div key={app.id} className={styles.applicationItem}>
                  <div className={styles.appIcon}>
                    {app.status === 'pending' ? <MdHourglassEmpty className={styles.pendingIcon} /> : 
                     app.status === 'rejected' ? <MdCancel className={styles.rejectedIcon} /> : null}
                  </div>
                  <div className={styles.appInfo}>
                    <h4>{app.title}</h4>
                    <span>Applied on {formatDate(app.createdAt)}</span>
                  </div>
                  <div className={styles.appStatus}>
                    <span className={`${styles.statusBadge} ${styles[app.status]}`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
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
              <Link href="/explore?category=rent&type=house" passHref legacyBehavior>
                <motion.a className={styles.actionCard} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <div className={styles.actionIcon}><MdApartment /></div>
                  <span>Rent Home</span>
                </motion.a>
              </Link>
              <Link href="/explore?category=rent&type=car" passHref legacyBehavior>
                <motion.a className={styles.actionCard} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <div className={styles.actionIcon}><MdDirectionsCar /></div>
                  <span>Rent Car</span>
                </motion.a>
              </Link>
              <Link href="/explore?category=sale" passHref legacyBehavior>
                <motion.a className={`${styles.actionCard} ${styles.fullWidth}`} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <div className={styles.actionIcon}><MdSell /></div>
                  <span>Browse For Sale</span>
                </motion.a>
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
            <h3>Total Spending</h3>
            <div className={styles.spendingCard}>
              <div className={styles.spendingRow}>
                <span className={styles.spendingLabel}>Lifetime Spent</span>
                <span className={styles.spendingValue}>${spending.total.toLocaleString()}</span>
              </div>

              <div className={styles.chartContainer}>
                {spending.monthly.map((height, i) => (
                  <div key={i} className={styles.chartColumn}>
                    <div className={styles.chartBarTrack}>
                      <motion.div 
                        className={styles.chartBar}
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
                View Wallet <MdArrowForward />
              </button>
            </div>
          </motion.div>

        </aside>
      </div>
    </div>
  );
}