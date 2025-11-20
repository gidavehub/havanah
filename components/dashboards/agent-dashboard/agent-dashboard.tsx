'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  MdSearch,
  MdNotifications,
  MdTrendingUp,
  MdTrendingDown,
  MdMoreHoriz,
  MdCheck,
  MdClose,
  MdAdd,
  MdAttachMoney,
  MdHomeWork,
  MdDirectionsCar
} from 'react-icons/md';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit, 
  doc, 
  updateDoc,
  Timestamp
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
  createdAt: Timestamp;
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
  
  // State
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

  // Fetch Dashboard Data
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      
      try {
        const db = getFirestoreInstance();
        
        // 1. Fetch Listings
        const listingsRef = collection(db, 'listings');
        const qListings = query(
          listingsRef, 
          where('agentId', '==', user.id),
          orderBy('createdAt', 'desc')
        );
        const listingsSnap = await getDocs(qListings);
        
        const fetchedListings: Listing[] = [];
        let activeCount = 0;
        let totalViews = 0;
        let earnings = 0; // In a real app, calculate from 'sold' listings

        listingsSnap.forEach(doc => {
          const data = doc.data();
          fetchedListings.push({
            id: doc.id,
            title: data.title,
            location: data.location || data.address || 'No location',
            images: data.images || [],
            type: data.type, // 'house' or 'car'
            status: data.status,
            price: data.price,
            views: data.views || 0
          });

          if (data.status === 'active') activeCount++;
          totalViews += (data.views || 0);
          if (data.status === 'sold') earnings += (data.commission || 0); // Assuming commission field exists
        });

        setListings(fetchedListings);

        // 2. Fetch Inquiries/Offers
        const inquiriesRef = collection(db, 'inquiries');
        const qInquiries = query(
          inquiriesRef,
          where('agentId', '==', user.id),
          where('status', '==', 'pending'),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const inquiriesSnap = await getDocs(qInquiries);
        
        const fetchedInquiries: Inquiry[] = [];
        inquiriesSnap.forEach(doc => {
          const data = doc.data();
          fetchedInquiries.push({
            id: doc.id,
            userName: data.userName,
            userPhoto: data.userPhoto,
            listingTitle: data.listingTitle,
            listingId: data.listingId,
            offerAmount: data.offerAmount, // If it's an offer
            message: data.message,
            status: data.status,
            createdAt: data.createdAt
          });
        });

        setInquiries(fetchedInquiries);

        // 3. Update Stats
        setStats({
          activeListings: activeCount,
          pendingOffers: inquiriesSnap.size,
          totalEarnings: earnings, // Placeholder logic
          viewsTotal: totalViews
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Data Error", "Failed to load dashboard data");
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      if (!user || user.role !== 'agent') {
        // Redirect if not authorized
        // router.push('/auth/login');
      } else {
        fetchData();
      }
    }
  }, [user, authLoading, toast, router]);

  // Actions
  const handleAcceptOffer = async (inquiryId: string, listingTitle: string) => {
    try {
      const db = getFirestoreInstance();
      await updateDoc(doc(db, 'inquiries', inquiryId), {
        status: 'accepted'
      });
      
      // Remove from local state
      setInquiries(prev => prev.filter(i => i.id !== inquiryId));
      toast.success('Offer Accepted', `You accepted the offer for ${listingTitle}`);
      
      // Here you might also trigger a notification to the user
    } catch (error) {
      toast.error('Action Failed', 'Could not accept offer');
    }
  };

  const handleRejectOffer = async (inquiryId: string) => {
    try {
      const db = getFirestoreInstance();
      await updateDoc(doc(db, 'inquiries', inquiryId), {
        status: 'rejected'
      });
      
      setInquiries(prev => prev.filter(i => i.id !== inquiryId));
      toast.info('Offer Rejected', 'You rejected the offer');
    } catch (error) {
      toast.error('Action Failed', 'Could not reject offer');
    }
  };

  // Filtering
  const filteredListings = activeFilter === 'All' 
    ? listings 
    : activeFilter === 'Houses'
      ? listings.filter(l => l.type === 'house')
      : listings.filter(l => l.type === 'car');

  if (authLoading || isLoading) {
    return <div className={styles.loadingScreen}>Loading Dashboard...</div>;
  }

  return (
    <div className={styles.container}>
      
      {/* Header */}
      <header className={styles.header}>
        <motion.div 
          className={styles.welcomeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className={styles.title}>
            Welcome back, <span className={styles.highlight}>{user?.displayName || 'Agent'}</span>!
          </h1>
          <p className={styles.subtitle}>Here's what's happening with your listings today.</p>
        </motion.div>

        <div className={styles.headerActions}>
          <div className={styles.searchBar}>
            <MdSearch className={styles.searchIcon} />
            <input type="text" placeholder="Search listings..." />
          </div>
          <button className={styles.iconBtn}>
            <MdNotifications />
            {stats.pendingOffers > 0 && <div className={styles.badge} />}
          </button>
          <button 
            className={styles.addBtn}
            onClick={() => router.push('/agent/listings/add')}
          >
            <MdAdd /> Add Listing
          </button>
        </div>
      </header>

      {/* Stats Row */}
      <div className={styles.statsGrid}>
        <motion.div 
          className={styles.statCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className={styles.statLabel}>Active Listings</p>
          <div className={styles.statValueRow}>
            <span className={styles.statValue}>{stats.activeListings}</span>
            <span className={`${styles.statChange} ${styles.positive}`}>
              <MdHomeWork />
            </span>
          </div>
        </motion.div>

        <motion.div 
          className={styles.statCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className={styles.statLabel}>Pending Inquiries</p>
          <div className={styles.statValueRow}>
            <span className={styles.statValue}>{stats.pendingOffers}</span>
            <span className={`${styles.statChange} ${styles.warning}`}>
              <MdTrendingUp />
            </span>
          </div>
        </motion.div>

        <motion.div 
          className={styles.statCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className={styles.statLabel}>Total Views</p>
          <div className={styles.statValueRow}>
            <span className={styles.statValue}>{stats.viewsTotal}</span>
            <span className={`${styles.statChange} ${styles.info}`}>
              <MdTrendingUp />
            </span>
          </div>
        </motion.div>
      </div>

      <div className={styles.mainGrid}>
        {/* Left Column: Listings */}
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
                    <td colSpan={5} style={{textAlign: 'center', padding: '2rem'}}>
                      No listings found. Start by adding one!
                    </td>
                  </tr>
                ) : (
                  filteredListings.map((listing, i) => (
                    <motion.tr 
                      key={listing.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + (i * 0.05) }}
                    >
                      <td>
                        <div className={styles.listingCell}>
                          <img 
                            src={listing.images[0] || '/placeholder-image.jpg'} 
                            alt={listing.title} 
                            className={styles.listingImage} 
                          />
                          <div>
                            <p className={styles.listingTitle}>{listing.title}</p>
                            <p className={styles.listingSub}>{listing.location}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={styles.typeBadge}>
                          {listing.type === 'house' ? <MdHomeWork/> : <MdDirectionsCar/>} {listing.type}
                        </span>
                      </td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles[listing.status]}`}>
                          {listing.status}
                        </span>
                      </td>
                      <td className={styles.priceText}>${listing.price.toLocaleString()}</td>
                      <td>
                        <button className={styles.actionBtn} title="Options"><MdMoreHoriz /></button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Offers & Finance */}
        <div className={styles.sideSection}>
          
          {/* Recent Offers/Inquiries */}
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
                        {offer.userPhoto ? (
                          <img src={offer.userPhoto} alt={offer.userName} />
                        ) : (
                          <div className={styles.defaultAvatar}>{offer.userName[0]}</div>
                        )}
                        <div>
                          <p className={styles.userName}>{offer.userName}</p>
                          <p className={styles.offerDetail}>
                            Interested in {offer.listingTitle}
                          </p>
                        </div>
                      </div>
                      {offer.offerAmount && (
                        <span className={styles.offerAmount}>${offer.offerAmount.toLocaleString()}</span>
                      )}
                    </div>
                    <p className={styles.offerMessage}>"{offer.message}"</p>
                    <div className={styles.offerActions}>
                      <button 
                        className={styles.acceptBtn}
                        onClick={() => handleAcceptOffer(offer.id, offer.listingTitle)}
                      >
                        <MdCheck /> Accept
                      </button>
                      <button 
                        className={styles.rejectBtn}
                        onClick={() => handleRejectOffer(offer.id)}
                      >
                        <MdClose /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Financial Overview (Placeholder for now) */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Financial Overview</h3>
            <div className={styles.balanceCard}>
              <p>Estimated Earnings</p>
              <h2>${stats.totalEarnings.toLocaleString()}</h2>
              <button 
                className={styles.withdrawBtn}
                onClick={() => router.push('/account/wallet')}
              >
                View Wallet
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}