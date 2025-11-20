'use client';

import React from 'react';
import HeroSection from '@/components/landing/hero/hero';
import ServicesSection from '@/components/landing/services/services';
import styles from './landing.module.css';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className={styles.wrapper}>
      {/* Navigation */}
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <Link href="/" className={styles.logo}>
            <img src="/logo.jpg" alt="Havanah" className={styles.logoImg} />
          </Link>
          <div className={styles.navLinks}>
            <a href="#services" className={styles.navLink}>
              Services
            </a>
            <a href="#about" className={styles.navLink}>
              About
            </a>
            <a href="#contact" className={styles.navLink}>
              Contact
            </a>
            <Link href="/auth/login" className={styles.navCta}>
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection />

      {/* Services Section */}
      <div id="services">
        <ServicesSection />
      </div>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContainer}>
          <h2 className={styles.ctaTitle}>Ready to Get Started?</h2>
          <p className={styles.ctaSubtitle}>
            Join thousands of users discovering their perfect rental or purchase
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/auth/signup" className={styles.btnPrimary}>
              Create Account
            </Link>
            <a href="#services" className={styles.btnSecondary}>
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerContent}>
            <div className={styles.footerSection}>
              <h4>About Havanah</h4>
              <p>
                Premium platform for renting and selling properties and vehicles with ease and
                confidence.
              </p>
            </div>
            <div className={styles.footerSection}>
              <h4>Quick Links</h4>
              <ul>
                <li>
                  <a href="#home">Home</a>
                </li>
                <li>
                  <a href="#services">Services</a>
                </li>
                <li>
                  <a href="#about">About</a>
                </li>
              </ul>
            </div>
            <div className={styles.footerSection}>
              <h4>Legal</h4>
              <ul>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Terms of Service</a>
                </li>
              </ul>
            </div>
            <div className={styles.footerSection}>
              <h4>Contact</h4>
              <p>Email: support@havanah.com</p>
              <p>Phone: +1 (555) 123-4567</p>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>&copy; 2024 Havanah. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
