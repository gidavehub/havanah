'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { MdMenu, MdClose, MdDashboard, MdApartment, MdDirectionsCar, MdExplore, MdHome } from 'react-icons/md';
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

  const navLinks = [
    { href: '/', label: 'Home', icon: <MdHome /> },
    { href: '/explore?type=house', label: 'Apartments', icon: <MdApartment /> },
    { href: '/explore?type=car', label: 'Rent a Car', icon: <MdDirectionsCar /> },
    { href: '/explore', label: 'Explore All', icon: <MdExplore /> },
  ];

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
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              className={pathname === link.href || (link.href.includes('?') && pathname.includes('explore')) ? styles.active : ''}
            >
              <span className={styles.navIcon}>{link.icon}</span>
              {link.label}
            </Link>
          ))}
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
            <>
              <Link href="/auth" className={styles.loginLink}>Log In</Link>
              <Link href="/auth" className={styles.signupBtn}>
                Sign Up
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
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              onClick={() => setMobileMenuOpen(false)}
              className={pathname === link.href ? styles.active : ''}
            >
              <span className={styles.navIcon}>{link.icon}</span>
              {link.label}
            </Link>
          ))}
          <hr />
          {user ? (
            <button onClick={() => router.push(user.role === 'agent' ? '/agent/dashboard' : '/user/dashboard')}>My Dashboard</button>
          ) : (
            <>
              <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
              <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </motion.div>
      )}
    </header>
  );
}