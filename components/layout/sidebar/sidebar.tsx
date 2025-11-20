'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MdHome, MdExplore, MdFavoriteBorder, MdMail, MdPerson, MdLogout } from 'react-icons/md';
import { useAuth } from '@/lib/auth-store';
import styles from './sidebar.module.css';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  id: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  // Skip sidebar for auth pages
  if (pathname?.includes('/auth')) {
    return null;
  }

  const navItems: NavItem[] = [
    {
      id: 'home',
      label: 'Home',
      href: '/user/dashboard',
      icon: <MdHome className={styles.icon} />,
    },
    {
      id: 'explore',
      label: 'Explore',
      href: '/explore',
      icon: <MdExplore className={styles.icon} />,
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      href: '/user/wishlist',
      icon: <MdFavoriteBorder className={styles.icon} />,
    },
    {
      id: 'messages',
      label: 'Messages',
      href: '/user/messages',
      icon: <MdMail className={styles.icon} />,
    },
    {
      id: 'account',
      label: 'Account',
      href: '/user/account',
      icon: <MdPerson className={styles.icon} />,
    },
  ];

  const isActive = (href: string) => pathname === href;

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarContent}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.userAvatar}>
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.name || 'User'} />
            ) : (
              <div className={styles.defaultAvatar}>
                {user?.name?.charAt(0) || 'U'}
              </div>
            )}
          </div>
          <div className={styles.userInfo}>
            <h2 className={styles.appName}>Havanah</h2>
            <p className={styles.appSubtitle}>Rentals & Sales</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={item.href}
                  className={`${styles.navLink} ${active ? styles.active : ''}`}
                >
                  <div className={styles.navIcon}>{item.icon}</div>
                  <span className={styles.navLabel}>{item.label}</span>
                  {active && <div className={styles.activeIndicator} />}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* CTA Section */}
        <div className={styles.ctaSection}>
          <h3 className={styles.ctaTitle}>List your property</h3>
          <p className={styles.ctaDescription}>
            Earn money by renting your car or apartment.
          </p>
          <button className={styles.ctaButton}>Get Started</button>
        </div>
      </div>

      {/* Footer - Logout */}
      <button onClick={handleLogout} className={styles.logoutBtn}>
        <MdLogout className={styles.logoutIcon} />
        <span>Logout</span>
      </button>
    </aside>
  );
}
