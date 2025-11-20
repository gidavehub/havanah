'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  MdApartment, 
  MdDirectionsCar, 
  MdSell, 
  MdArrowForward, 
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
  getDoc,
  doc
} from 'firebase/firestore';
import { getFirestoreInstance } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-store';
import { useToast } from '@/components/toast/toast';
import styles from './user-dashboard.module.css';

interface ServiceItem {
  id: string;
  listingId: string;
  title: string;
  image: string;
  type: 'house' | 'car';
  category: 'rent' | 'sale';
  status: 'pending' | 'accepted' | 'rejected';
  amount?: number;
  createdAt: any;
}

export default function UserDashboard() {
  const { user, loading: authLoading } = useAuth();
  const toast = useToast();

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) {
        if (!authLoading) setIsLoading(false);
        return;
      }

      try {
        const db = getFirestoreInstance();
        
        // Simplified Query: Get all inquiries by this user
        // Removing orderBy initially to avoid index errors
        const inquiriesRef = collection(db, 'inquiries');
        const q = query(inquiriesRef, where('userId', '==', user.id));
        
        const snapshot = await getDocs(q);
        const items: ServiceItem[] = [];
        let spent = 0;

        // Parallel fetching of listing images
        const promises = snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          let imageUrl = 'https://via.placeholder.com/300'; // Fallback

          if (data.listingId) {
            try {
              const listingSnap = await getDoc(doc(db, 'listings', data.listingId));
              if (listingSnap.exists()) {
                const lData = listingSnap.data();
                if (lData.images?.[0]) imageUrl = lData.images[0];
              }
            } catch (e) { /* ignore */ }
          }

          if (data.status === 'accepted' && data.offerAmount) {
            spent += Number(data.offerAmount);
          }

          return {
            id: docSnap.id,
            listingId: data.listingId,
            title: data.listingTitle || 'Listing',
            image: imageUrl,
            type: data.listingType || 'house',
            category: data.listingCategory || 'rent',
            status: data.status,
            amount: data.offerAmount || 0,
            createdAt: data.createdAt
          } as ServiceItem;
        });

        const resolvedItems = await Promise.all(promises);
        
        // Sort client-side
        resolvedItems.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

        setServices(resolvedItems);
        setTotalSpent(spent);
        setIsLoading(false);

      } catch (error) {
        console.error("User Dashboard Error:", error);
        setIsLoading(false);
      }
    };

    if (!authLoading) fetchData();
  }, [user, authLoading]);

  const activeServices = services.filter(s => s.status === 'accepted');
  
  if (authLoading || isLoading) return <div className={styles.loadingContainer}>Loading...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.welcomeText}>
          <h1 className={styles.title}>
            Hello, <span className={styles.userName}>{user?.displayName || 'User'}</span>
          </h1>
          <p className={styles.subtitle}>
            You have {activeServices.length} active services.
          </p>
        </div>
      </header>

      <div className={styles.dashboardGrid}>
        <div className={styles.mainContent}>
          {/* Active Services */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}><h2>Active Services</h2></div>
            {activeServices.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No active services.</p>
                <Link href="/explore" className={styles.btnPrimarySmall}>Browse Listings</Link>
              </div>
            ) : (
              <div className={styles.cardsList}>
                {activeServices.map((service) => (
                  <motion.div key={service.id} className={styles.serviceCard} whileHover={{ y: -5 }}>
                    <img src={service.image} alt={service.title} className={styles.cardImage} />
                    <div className={styles.cardContent}>
                      <h3>{service.title}</h3>
                      <span className={`${styles.statusPill} ${styles.accepted}`}>Active</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* History */}
          <div className={styles.sectionBlock}>
             <div className={styles.sectionHeader}><h2>Application History</h2></div>
             <div className={styles.applicationsList}>
                {services.map((app) => (
                  <div key={app.id} className={styles.applicationItem}>
                    <div className={styles.appIcon}>
                      {app.status === 'pending' ? <MdHourglassEmpty /> : 
                       app.status === 'accepted' ? <MdCheckCircle style={{color:'#10b981'}}/> : 
                       <MdCancel style={{color:'#ef4444'}}/>}
                    </div>
                    <div className={styles.appInfo}>
                      <h4>{app.title}</h4>
                      <span>{new Date(app.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString()}</span>
                    </div>
                    <span className={`${styles.statusBadge} ${styles[app.status]}`}>
                      {app.status}
                    </span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <aside className={styles.sideWidgets}>
          <div className={styles.widget}>
            <h3>Quick Actions</h3>
            <div className={styles.actionGrid}>
              <Link href="/explore?category=rent&type=house" className={styles.actionCard}>
                <MdApartment className={styles.actionIcon} /> <span>Rent Home</span>
              </Link>
              <Link href="/explore?category=sale" className={styles.actionCard}>
                <MdSell className={styles.actionIcon} /> <span>Buy</span>
              </Link>
            </div>
          </div>
          
          <div className={styles.widget}>
             <h3>Spending</h3>
             <div className={styles.spendingCard}>
               <span className={styles.spendingLabel}>Total Spent</span>
               <span className={styles.spendingValue}>${totalSpent.toLocaleString()}</span>
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
}