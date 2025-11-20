'use client';

import React, { useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MdDashboard, 
  MdExplore, 
  MdFavoriteBorder, 
  MdMail, 
  MdPerson, 
  MdLogout, 
  MdSettings,
  MdSell,
  MdDirectionsCar,
  MdApartment
} from 'react-icons/md';
import { useAuth } from '@/lib/auth-store';
import styles from './sidebar.module.css';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  // Don't render sidebar on auth pages
  if (pathname?.includes('/auth')) {
    return null;
  }

  // Determine navigation based on user role or default
  const navItems: NavItem[] = useMemo(() => {
    const baseItems = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        href: user?.role === 'agent' ? '/agent/dashboard' : '/user/dashboard',
        icon: <MdDashboard className={styles.icon} />,
      },
      {
        id: 'messages',
        label: 'Messages',
        href: '/messaging',
        icon: <MdMail className={styles.icon} />,
      },
      {
        id: 'explore',
        label: 'Explore',
        href: '/explore',
        icon: <MdExplore className={styles.icon} />,
      },
    ];

    const userItems = [
      {
        id: 'wishlist',
        label: 'Wishlist',
        href: '/user/wishlist',
        icon: <MdFavoriteBorder className={styles.icon} />,
      },
    ];

    const agentItems = [
      {
        id: 'listings',
        label: 'My Listings',
        href: '/agent/listings',
        icon: <MdSell className={styles.icon} />,
      },
    ];

    // Combine based on role
    let items = [...baseItems];
    if (user?.role === 'agent') {
      items = [...items, ...agentItems];
    } else {
      items = [...items, ...userItems];
    }

    // Add Settings/Account at the end
    items.push({
      id: 'account',
      label: 'Profile & Settings',
      href: '/account',
      icon: <MdSettings className={styles.icon} />,
    });

    return items;
  }, [user?.role]);

  const isActive = (href: string) => {
    if (href === '/explore' && pathname === '/explore') return true;
    if (href !== '/explore' && pathname?.startsWith(href)) return true;
    return false;
  };

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.glassBackground} />
      
      <div className={styles.sidebarContainer}>
        {/* Profile Section */}
        <div className={styles.profileSection}>
          <div className={styles.brandHeader}>
            <div className={styles.logoIcon}>H</div>
            <div className={styles.brandText}>
              <h1>Havanah</h1>
              <span>{user?.role === 'agent' ? 'Agent Portal' : 'Rentals & Sales'}</span>
            </div>
          </div>

          <motion.div 
            className={styles.userCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className={styles.avatarContainer}>
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || 'User'} 
                  className={styles.avatarImage}
                />
              ) : (
                <div className={styles.defaultAvatar}>
                  {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <div className={styles.onlineBadge} />
            </div>
            
            <div className={styles.userInfo}>
              <h3 className={styles.userName}>
                {user?.displayName || 'Welcome Back'}
              </h3>
              <p className={styles.userRole}>
                {user?.email || 'Guest User'}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          <div className={styles.navLabel}>MENU</div>
          <div className={styles.navGroup}>
            {navItems.map((item, index) => {
              const active = isActive(item.href);
              return (
                <Link key={item.id} href={item.href} passHref legacyBehavior>
                  <motion.a
                    className={`${styles.navLink} ${active ? styles.active : ''}`}
                    whileHover={{ x: 4, backgroundColor: 'rgba(16, 185, 129, 0.05)' }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <span className={styles.navIconWrapper}>
                      {item.icon}
                    </span>
                    <span className={styles.navText}>{item.label}</span>
                    
                    {active && (
                      <motion.div 
                        layoutId="activeIndicator"
                        className={styles.activeIndicator}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.a>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer Actions */}
        <div className={styles.footer}>
          {user?.role === 'user' && (
            <motion.div 
              className={styles.ctaCard}
              whileHover={{ y: -2 }}
            >
              <div className={styles.ctaContent}>
                <h4>Become an Agent</h4>
                <p>List your property today</p>
              </div>
              <button className={styles.ctaButton}>Upgrade</button>
            </motion.div>
          )}

          <motion.button 
            onClick={handleLogout} 
            className={styles.logoutBtn}
            whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', color: '#ef4444' }}
            whileTap={{ scale: 0.98 }}
          >
            <MdLogout className={styles.logoutIcon} />
            <span>Sign Out</span>
          </motion.button>
        </div>
      </div>
    </aside>
  );
}