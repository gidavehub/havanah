'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { MdMenu, MdClose, MdDashboard } from 'react-icons/md';
import { useAuth } from '@/lib/auth-store';
import AuthModal from '@/components/auth/auth-modal';
import styles from './navbar.module.css';

export default function Navbar() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const isLanding = pathname === '/';

  return (
    <header 
      className={`${styles.navbar} ${isScrolled || !isLanding ? styles.scrolled : ''} ${!isLanding ? styles.solid : ''}`}
    >
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <img src="/logo.jpg" alt="HAVANA" className={styles.logoImg} />
        </Link>

        {/* Desktop Nav */}
        <nav className={styles.desktopNav}>
          <Link href="/" className={pathname === '/' ? styles.active : ''}>Home</Link>
          <Link href="/explore?type=house" className={pathname?.includes('house') ? styles.active : ''}>Apartments</Link>
          <Link href="/explore?type=car" className={pathname?.includes('car') ? styles.active : ''}>Rent a Car</Link>
          <Link href="/explore" className={pathname === '/explore' ? styles.active : ''}>Buy a Car</Link>
        </nav>

        {/* Auth Actions */}
        <div className={styles.actions}>
          {user ? (
            <button 
              className={styles.dashboardBtn}
              onClick={() => router.push(user.role === 'agent' ? '/agent/dashboard' : '/user/dashboard')}
            >
              <MdDashboard /> Dashboard
            </button>
          ) : (
            <button 
              className={styles.signupBtn}
              onClick={() => setAuthModalOpen(true)}
            >
              Sign In
            </button>
          )}
          
          {/* Mobile Toggle */}
          <button 
            className={styles.mobileToggle}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <MdClose /> : <MdMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          className={styles.mobileMenu}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link href="/explore?type=house" onClick={() => setMobileMenuOpen(false)}>Apartments</Link>
          <Link href="/explore?type=car" onClick={() => setMobileMenuOpen(false)}>Rent a Car</Link>
          <Link href="/explore" onClick={() => setMobileMenuOpen(false)}>Buy a Car</Link>
          <hr />
          {user ? (
            <button onClick={() => router.push(user.role === 'agent' ? '/agent/dashboard' : '/user/dashboard')}>My Dashboard</button>
          ) : (
            <button onClick={() => { setAuthModalOpen(true); setMobileMenuOpen(false); }}>Sign In</button>
          )}
        </motion.div>
      )}

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </header>
  );
}