'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import styles from './hero.module.css';

export default function HeroSection() {
  // Setup for 3D Mouse Follow Effect
  const ref = useRef(null);
  
  // Motion values for mouse position
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring animation for the tilt
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  // Map mouse position to rotation degrees (Tilt effect)
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15]); // Tilt up/down
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]); // Tilt left/right

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate mouse position relative to center of element (-0.5 to 0.5)
    const mouseXPos = (e.clientX - rect.left) / width - 0.5;
    const mouseYPos = (e.clientY - rect.top) / height - 0.5;
    
    x.set(mouseXPos);
    y.set(mouseYPos);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        
        {/* TEXT CONTENT */}
        <motion.div 
          className={styles.leftContent}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            style={{ 
              background: 'rgba(16, 185, 129, 0.1)', 
              color: '#059669', 
              padding: '0.5rem 1rem', 
              borderRadius: '20px', 
              display: 'inline-block',
              fontWeight: '600',
              marginBottom: '1rem'
            }}
          >
             🇬🇲 Premium Gambian Listings
          </motion.div>

          <h1 className={styles.title}>
            Experience <br />
            <span className={styles.gradient}>Havanah</span> Luxury.
          </h1>

          <p className={styles.subtitle}>
            From Kololi to Banjul, discover the finest selection of luxury vehicles and premium properties. 
            Secure your dream rental or purchase today.
          </p>

          <div className={styles.ctaButtons}>
            <motion.button 
              className={styles.btnPrimary}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Now
            </motion.button>
            <motion.button 
              className={styles.btnSecondary}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Deals
            </motion.button>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.statNumber}>50K+</div>
              <div className={styles.statLabel}>Listings</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNumber}>100%</div>
              <div className={styles.statLabel}>Secure</div>
            </div>
          </div>
        </motion.div>

        {/* 3D ANIMATED RIGHT CONTENT */}
        <motion.div 
          className={styles.rightContent}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          ref={ref}
          initial={{ opacity: 0, scale: 0.8, rotateX: 20 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* 
            This div handles the tilt (via mouse) AND the spin (via hover).
            We style transform-style: preserve-3d so children float in Z-space.
          */}
          <motion.div 
            className={styles.macWrapper}
            style={{ 
              rotateX: rotateX, 
              rotateY: rotateY,
            }}
            // THE CRAZY 360 SPIN ON HOVER
            whileHover={{ 
              rotateY: 360,
              transition: { duration: 1.2, ease: "easeInOut" } // Smooth but fast spin
            }}
          >
            
            {/* Floating "Verified" Badge (Floats BEHIND or IN FRONT in Z-space) */}
            <motion.div 
              className={styles.floatingBadge}
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              HOT <br/> DEAL
            </motion.div>

            {/* The Main Window */}
            <div className={styles.macWindow}>
              <div className={styles.macHeader}>
                <div className={styles.macButtons}>
                  <div className={styles.macDot} style={{background: '#FF5F56'}}></div>
                  <div className={styles.macDot} style={{background: '#FFBD2E'}}></div>
                  <div className={styles.macDot} style={{background: '#27C93F'}}></div>
                </div>
              </div>
              
              <div className={styles.macContent}>
                <div className={styles.imageContainer}>
                  {/* Replace with your actual image path */}
                  <img src="/supercar.png" alt="Luxury Car" className={styles.carImage} />
                  
                  {/* Shine effect overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)',
                    zIndex: 2,
                    mixBlendMode: 'overlay',
                  }} />
                </div>

                {/* Floating Price Card (Floats in Z-space) */}
                <motion.div 
                  className={styles.floatingCard}
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
                >
                  <div className={styles.cardTitle}>Mercedes-Benz AMG</div>
                  <div className={styles.priceTag}>
                    <span className={styles.currency}>GMD</span>
                    0.00
                  </div>
                  <div style={{fontSize: '0.8rem', color: '#10b981', marginTop: '4px', fontWeight: '600'}}>
                    Limited Time Offer!
                  </div>
                  <button className={styles.buyBtn}>Purchase Now</button>
                </motion.div>
              </div>
            </div>

          </motion.div>
        </motion.div>
      </div>

      {/* Ambient Background Orbs */}
      <motion.div 
        className={styles.orb} 
        style={{ 
          width: '500px', height: '500px', 
          background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)',
          top: '-10%', right: '-10%' 
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ repeat: Infinity, duration: 8 }}
      />
      <motion.div 
        className={styles.orb} 
        style={{ 
          width: '400px', height: '400px', 
          background: 'radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)',
          bottom: '0%', left: '-5%' 
        }}
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
        transition={{ repeat: Infinity, duration: 10 }}
      />

    </section>
  );
}