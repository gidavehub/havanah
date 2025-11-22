'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { MdMenu, MdClose, MdDashboard, MdLogin } from 'react-icons/md';
import { useAuth } from '@/lib/auth-store';
import styles from './navbar.module.css';

export default function Navbar() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
          <span className={styles.logoIcon}>H</span>
          <span className={styles.logoText}>HAVANA</span>
        </Link>

        {/* Desktop Nav */}
        <nav className={styles.desktopNav}>
          <Link href="/" className={pathname === '/' ? styles.active : ''}>Home</Link>
          <Link href="/explore?type=house" className={pathname?.includes('house') ? styles.active : ''}>Apartments</Link>
          <Link href="/explore?type=car" className={pathname?.includes('car') ? styles.active : ''}>Cars</Link>
          <Link href="/explore" className={pathname === '/explore' ? styles.active : ''}>Explore All</Link>
        </nav>

        {/* Auth Actions */}
        <div className={styles.actions}>
          {user ? (
            <button 
              className={styles.dashboardBtn}
              onClick={() => router.push(user.role === 'agent' ? '/agent/dashboard' : '/account')}
            >
              <MdDashboard /> Dashboard
            </button>
          ) : (
            <>
              <Link href="/auth/login" className={styles.loginLink}>Log In</Link>
              <Link href="/auth/register" className={styles.signupBtn}>
                Get Started
              </Link>
            </>
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
          <Link href="/explore?type=car" onClick={() => setMobileMenuOpen(false)}>Cars</Link>
          <Link href="/explore" onClick={() => setMobileMenuOpen(false)}>Explore All</Link>
          <hr />
          {user ? (
            <button onClick={() => router.push('/account')}>My Dashboard</button>
          ) : (
            <button onClick={() => router.push('/auth/login')}>Log In / Sign Up</button>
          )}
        </motion.div>
      )}
    </header>
  );
}