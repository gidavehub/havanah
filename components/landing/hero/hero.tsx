'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './hero.module.css';

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <motion.div
          className={styles.leftContent}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Premium <span className={styles.gradient}>Rentals</span> & Sales
          </motion.h1>

          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Discover the finest selection of luxury vehicles and premium properties. Rent or buy with confidence on Havanah.
          </motion.p>

          <motion.div
            className={styles.ctaButtons}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <button className={styles.btnPrimary}>Explore Now</button>
            <button className={styles.btnSecondary}>Learn More</button>
          </motion.div>

          <motion.div
            className={styles.stats}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <div className={styles.stat}>
              <div className={styles.statNumber}>50K+</div>
              <div className={styles.statLabel}>Listings</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNumber}>100K+</div>
              <div className={styles.statLabel}>Happy Users</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNumber}>99%</div>
              <div className={styles.statLabel}>Satisfaction</div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.rightContent}
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* macOS Window Mockup with 3D Perspective */}
          <motion.div
            className={styles.macWindow}
            initial={{ opacity: 0, rotationX: 45, rotationZ: 15 }}
            whileInView={{ opacity: 1, rotationX: 25, rotationZ: 8 }}
            transition={{ duration: 1.2, delay: 0.3, type: 'spring', stiffness: 60 }}
            viewport={{ once: true }}
            style={{
              transformStyle: 'preserve-3d',
              perspective: '1200px',
            }}
          >
            <div className={styles.macHeader}>
              <div className={styles.macButtons}>
                <div className={styles.macButtonRed}></div>
                <div className={styles.macButtonYellow}></div>
                <div className={styles.macButtonGreen}></div>
              </div>
              <span className={styles.macTitle}>Havanah Rental</span>
            </div>
            <div className={styles.macContent}>
              <div className={styles.mockupContent}>
                <div className={styles.mockupImage}>
                  <img src="/supercar.png" alt="Supercar" />
                </div>
                <div className={styles.mockupDetails}>
                  <h3>2024 Luxury Supercar</h3>
                  <p className={styles.price}>$250/day</p>
                  <button className={styles.rentBtn}>Rent Now</button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className={styles.decoration}>
        <motion.div
          className={styles.orb}
          style={{ top: '10%', right: '10%', background: 'rgba(16, 185, 129, 0.1)' }}
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        ></motion.div>
        <motion.div
          className={styles.orb}
          style={{ bottom: '10%', left: '5%', background: 'rgba(251, 191, 36, 0.1)' }}
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        ></motion.div>
      </div>
    </section>
  );
}
