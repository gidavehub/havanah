'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/lib/theme-context';
import Head from 'next/head';

// SVG Icons
const SunIcon = () => <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm5.414 5.414a1 1 0 01-1.414 0l-.707-.707a1 1 0 011.414-1.414l.707.707zM5 6a1 1 0 100-2H4a1 1 0 000 2h1z" clipRule="evenodd" /></svg>;
const MoonIcon = () => <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>;

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

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
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        :root {
          --primary: #2badee;
          --primary-light: #8ec5fc;
          --primary-dark: #2b99ee;
          --text: #111618;
          --text-muted: #617c89;
          --background: #f6f7f8;
          --surface: #ffffff;
          --border: #e3e9ec;
        }
        .dark-mode {
          --text: #e3e9ec;
          --text-muted: #9ab0bb;
          --background: #101c22;
          --surface: #1a2831;
          --border: #2b3c46;
        }
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          scroll-behavior: smooth;
        }
        body {
          font-family: 'Manrope', sans-serif;
          background-color: var(--background);
          color: var(--text);
          transition: background-color 300ms, color 300ms;
        }
        a { text-decoration: none; color: inherit; }
      `}</style>

      <style jsx>{`
        /* Navigation */
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 1rem 1.5rem;
          background: transparent;
          transition: all 300ms;
        }
        .navbar.scrolled {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .dark-mode .navbar.scrolled {
          background: rgba(26, 41, 51, 0.8);
        }
        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
        }
        .logo-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
        }
        .logo-img {
          height: 70px;
          width: auto;
          transition: transform 300ms;
        }
        .logo-img:hover {
          transform: scale(1.1);
        }
        .logo-text {
          display: none;
          font-size: 1.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .nav-center {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 3rem;
          font-size: 0.95rem;
          font-weight: 500;
        }
        .nav-center a {
          color: var(--text-muted);
          transition: color 300ms;
        }
        .nav-center a:hover {
          color: var(--primary);
        }
        .nav-right {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex-shrink: 0;
        }
        .theme-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 300ms;
          padding: 0.5rem;
        }
        .theme-btn:hover {
          transform: scale(1.2) rotate(20deg);
        }
        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 9999px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 300ms;
          font-size: 0.9rem;
        }
        .btn-primary {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(43, 173, 238, 0.3);
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(43, 173, 238, 0.4);
        }
        .btn-secondary {
          background: transparent;
          color: var(--text);
          border: 1px solid var(--border);
        }
        .btn-secondary:hover {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }

        /* Hero Section */
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 120px 2rem 4rem;
          text-align: center;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, var(--background) 0%, rgba(43, 173, 238, 0.05) 100%);
        }
        .hero-content {
          max-width: 800px;
          z-index: 2;
        }
        .hero-title {
          font-size: clamp(2.5rem, 8vw, 4.5rem);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          letter-spacing: -0.03em;
        }
        .gradient-text {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--text-muted);
          margin-bottom: 2.5rem;
          line-height: 1.6;
        }
        .hero-cta {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.15;
          z-index: 1;
        }
        .blob-1 {
          top: -10%;
          right: -5%;
          width: 400px;
          height: 400px;
          background: rgba(43, 173, 238, 0.5);
        }
        .blob-2 {
          bottom: -15%;
          left: -10%;
          width: 500px;
          height: 500px;
          background: rgba(163, 104, 217, 0.3);
          animation: float 25s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(30px); }
        }

        /* Feature Pages */
        .feature-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6rem 2rem;
          position: relative;
          overflow: hidden;
        }
        .feature-page-1 {
          background: linear-gradient(135deg, var(--surface) 0%, rgba(43, 173, 238, 0.08) 100%);
        }
        .feature-page-2 {
          background: linear-gradient(135deg, rgba(43, 173, 238, 0.05) 0%, rgba(163, 104, 217, 0.08) 100%);
        }
        .feature-page-3 {
          background: linear-gradient(135deg, rgba(163, 104, 217, 0.08) 0%, var(--surface) 100%);
        }
        .feature-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }
        .feature-text h2 {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 900;
          margin-bottom: 1.5rem;
          line-height: 1.2;
        }
        .feature-text p {
          font-size: 1.1rem;
          color: var(--text-muted);
          margin-bottom: 1.5rem;
          line-height: 1.8;
        }
        .feature-text ul {
          list-style: none;
          margin-bottom: 2rem;
        }
        .feature-text li {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
          font-size: 1rem;
        }
        .feature-text li:before {
          content: '✓';
          color: var(--primary);
          font-weight: 900;
          font-size: 1.5rem;
          flex-shrink: 0;
        }
        .feature-visual {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 500px;
        }
        .feature-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 1.5rem;
          padding: 2rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          transform: perspective(1200px) rotateY(-5deg) rotateX(5deg);
          transition: transform 300ms;
        }
        .feature-card:hover {
          transform: perspective(1200px) rotateY(0) rotateX(0) scale(1.05);
        }
        .feature-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        .feature-card-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        .feature-card-desc {
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.6;
        }

        /* CTA Section */
        .cta {
          min-height: 60vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6rem 2rem;
          text-align: center;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
        }
        .cta-content {
          max-width: 600px;
          color: white;
        }
        .cta-title {
          font-size: 3rem;
          font-weight: 900;
          margin-bottom: 1rem;
          line-height: 1.2;
        }
        .cta-subtitle {
          font-size: 1.25rem;
          margin-bottom: 2rem;
          opacity: 0.95;
          line-height: 1.6;
        }
        .cta-btn {
          background: white;
          color: var(--primary);
          padding: 1rem 2.5rem;
          font-weight: 700;
          font-size: 1rem;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          transition: all 300ms;
          display: inline-block;
        }
        .cta-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        /* Footer */
        .footer {
          padding: 3rem 2rem;
          text-align: center;
          border-top: 1px solid var(--border);
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .nav-center { display: none; }
          .nav-right { gap: 1rem; }
          .btn { padding: 0.6rem 1.2rem; font-size: 0.85rem; }
          .feature-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .feature-visual { min-height: 300px; }
          .cta-title { font-size: 2rem; }
        }
      `}</style>

      <div className={theme === 'dark' ? 'dark-mode' : ''}>
        {/* Navigation */}
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
          <div className="nav-container">
            <Link href="/" className="logo-container">
              <img src="/logo.jpg" alt="Havanah" className="logo-img" />
              <span className="logo-text">Havanah</span>
            </Link>

            <div className="nav-center">
              <a href="#messaging">Messaging</a>
              <a href="#services">Services</a>
              <a href="#payments">Payments</a>
            </div>

            <div className="nav-right">
              <button onClick={toggleTheme} className="theme-btn" title="Toggle theme">
                {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
              </button>
              <Link href="/auth/login" className="btn btn-secondary">Sign In</Link>
              <Link href="/auth/signup" className="btn btn-primary">Get Started</Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="hero">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="hero-content">
            <h1 className="hero-title">
              The Modern Marketplace for <span className="gradient-text">Services in Gambia</span>
            </h1>
            <p className="hero-subtitle">
              Connect with trusted agents, book premium services, and enjoy secure transactions with escrow protection. Havanah makes it simple.
            </p>
            <div className="hero-cta">
              <Link href="/auth/signup" className="btn btn-primary">Create Free Account</Link>
              <Link href="#messaging" className="btn btn-secondary">Learn More</Link>
            </div>
          </div>
        </section>

        {/* Feature 1: Messaging */}
        <section id="messaging" className="feature-page feature-page-1">
          <div className="feature-content">
            <div className="feature-text">
              <h2>Direct <span className="gradient-text">Communication</span></h2>
              <p>
                Chat directly with service providers without intermediaries. Build trust through transparent conversation before committing to any booking.
              </p>
              <ul>
                <li>Real-time messaging with agents</li>
                <li>Full message history preserved</li>
                <li>Dispute resolution through chat</li>
                <li>Verified user identities</li>
              </ul>
              <Link href="/auth/signup" className="btn btn-primary">Start Messaging</Link>
            </div>
            <div className="feature-visual">
              <div className="feature-card">
                <div className="feature-icon">💬</div>
                <div className="feature-card-title">Maria Rodriguez</div>
                <div className="feature-card-desc">
                  "I was able to negotiate the rental terms directly with the agent. The messaging feature made it so easy to clarify all the details before booking."
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature 2: Services */}
        <section id="services" className="feature-page feature-page-2">
          <div className="feature-content">
            <div className="feature-visual">
              <div className="feature-card">
                <div className="feature-icon">🏠</div>
                <div className="feature-card-title">Find Premium Services</div>
                <div className="feature-card-desc">
                  Apartments, cars, professional services - all vetted and verified. Browse thousands of options tailored to your needs with transparent pricing.
                </div>
              </div>
            </div>
            <div className="feature-text">
              <h2>Browse & <span className="gradient-text">Book</span> Services</h2>
              <p>
                Discover curated services from trusted providers. Every listing is verified and comes with ratings, reviews, and transparent pricing.
              </p>
              <ul>
                <li>Thousands of verified listings</li>
                <li>Advanced search and filters</li>
                <li>Real ratings and reviews</li>
                <li>One-click booking</li>
              </ul>
              <Link href="/auth/signup" className="btn btn-primary">Explore Services</Link>
            </div>
          </div>
        </section>

        {/* Feature 3: Payments */}
        <section id="payments" className="feature-page feature-page-3">
          <div className="feature-content">
            <div className="feature-text">
              <h2>Secure <span className="gradient-text">Payments</span></h2>
              <p>
                Your money is protected. We hold payments in escrow until services are completed, ensuring both users and agents are protected.
              </p>
              <ul>
                <li>Secure escrow system</li>
                <li>Multiple payment methods</li>
                <li>Transparent fee structure</li>
                <li>Instant fund transfers</li>
              </ul>
              <Link href="/auth/signup" className="btn btn-primary">Get Started Today</Link>
            </div>
            <div className="feature-visual">
              <div className="feature-card">
                <div className="feature-icon">💳</div>
                <div className="feature-card-title">Protected Transactions</div>
                <div className="feature-card-desc">
                  Payments are securely held in escrow. Only released when services are confirmed complete. Your trust is our priority.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Get Started?</h2>
            <p className="cta-subtitle">
              Join thousands of satisfied users and discover the future of marketplace services in Gambia.
            </p>
            <Link href="/auth/signup" className="cta-btn">Create Free Account</Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <p>&copy; 2024 Havanah - Your Premium Service Marketplace. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
