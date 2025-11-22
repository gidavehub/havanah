'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  MdSearch,
  MdNotifications,
  MdTrendingUp,
  MdMoreHoriz,
  MdCheck,
  MdClose,
  MdAdd,
  MdHomeWork,
  MdDirectionsCar
} from 'react-icons/md';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc,
} from 'firebase/firestore';
import { getFirestoreInstance } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-store';
import { useToast } from '@/components/toast/toast';
import styles from './agent-dashboard.module.css';

// Types
interface Listing {
  id: string;
  title: string;
  location: string;
  images: string[];
  type: 'house' | 'car';
  status: 'active' | 'pending' | 'sold';
  price: number;
  views: number;
  createdAt: any;
}

interface Inquiry {
  id: string;
  userName: string;
  userPhoto?: string;
  listingTitle: string;
  listingId: string;
  offerAmount?: number;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: any;
}

interface DashboardStats {
  activeListings: number;
  pendingOffers: number;
  totalEarnings: number;
  viewsTotal: number;
}

export default function AgentDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const toast = useToast();
  
  const [stats, setStats] = useState<DashboardStats>({
    activeListings: 0,
    pendingOffers: 0,
    totalEarnings: 0,
    viewsTotal: 0
  });
  const [listings, setListings] = useState<Listing[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      // Wait for auth to settle
      if (!user?.id) {
        if (!authLoading) setIsLoading(false);
        return;
      }
      
      try {
        const db = getFirestoreInstance();
        
        // 1. Fetch Listings
        // Note: Removed orderBy('createdAt') to prevent "Missing Index" errors.
        // Sorting is handled client-side below.
        const listingsRef = collection(db, 'listings');
        const qListings = query(listingsRef, where('agentId', '==', user.id));
        const listingsSnap = await getDocs(qListings);
        
        const fetchedListings: Listing[] = [];
        let activeCount = 0;
        let totalViews = 0;
        let earnings = 0;

        listingsSnap.forEach(doc => {
          const data = doc.data();
          fetchedListings.push({
            id: doc.id,
            title: data.title,
            location: data.location || data.address || 'No location',
            images: data.images || [],
            type: data.type,
            status: data.status,
            price: data.price,
            views: data.views || 0,
            createdAt: data.createdAt
          });

          if (data.status === 'active') activeCount++;
          totalViews += (data.views || 0);
          // Mock earnings calculation (e.g., 5% commission on sold items)
          if (data.status === 'sold') earnings += (data.price * 0.05); 
        });

        // Sort client-side (Newest first)
        fetchedListings.sort((a, b) => 
          (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
        );

        setListings(fetchedListings);

        // 2. Fetch Inquiries/Offers
        const inquiriesRef = collection(db, 'inquiries');
        const qInquiries = query(inquiriesRef, where('agentId', '==', user.id));
        const inquiriesSnap = await getDocs(qInquiries);
        
        const fetchedInquiries: Inquiry[] = [];
        inquiriesSnap.forEach(doc => {
          const data = doc.data();
          // Only show pending in the recent list
          if (data.status === 'pending') {
            fetchedInquiries.push({
              id: doc.id,
              userName: data.userName,
              userPhoto: data.userPhoto,
              listingTitle: data.listingTitle,
              listingId: data.listingId,
              offerAmount: data.offerAmount,
              message: data.message,
              status: data.status,
              createdAt: data.createdAt
            });
          }
        });

        // Sort client-side
        fetchedInquiries.sort((a, b) => 
          (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
        );

        setInquiries(fetchedInquiries);

        setStats({
          activeListings: activeCount,
          pendingOffers: fetchedInquiries.length,
          totalEarnings: earnings,
          viewsTotal: totalViews
        });

        setIsLoading(false);
      } catch (error: any) {
        console.error("Dashboard Error:", error);
        // Only show error toast if it's not a permission issue (avoids toast spam on redirect)
        if (error.code !== 'permission-denied') {
          toast.error("Data Error", "Failed to load dashboard data. Check console.");
        }
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      fetchData();
    }
  }, [user, authLoading, toast]);

  // Actions
  const handleAcceptOffer = async (inquiryId: string) => {
    try {
      const db = getFirestoreInstance();
      await updateDoc(doc(db, 'inquiries', inquiryId), { status: 'accepted' });
      setInquiries(prev => prev.filter(i => i.id !== inquiryId));
      toast.success('Offer Accepted', `You accepted the offer`);
    } catch (error) {
      toast.error('Action Failed', 'Could not accept offer');
    }
  };

  const handleRejectOffer = async (inquiryId: string) => {
    try {
      const db = getFirestoreInstance();
      await updateDoc(doc(db, 'inquiries', inquiryId), { status: 'rejected' });
      setInquiries(prev => prev.filter(i => i.id !== inquiryId));
      toast.info('Offer Rejected', 'You rejected the offer');
    } catch (error) {
      toast.error('Action Failed', 'Could not reject offer');
    }
  };

  const filteredListings = activeFilter === 'All' 
    ? listings 
    : activeFilter === 'Houses'
      ? listings.filter(l => l.type === 'house')
      : listings.filter(l => l.type === 'car');

  if (authLoading || isLoading) return <div className={styles.loadingScreen}>Loading Dashboard...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.title}>
            Welcome back, <span className={styles.highlight}>{user?.displayName || 'Agent'}</span>!
          </h1>
          <p className={styles.subtitle}>Here's an overview of your business.</p>
        </div>
        <div className={styles.headerActions}>
          <button 
            className={styles.addBtn}
            onClick={() => router.push('/listings/add')}
          >
            <MdAdd /> Add Listing
          </button>
        </div>
      </header>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Active Listings</p>
          <div className={styles.statValueRow}>
            <span className={styles.statValue}>{stats.activeListings}</span>
            <MdHomeWork className={styles.statIcon} />
          </div>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Pending Inquiries</p>
          <div className={styles.statValueRow}>
            <span className={styles.statValue}>{stats.pendingOffers}</span>
            <MdNotifications className={styles.statIcon} />
          </div>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Total Views</p>
          <div className={styles.statValueRow}>
            <span className={styles.statValue}>{stats.viewsTotal}</span>
            <MdTrendingUp className={styles.statIcon} />
          </div>
        </div>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.listingsSection}>
          <div className={styles.sectionHeader}>
            <h2>My Listings</h2>
            <div className={styles.filters}>
              {['All', 'Houses', 'Cars'].map((filter) => (
                <button 
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`${styles.filterBtn} ${activeFilter === filter ? styles.activeFilter : ''}`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Listing</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredListings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className={styles.emptyCell}>
                      No listings found.
                    </td>
                  </tr>
                ) : (
                  filteredListings.map((listing) => (
                    <tr key={listing.id}>
                      <td>
                        <div className={styles.listingCell}>
                          <img 
                            src={listing.images[0] || 'https://via.placeholder.com/50'} 
                            alt={listing.title} 
                            className={styles.listingImage} 
                          />
                          <div>
                            <p className={styles.listingTitle}>{listing.title}</p>
                            <p className={styles.listingSub}>{listing.location}</p>
                          </div>
                        </div>
                      </td>
                      <td><span className={styles.typeBadge}>{listing.type}</span></td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles[listing.status]}`}>
                          {listing.status}
                        </span>
                      </td>
                      <td className={styles.priceText}>${listing.price.toLocaleString()}</td>
                      <td>
                        <button className={styles.actionBtn}><MdMoreHoriz /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.sideSection}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Recent Inquiries</h3>
            {inquiries.length === 0 ? (
              <p className={styles.emptyText}>No pending inquiries.</p>
            ) : (
              <div className={styles.offersList}>
                {inquiries.map((offer) => (
                  <div key={offer.id} className={styles.offerItem}>
                    <div className={styles.offerHeader}>
                      <div className={styles.offerUser}>
                         <div className={styles.defaultAvatar}>{offer.userName?.[0] || 'U'}</div>
                        <div>
                          <p className={styles.userName}>{offer.userName}</p>
                          <p className={styles.offerDetail}>{offer.listingTitle}</p>
                        </div>
                      </div>
                    </div>
                    <p className={styles.offerMessage}>"{offer.message}"</p>
                    <div className={styles.offerActions}>
                      <button className={styles.acceptBtn} onClick={() => handleAcceptOffer(offer.id)}>
                        <MdCheck /> Accept
                      </button>
                      <button className={styles.rejectBtn} onClick={() => handleRejectOffer(offer.id)}>
                        <MdClose /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}