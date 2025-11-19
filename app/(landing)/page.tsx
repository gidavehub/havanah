'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { motion, useScroll, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamically import Three.js component to avoid SSR issues
const ThreeWindow = dynamic(() => import('@/components/ThreeWindow'), {
  ssr: false,
  loading: () => <div style={{ width: '100%', height: '400px', background: '#f0f4f8', borderRadius: '12px' }} />,
});

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const navOpacity = useTransform(scrollY, [0, 100], [0, 1]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          scroll-behavior: smooth;
        }
        
        html, body {
          width: 100%;
          height: 100%;
        }
        
        body {
          font-family: 'Manrope', sans-serif;
          background: linear-gradient(135deg, #ffffff 0%, #f0f4f8 50%, #e8f0f7 100%);
          color: #1a2332;
          line-height: 1.6;
        }
        
        a {
          text-decoration: none;
          color: inherit;
        }
        
        button {
          font-family: 'Manrope', sans-serif;
        }
      `}</style>

      <style jsx>{`
        /* Navigation */
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 1.5rem 3rem;
          backdrop-filter: blur(8px);
          background: rgba(255, 255, 255, 0.7);
          border-bottom: 1px solid rgba(230, 240, 250, 0.5);
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .navbar.scrolled {
          background: rgba(255, 255, 255, 0.85);
          box-shadow: 0 4px 30px rgba(26, 35, 50, 0.08);
          padding: 1rem 3rem;
        }
        
        .nav-container {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 4rem;
        }
        
        .logo {
          font-size: 1.8rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transition: transform 300ms;
          cursor: pointer;
        }
        
        .logo:hover {
          transform: scale(1.05);
        }
        
        .nav-links {
          flex: 1;
          display: flex;
          gap: 3rem;
          font-size: 0.95rem;
          font-weight: 500;
        }
        
        .nav-links a {
          color: #4a5f7f;
          transition: all 300ms;
          position: relative;
        }
        
        .nav-links a:hover {
          color: #3b82f6;
        }
        
        .nav-links a::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #3b82f6, #60a5fa);
          transition: width 300ms;
        }
        
        .nav-links a:hover::after {
          width: 100%;
        }
        
        .nav-actions {
          display: flex;
          gap: 1.5rem;
          align-items: center;
        }
        
        .btn {
          padding: 0.75rem 1.75rem;
          border-radius: 50px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 0.9rem;
        }
        
        .btn-ghost {
          background: transparent;
          color: #3b82f6;
          border: 1.5px solid rgba(59, 130, 246, 0.3);
        }
        
        .btn-ghost:hover {
          background: rgba(59, 130, 246, 0.05);
          border-color: #3b82f6;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
          color: white;
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(59, 130, 246, 0.4);
        }
        
        /* Hero */
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 120px 3rem 4rem;
          position: relative;
          overflow: hidden;
        }
        
        .hero::before {
          content: '';
          position: absolute;
          top: 10%;
          right: -10%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          filter: blur(40px);
          z-index: 0;
        }
        
        .hero::after {
          content: '';
          position: absolute;
          bottom: -20%;
          left: -10%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(147, 114, 234, 0.08) 0%, transparent 70%);
          border-radius: 50%;
          filter: blur(50px);
          z-index: 0;
        }
        
        .hero-content {
          max-width: 800px;
          text-align: center;
          z-index: 2;
          position: relative;
        }
        
        .hero-title {
          font-size: clamp(3rem, 8vw, 5rem);
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
          color: #1a2332;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .hero-subtitle {
          font-size: 1.25rem;
          color: #5a7a95;
          margin-bottom: 2.5rem;
          line-height: 1.8;
          font-weight: 400;
        }
        
        .hero-cta {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        /* Feature Pages */
        .feature-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8rem 3rem;
          position: relative;
          overflow: hidden;
          background: linear-gradient(180deg, #ffffff 0%, #f7fbff 100%);
        }
        
        .feature-page:nth-child(odd) {
          background: linear-gradient(180deg, #f9feff 0%, #f0f4f8 100%);
        }
        
        .feature-content {
          max-width: 1200px;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
        }
        
        .feature-text h2 {
          font-size: clamp(2.2rem, 5vw, 3.5rem);
          font-weight: 800;
          margin-bottom: 1.5rem;
          line-height: 1.2;
          color: #1a2332;
          letter-spacing: -0.01em;
        }
        
        .feature-text p {
          font-size: 1.05rem;
          color: #5a7a95;
          margin-bottom: 2rem;
          line-height: 1.8;
        }
        
        .feature-list {
          list-style: none;
          margin-bottom: 2rem;
        }
        
        .feature-list li {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.2rem;
          font-size: 1rem;
          color: #3a5f7f;
        }
        
        .feature-list li::before {
          content: '✓';
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
          color: white;
          border-radius: 50%;
          font-weight: 800;
          font-size: 0.8rem;
          flex-shrink: 0;
        }
        
        .feature-visual {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 500px;
        }
        
        .feature-visual.reverse {
          order: -1;
        }
        
        /* CTA Section */
        .cta {
          min-height: 70vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6rem 3rem;
          text-align: center;
          background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
          position: relative;
          overflow: hidden;
        }
        
        .cta::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: drift 20s linear infinite;
          z-index: 0;
        }
        
        @keyframes drift {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        .cta-content {
          max-width: 600px;
          color: white;
          z-index: 2;
          position: relative;
        }
        
        .cta-title {
          font-size: 3.2rem;
          font-weight: 800;
          margin-bottom: 1rem;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }
        
        .cta-subtitle {
          font-size: 1.2rem;
          margin-bottom: 2.5rem;
          opacity: 0.95;
          line-height: 1.7;
          font-weight: 400;
        }
        
        .cta-btn {
          background: white;
          color: #3b82f6;
          padding: 1rem 2.5rem;
          font-weight: 700;
          font-size: 1rem;
          border-radius: 50px;
          border: none;
          cursor: pointer;
          transition: all 300ms;
          display: inline-block;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }
        
        .cta-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
        }
        
        /* Footer */
        .footer {
          padding: 4rem 3rem;
          text-align: center;
          background: rgba(255, 255, 255, 0.5);
          border-top: 1px solid rgba(59, 130, 246, 0.1);
          color: #5a7a95;
          font-size: 0.9rem;
        }
        
        .footer-links {
          display: flex;
          gap: 2rem;
          justify-content: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        
        .footer-links a {
          color: #3b82f6;
          transition: color 300ms;
        }
        
        .footer-links a:hover {
          color: #2563eb;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .navbar {
            padding: 1rem 1.5rem;
          }
          
          .nav-container {
            gap: 1.5rem;
          }
          
          .nav-links {
            display: none;
          }
          
          .logo {
            font-size: 1.4rem;
          }
          
          .hero {
            padding: 100px 1.5rem 2rem;
          }
          
          .hero-title {
            font-size: 2rem;
          }
          
          .hero-subtitle {
            font-size: 1rem;
          }
          
          .feature-content {
            grid-template-columns: 1fr;
            gap: 2rem;
            padding: 2rem;
          }
          
          .feature-visual {
            min-height: 300px;
          }
          
          .feature-visual.reverse {
            order: 0;
          }
          
          .cta-title {
            font-size: 1.8rem;
          }
          
          .cta-subtitle {
            font-size: 1rem;
          }
        }
      `}</style>

      {/* Navigation */}
      <motion.nav 
        className={`navbar ${isScrolled ? 'scrolled' : ''}`}
        style={{ opacity: navOpacity }}
      >
        <div className="nav-container">
          <div className="logo">Havanah</div>
          <div className="nav-links">
            <a href="#messaging">Messaging</a>
            <a href="#services">Services</a>
            <a href="#payments">Payments</a>
          </div>
          <div className="nav-actions">
            <Link href="/auth/login" className="btn btn-ghost">Sign In</Link>
            <Link href="/auth/signup" className="btn btn-primary">Get Started</Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="hero">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="hero-title">
            The Modern Marketplace for <span className="gradient-text">Services in Gambia</span>
          </h1>
          <p className="hero-subtitle">
            Connect with trusted agents, book premium services, and enjoy secure transactions with escrow protection. Havanah makes it simple.
          </p>
          <div className="hero-cta">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/auth/signup" className="btn btn-primary">Create Free Account</Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="#messaging" className="btn btn-ghost">Learn More</Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Feature 1: Messaging */}
      <section id="messaging" className="feature-page">
        <motion.div 
          className="feature-content"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="feature-text">
            <h2>Direct <span className="gradient-text">Communication</span></h2>
            <p>
              Chat directly with service providers without intermediaries. Build trust through transparent conversation before committing to any booking.
            </p>
            <ul className="feature-list">
              <li>Real-time messaging with agents</li>
              <li>Full message history preserved</li>
              <li>Dispute resolution through chat</li>
              <li>Verified user identities</li>
            </ul>
            <Link href="/auth/signup" className="btn btn-primary">Start Messaging</Link>
          </div>
          <div className="feature-visual">
            <ThreeWindow title="Messaging Hub" />
          </div>
        </motion.div>
      </section>

      {/* Feature 2: Services */}
      <section id="services" className="feature-page">
        <motion.div 
          className="feature-content"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="feature-visual reverse">
            <ThreeWindow title="Service Catalog" />
          </div>
          <div className="feature-text">
            <h2>Browse & <span className="gradient-text">Book</span> Services</h2>
            <p>
              Discover curated services from trusted providers. Every listing is verified and comes with ratings, reviews, and transparent pricing.
            </p>
            <ul className="feature-list">
              <li>Thousands of verified listings</li>
              <li>Advanced search and filters</li>
              <li>Real ratings and reviews</li>
              <li>One-click booking</li>
            </ul>
            <Link href="/auth/signup" className="btn btn-primary">Explore Services</Link>
          </div>
        </motion.div>
      </section>

      {/* Feature 3: Payments */}
      <section id="payments" className="feature-page">
        <motion.div 
          className="feature-content"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="feature-text">
            <h2>Secure <span className="gradient-text">Payments</span></h2>
            <p>
              Your money is protected. We hold payments in escrow until services are completed, ensuring both users and agents are protected.
            </p>
            <ul className="feature-list">
              <li>Secure escrow system</li>
              <li>Multiple payment methods</li>
              <li>Transparent fee structure</li>
              <li>Instant fund transfers</li>
            </ul>
            <Link href="/auth/signup" className="btn btn-primary">Get Started Today</Link>
          </div>
          <div className="feature-visual">
            <ThreeWindow title="Secure Payment" />
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <motion.div 
          className="cta-content"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="cta-title">Ready to Get Started?</h2>
          <p className="cta-subtitle">
            Join thousands of satisfied users and discover the future of marketplace services in Gambia.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/auth/signup" className="cta-btn">Create Free Account</Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-links">
          <a href="#messaging">Features</a>
          <a href="#services">Services</a>
          <a href="#payments">Payments</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </div>
        <p>&copy; 2024 Havanah - Your Premium Service Marketplace in Gambia. All rights reserved.</p>
      </footer>
    </>
  );
}
