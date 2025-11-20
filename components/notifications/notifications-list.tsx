'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MdNotifications, 
  MdCheck, 
  MdDelete, 
  MdPersonAdd, 
  MdMessage, 
  MdAttachMoney, 
  MdInfo 
} from 'react-icons/md';
import { useAuth } from '@/lib/auth-store';
import { 
  listenToNotifications, 
  markNotificationAsRead, 
  deleteNotification, 
  Notification 
} from '@/lib/realtime-service';
import styles from './notifications.module.css';

export default function NotificationsList() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Listen to Realtime Notifications
  useEffect(() => {
    if (!user?.id) return;

    const unsubscribe = listenToNotifications(user.id, (data) => {
      setNotifications(data);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user?.id]);

  // Helper to get icon based on type
  const getIcon = (type: string) => {
    switch (type) {
      case 'connection': return <MdPersonAdd className={styles.iconConnect} />;
      case 'message': return <MdMessage className={styles.iconMessage} />;
      case 'inquiry': return <MdAttachMoney className={styles.iconMoney} />;
      default: return <MdInfo className={styles.iconInfo} />;
    }
  };

  const handleMarkRead = async (id: string) => {
    if (!user?.id) return;
    await markNotificationAsRead(user.id, id);
  };

  const handleDelete = async (id: string) => {
    if (!user?.id) return;
    await deleteNotification(user.id, id);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Notifications</h1>
        </div>
        <div className={styles.loading}>Loading updates...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Notifications</h1>
        <span className={styles.count}>
          {notifications.filter(n => !n.read).length} unread
        </span>
      </div>

      <div className={styles.list}>
        {notifications.length === 0 ? (
          <div className={styles.emptyState}>
            <MdNotifications />
            <p>No notifications yet.</p>
          </div>
        ) : (
          <AnimatePresence>
            {notifications.map((notif) => (
              <motion.div
                key={notif.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className={`${styles.item} ${!notif.read ? styles.unread : ''}`}
                onClick={() => handleMarkRead(notif.id)}
              >
                <div className={styles.iconWrapper}>
                  {getIcon(notif.type)}
                </div>
                
                <div className={styles.content}>
                  <div className={styles.topRow}>
                    <h4>{notif.title}</h4>
                    <span className={styles.time}>{formatTime(notif.timestamp)}</span>
                  </div>
                  <p>{notif.message}</p>
                </div>

                <div className={styles.actions}>
                  {!notif.read && (
                    <button 
                      className={styles.actionBtn} 
                      onClick={(e) => { e.stopPropagation(); handleMarkRead(notif.id); }}
                      title="Mark as read"
                    >
                      <MdCheck />
                    </button>
                  )}
                  <button 
                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                    onClick={(e) => { e.stopPropagation(); handleDelete(notif.id); }}
                    title="Delete"
                  >
                    <MdDelete />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}