'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  MdSearch,
  MdNotifications,
  MdTrendingUp,
  MdTrendingDown,
  MdMoreHoriz,
  MdCheck,
  MdClose,
  MdAdd
} from 'react-icons/md';
import { useAuth } from '@/lib/auth-store';
import styles from './agent-dashboard.module.css';

// Mock Data
const stats = [
  { label: 'Active Listings', value: '12', change: '+2%', trend: 'up' },
  { label: 'Pending Offers', value: '5', change: '-5%', trend: 'down' },
  { label: 'Total Earnings', value: '$24,500', change: '+10%', trend: 'up' },
];

const listings = [
  {
    id: '1',
    title: 'Bright Downtown Loft',
    location: 'New York, NY',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=300&auto=format&fit=crop',
    type: 'Apartment',
    status: 'Active',
    price: '$3,200/mo'
  },
  {
    id: '2',
    title: 'Tesla Model 3',
    location: '2022 Model',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=300&auto=format&fit=crop',
    type: 'Car Sale',
    status: 'Pending',
    price: '$45,000'
  },
  {
    id: '3',
    title: 'Ford Mustang GT',
    location: '2023 Convertible',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=300&auto=format&fit=crop',
    type: 'Car Rental',
    status: 'Active',
    price: '$150/day'
  }
];

const offers = [
  {
    id: '1',
    user: 'John Doe',
    item: 'Tesla Model 3',
    amount: '$44,500',
    avatar: 'https://i.pravatar.cc/150?u=1'
  }
];

const transactions = [
  { id: '1', desc: 'Commission: Downtown Loft', date: 'Oct 28, 2023', amount: '+$800.00', type: 'credit' },
  { id: '2', desc: 'Payout to Bank', date: 'Oct 25, 2023', amount: '-$5,000.00', type: 'debit' },
];

export default function AgentDashboard() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('All');

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
            Welcome back, <span className={styles.highlight}>{user?.displayName || 'Havanah'}</span>!
          </h1>
          <p className={styles.subtitle}>Here's an overview of your business activities.</p>
        </motion.div>

        <div className={styles.headerActions}>
          <div className={styles.searchBar}>
            <MdSearch className={styles.searchIcon} />
            <input type="text" placeholder="Search listings..." />
          </div>
          <button className={styles.iconBtn}>
            <MdNotifications />
            <div className={styles.badge} />
          </button>
          <button className={styles.addBtn}>
            <MdAdd /> Add Listing
          </button>
        </div>
      </header>

      {/* Stats Row */}
      <div className={styles.statsGrid}>
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            className={styles.statCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <p className={styles.statLabel}>{stat.label}</p>
            <div className={styles.statValueRow}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={`${styles.statChange} ${stat.trend === 'up' ? styles.positive : styles.negative}`}>
                {stat.trend === 'up' ? <MdTrendingUp /> : <MdTrendingDown />}
                {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className={styles.mainGrid}>
        {/* Left Column: Listings */}
        <div className={styles.listingsSection}>
          <div className={styles.sectionHeader}>
            <h2>My Listings</h2>
            <div className={styles.filters}>
              {['All', 'Apartments', 'Car Rentals', 'Car Sales'].map((filter) => (
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
                {listings.map((listing, i) => (
                  <motion.tr 
                    key={listing.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + (i * 0.05) }}
                  >
                    <td>
                      <div className={styles.listingCell}>
                        <img src={listing.image} alt={listing.title} className={styles.listingImage} />
                        <div>
                          <p className={styles.listingTitle}>{listing.title}</p>
                          <p className={styles.listingSub}>{listing.location}</p>
                        </div>
                      </div>
                    </td>
                    <td><span className={styles.typeBadge}>{listing.type}</span></td>
                    <td>
                      <span className={`${styles.statusBadge} ${listing.status === 'Active' ? styles.active : styles.pending}`}>
                        {listing.status}
                      </span>
                    </td>
                    <td className={styles.priceText}>{listing.price}</td>
                    <td>
                      <button className={styles.actionBtn}><MdMoreHoriz /></button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Offers & Finance */}
        <div className={styles.sideSection}>
          
          {/* Recent Offers */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Recent Offers</h3>
            <div className={styles.offersList}>
              {offers.map((offer) => (
                <div key={offer.id} className={styles.offerItem}>
                  <div className={styles.offerHeader}>
                    <div className={styles.offerUser}>
                      <img src={offer.avatar} alt={offer.user} />
                      <div>
                        <p className={styles.userName}>{offer.user}</p>
                        <p className={styles.offerDetail}>Offer on {offer.item}</p>
                      </div>
                    </div>
                    <span className={styles.offerAmount}>{offer.amount}</span>
                  </div>
                  <div className={styles.offerActions}>
                    <button className={styles.acceptBtn}><MdCheck /> Accept</button>
                    <button className={styles.rejectBtn}><MdClose /> Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Overview */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Financial Overview</h3>
            <div className={styles.balanceCard}>
              <p>Account Balance</p>
              <h2>$15,720.50</h2>
            </div>
            
            <div className={styles.transactionsList}>
              <h4>Transaction History</h4>
              {transactions.map((t) => (
                <div key={t.id} className={styles.transactionItem}>
                  <div>
                    <p className={styles.transDesc}>{t.desc}</p>
                    <p className={styles.transDate}>{t.date}</p>
                  </div>
                  <span className={`${styles.transAmount} ${t.type === 'credit' ? styles.credit : styles.debit}`}>
                    {t.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}