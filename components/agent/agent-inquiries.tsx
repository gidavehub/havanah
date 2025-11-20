'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-store';
import { useToast } from '@/components/toast/toast';
import { getAgentInquiries, Inquiry, updateInquiryStatus } from '@/lib/firestore-service';
import { useInquiryNotification } from '@/lib/notification-hooks';
import styles from './agent-inquiries.module.css';

export default function AgentInquiries() {
  const { user } = useAuth();
  const toast = useToast();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

  // Set up inquiry notifications (agent will see toasts)
  useInquiryNotification();

  useEffect(() => {
    if (!user?.id) return;

    const loadInquiries = async () => {
      try {
        setLoading(true);
        const agentInquiries = await getAgentInquiries(user.id);
        setInquiries(agentInquiries);
      } catch (error) {
        console.error('Error loading inquiries:', error);
        toast.error('Failed', 'Could not load inquiries');
      } finally {
        setLoading(false);
      }
    };

    loadInquiries();
  }, [user?.id, toast]);

  const filteredInquiries = inquiries.filter(inq => {
    if (filter === 'all') return true;
    return inq.status === filter;
  });

  const handleStatusChange = async (inquiryId: string, newStatus: 'accepted' | 'rejected') => {
    try {
      await updateInquiryStatus(inquiryId, newStatus);
      setInquiries(inqs =>
        inqs.map(inq =>
          inq.id === inquiryId ? { ...inq, status: newStatus } : inq
        )
      );
      toast.success('Updated', `Inquiry ${newStatus}`);
    } catch (error) {
      console.error('Error updating inquiry:', error);
      toast.error('Failed', 'Could not update inquiry');
    }
  };

  const stats = {
    total: inquiries.length,
    pending: inquiries.filter(i => i.status === 'pending').length,
    accepted: inquiries.filter(i => i.status === 'accepted').length,
    rejected: inquiries.filter(i => i.status === 'rejected').length,
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Inquiries</h1>
        <p className={styles.subtitle}>Manage interested buyers and renters</p>
      </div>

      {/* Stats Section */}
      <div className={styles.statsGrid}>
        <motion.div
          className={`${styles.statCard} ${styles.total}`}
          whileHover={{ y: -4 }}
        >
          <div className={styles.statValue}>{stats.total}</div>
          <div className={styles.statLabel}>Total Inquiries</div>
        </motion.div>

        <motion.div
          className={`${styles.statCard} ${styles.pending}`}
          whileHover={{ y: -4 }}
        >
          <div className={styles.statValue}>{stats.pending}</div>
          <div className={styles.statLabel}>Pending</div>
        </motion.div>

        <motion.div
          className={`${styles.statCard} ${styles.accepted}`}
          whileHover={{ y: -4 }}
        >
          <div className={styles.statValue}>{stats.accepted}</div>
          <div className={styles.statLabel}>Accepted</div>
        </motion.div>

        <motion.div
          className={`${styles.statCard} ${styles.rejected}`}
          whileHover={{ y: -4 }}
        >
          <div className={styles.statValue}>{stats.rejected}</div>
          <div className={styles.statLabel}>Rejected</div>
        </motion.div>
      </div>

      {/* Filter Buttons */}
      <div className={styles.filterButtons}>
        {(['all', 'pending', 'accepted', 'rejected'] as const).map(status => (
          <motion.button
            key={status}
            className={`${styles.filterBtn} ${filter === status ? styles.active : ''}`}
            onClick={() => setFilter(status)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Inquiries List */}
      <div className={styles.inquiriesList}>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#9ca3af' }}>Loading inquiries...</p>
        ) : filteredInquiries.length === 0 ? (
          <motion.div
            className={styles.emptyState}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p>No {filter === 'all' ? '' : filter} inquiries yet</p>
          </motion.div>
        ) : (
          filteredInquiries.map((inquiry, index) => (
            <motion.div
              key={inquiry.id}
              className={`${styles.inquiryCard} ${styles[`status--${inquiry.status}`]}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
            >
              <div className={styles.cardHeader}>
                <div>
                  <h3 className={styles.listingTitle}>{inquiry.listingTitle}</h3>
                  <p className={styles.userName}>From: {inquiry.userName}</p>
                </div>
                <span className={`${styles.statusBadge} ${styles[`badge--${inquiry.status}`]}`}>
                  {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                </span>
              </div>

              <div className={styles.cardContent}>
                <p className={styles.userInfo}>
                  📧 {inquiry.userEmail}
                  {inquiry.userPhone && <span> | 📱 {inquiry.userPhone}</span>}
                </p>

                {inquiry.message && (
                  <div className={styles.messageBox}>
                    <p className={styles.message}>{inquiry.message}</p>
                  </div>
                )}

                <p className={styles.timestamp}>
                  {new Date(inquiry.createdAt.toDate?.() || inquiry.createdAt).toLocaleDateString()}
                </p>
              </div>

              {inquiry.status === 'pending' && (
                <div className={styles.cardActions}>
                  <motion.button
                    className={styles.btnAccept}
                    onClick={() => handleStatusChange(inquiry.id, 'accepted')}
                    whileHover={{ scale: 1.05 }}
                  >
                    Accept
                  </motion.button>
                  <motion.button
                    className={styles.btnReject}
                    onClick={() => handleStatusChange(inquiry.id, 'rejected')}
                    whileHover={{ scale: 1.05 }}
                  >
                    Reject
                  </motion.button>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
