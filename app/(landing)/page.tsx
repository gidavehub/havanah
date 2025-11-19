'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/lib/theme-context';
import Head from 'next/head';

// --- SVG Icon Components --- //
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const ShieldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const TagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>;
const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
const SunIcon = () => <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm5.414 5.414a1 1 0 01-1.414 0l-.707-.707a1 1 0 011.414-1.414l.707.707zM5 6a1 1 0 100-2H4a1 1 0 000 2h1z" clipRule="evenodd" /></svg>;
const MoonIcon = () => <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>;
const ChevronDownIcon = () => <svg className="chevron" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>;

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&display=swap" rel="stylesheet" />
      </Head>
      <style jsx global>{`
        /* --- CSS RESET & BASE STYLES --- */
        :root {
          --primary: #2badee;
          --primary-light: #8ec5fc;
          --primary-dark: #2b99ee;
          --primary-bg: rgba(43, 173, 238, 0.1);
          --text: #111618;
          --text-muted: #617c89;
          --background: #f6f7f8;
          --surface: #ffffff;
          --border: #e3e9ec;
          --shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);
          --transition-base: 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        .dark-mode {
          --text: #e3e9ec;
          --text-muted: #9ab0bb;
          --background: #101c22;
          --surface: #1a2831;
          --border: #2b3c46;
          --shadow: 0 4px 6px -1px rgba(0,0,0,0.2), 0 2px 4px -2px rgba(0,0,0,0.2);
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
          transition: background-color var(--transition-base), color var(--transition-base);
          overflow-x: hidden;
        }
        a {
          color: inherit;
          text-decoration: none;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }
        .section {
          padding: 6rem 0;
        }
        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }
        .section-header h2 {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          letter-spacing: -0.03em;
        }
        .section-header .gradient-text {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
        }
        .section-header p {
          font-size: 1.125rem;
          color: var(--text-muted);
          max-width: 600px;
          margin: 0 auto;
        }

        /* --- BUTTONS --- */
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 1.5rem;
          border-radius: 9999px;
          font-weight: 700;
          font-size: 1rem;
          border: none;
          cursor: pointer;
          transition: all var(--transition-base);
        }
        .btn-primary {
          background-color: var(--primary);
          color: white;
          box-shadow: 0 4px 14px 0 rgba(43,173,238,0.39);
        }
        .btn-primary:hover {
          transform: scale(1.05);
          background-color: var(--primary-dark);
        }
        .btn-secondary {
          background-color: transparent;
          color: var(--text);
          border: 1px solid var(--border);
        }
        .btn-secondary:hover {
          background-color: var(--primary-bg);
          border-color: var(--primary);
          color: var(--primary-dark);
        }

        /* --- NAVIGATION --- */
        nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          transition: all var(--transition-base);
        }
        nav.scrolled {
          background-color: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--border);
        }
        .dark-mode nav.scrolled {
          background-color: rgba(26, 41, 51, 0.5);
        }
        .nav-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 80px;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .logo img {
            width: auto;
            height: 50px; /* Increased size */
        }
        .logo span {
          font-size: 1.5rem;
          font-weight: 800;
          display: none; /* Hide text as requested, logo image is self-explanatory */
        }
        .nav-links {
          display: none;
          gap: 2rem;
        }
        .nav-links a {
          font-weight: 500;
          color: var(--text-muted);
          transition: color var(--transition-base);
        }
        .nav-links a:hover {
          color: var(--primary);
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .theme-toggle {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 9999px;
          padding: 0.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-base);
        }
        .theme-toggle:hover {
          border-color: var(--primary);
        }

        /* --- HERO SECTION --- */
        .hero {
          padding-top: 10rem;
          padding-bottom: 6rem;
          overflow: hidden;
          position: relative;
        }
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 4rem;
          align-items: center;
        }
        .hero-content {
          text-align: center;
        }
        .hero-content h1 {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.04em;
          margin-bottom: 1.5rem;
        }
        .hero-content p {
          font-size: 1.25rem;
          color: var(--text-muted);
          max-width: 650px;
          margin: 0 auto 2.5rem;
        }
        .hero-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .hero-image-wrapper {
          position: relative;
          perspective: 1500px;
        }
        .hero-image {
          border-radius: 1rem;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
          width: 100%;
          transform: rotateX(10deg) rotateY(-10deg) rotateZ(3deg);
          transition: transform 1s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .hero-image:hover {
          transform: rotateX(0) rotateY(0) rotateZ(0) scale(1.05);
        }
        .hero-bg-blob {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, var(--primary-light) 0%, rgba(255,255,255,0) 70%);
          opacity: 0.2;
          filter: blur(80px);
          z-index: -1;
          pointer-events: none;
        }
        .dark-mode .hero-bg-blob { opacity: 0.3; }
        .blob-1 { width: 500px; height: 500px; top: -100px; right: -150px; }
        .blob-2 { width: 400px; height: 400px; bottom: -150px; left: -100px; }

        /* --- FEATURES SECTION --- */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }
        .feature-card {
          background: var(--surface);
          border: 1px solid var(--border);
          padding: 2rem;
          border-radius: 1rem;
          text-align: center;
          transition: all var(--transition-base);
        }
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow);
          border-color: var(--primary);
        }
        .feature-icon {
          display: inline-flex;
          padding: 1rem;
          background: var(--primary-bg);
          color: var(--primary);
          border-radius: 50%;
          margin-bottom: 1.5rem;
        }
        .feature-icon svg {
          width: 32px;
          height: 32px;
        }
        .feature-card h3 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .feature-card p {
          color: var(--text-muted);
          font-size: 1rem;
        }
        
        /* --- SHOWCASE SECTION --- */
        .showcase {
          background-color: var(--surface);
        }
        .showcase-content {
          padding: 2rem;
          border-radius: 1.5rem;
        }
        .browser-mockup {
          border: 1px solid var(--border);
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: var(--shadow);
          background: var(--background);
        }
        .browser-header {
          padding: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-bottom: 1px solid var(--border);
        }
        .browser-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        .browser-mockup img {
          width: 100%;
          display: block;
        }

        /* --- TESTIMONIALS SECTION --- */
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        .testimonial-card {
          background: var(--surface);
          border: 1px solid var(--border);
          padding: 2rem;
          border-radius: 1rem;
        }
        .testimonial-card > p {
          font-size: 1.125rem;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }
        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .testimonial-author img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
        }
        .author-info h4 {
          font-weight: 700;
        }
        .author-info p {
          color: var(--text-muted);
        }
        
        /* --- PRICING SECTION --- */
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          align-items: flex-start;
        }
        .pricing-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 1rem;
          padding: 2.5rem;
          text-align: center;
          transition: all var(--transition-base);
        }
        .pricing-card.featured {
          border-color: var(--primary);
          transform: scale(1.05);
          box-shadow: var(--shadow);
        }
        .pricing-card h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .pricing-price {
          font-size: 3rem;
          font-weight: 800;
          margin: 1rem 0;
        }
        .pricing-price span {
          font-size: 1rem;
          font-weight: 500;
          color: var(--text-muted);
        }
        .pricing-features {
          list-style: none;
          margin: 2rem 0;
          text-align: left;
        }
        .pricing-features li {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        .pricing-features li svg {
          color: var(--primary);
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        /* --- FAQ SECTION --- */
        .faq-container {
          max-width: 800px;
          margin: 0 auto;
        }
        .faq-item {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 0.75rem;
          margin-bottom: 1rem;
          overflow: hidden;
        }
        .faq-item summary {
          padding: 1.5rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 1.125rem;
        }
        .faq-item summary::-webkit-details-marker {
          display: none;
        }
        .faq-item .chevron {
          transition: transform var(--transition-base);
        }
        .faq-item[open] > summary .chevron {
          transform: rotate(180deg);
        }
        .faq-content {
          padding: 0 1.5rem 1.5rem;
          color: var(--text-muted);
          line-height: 1.6;
        }

        /* --- FOOTER --- */
        .footer {
          background-color: var(--surface);
          padding: 4rem 0 2rem;
          border-top: 1px solid var(--border);
        }
        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 3rem;
          margin-bottom: 3rem;
        }
        .footer-col .logo {
          margin-bottom: 1rem;
        }
        .footer-col h4 {
          font-weight: 700;
          margin-bottom: 1rem;
        }
        .footer-col p {
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        .footer-col ul {
          list-style: none;
        }
        .footer-col ul li {
          margin-bottom: 0.75rem;
        }
        .footer-col ul a {
          color: var(--text-muted);
          font-size: 0.9rem;
          transition: color var(--transition-base);
        }
        .footer-col ul a:hover {
          color: var(--primary);
        }
        .footer-bottom {
          border-top: 1px solid var(--border);
          padding-top: 2rem;
          text-align: center;
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        /* --- RESPONSIVE STYLES --- */
        @media (min-width: 768px) {
          .nav-links {
            display: flex;
          }
          .hero-grid {
            grid-template-columns: 1fr 1fr;
            text-align: left;
          }
          .hero-content {
            text-align: left;
          }
          .hero-buttons {
            justify-content: flex-start;
          }
          .logo span {
            display: block;
          }
        }
      `}</style>

      <div className={theme === 'dark' ? 'dark-mode' : ''}>
        {/* Navigation */}
        <nav className={isScrolled ? 'scrolled' : ''}>
          <div className="container nav-content">
            <Link href="/" className="logo">
              <img src="/logo.jpg" alt="Havanah Logo" />
              <span>Havanah</span>
            </Link>
            <div className="nav-links">
              <a href="#features">Features</a>
              <a href="#showcase">Showcase</a>
              <a href="#pricing">Pricing</a>
              <a href="#faq">FAQ</a>
            </div>
            <div className="nav-actions">
              <button onClick={toggleTheme} className="theme-toggle" title="Toggle theme">
                {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
              </button>
              <Link href="/auth/login" className="btn btn-secondary">Sign In</Link>
              <Link href="/auth/signup" className="btn btn-primary">Get Started</Link>
            </div>
          </div>
        </nav>

        <main>
          {/* Hero Section */}
          <section className="section hero">
            <div className="hero-bg-blob blob-1"></div>
            <div className="hero-bg-blob blob-2"></div>
            <div className="container hero-grid">
              <div className="hero-content">
                <h1>The Modern Marketplace for Services in Gambia</h1>
                <p>
                  Securely rent apartments, book cars, and connect with trusted agents. Havanah is your all-in-one platform for premium services, built on trust and convenience.
                </p>
                <div className="hero-buttons">
                  <Link href="/auth/signup" className="btn btn-primary">Create Free Account</Link>
                  <Link href="#showcase" className="btn btn-secondary">Explore Platform</Link>
                </div>
              </div>
              <div className="hero-image-wrapper">
                 <div className="browser-mockup hero-image">
                    <div className="browser-header">
                      <div className="browser-dot" style={{ backgroundColor: '#ff5f56' }}></div>
                      <div className="browser-dot" style={{ backgroundColor: '#ffbd2e' }}></div>
                      <div className="browser-dot" style={{ backgroundColor: '#27c93f' }}></div>
                    </div>
                    <img 
                      src="https://i.imgur.com/G5g2YvW.png" 
                      alt="Agent Dashboard Mockup" 
                    />
                  </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="section">
            <div className="container">
              <div className="section-header">
                <h2>Why <span className="gradient-text">Havanah</span> Works for You</h2>
                <p>We built a platform focused on security, convenience, and transparency to give you peace of mind with every transaction.</p>
              </div>
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon"><SearchIcon /></div>
                  <h3>Easy Discovery</h3>
                  <p>Browse thousands of verified apartments, cars, and other services with powerful search and filtering tools.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon"><ShieldIcon /></div>
                  <h3>Safe & Secure</h3>
                  <p>Every transaction is protected with secure payments, verified providers, and our buyer protection guarantee.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon"><TagIcon /></div>
                  <h3>Transparent Pricing</h3>
                  <p>Competitive pricing with all costs laid out clearly. No hidden fees, no surprises. What you see is what you pay.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon"><StarIcon /></div>
                  <h3>Rated & Reviewed</h3>
                  <p>Make confident decisions based on real, transparent reviews and ratings from our community of users.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Showcase Section */}
          <section id="showcase" className="section showcase">
            <div className="container">
              <div className="section-header">
                <h2>An Experience You'll <span className="gradient-text">Love</span></h2>
                <p>Our intuitive dashboard gives you a complete overview of your services, bookings, and payments, all in one place.</p>
              </div>
              <div className="showcase-content">
                <div className="browser-mockup">
                  <div className="browser-header">
                    <div className="browser-dot" style={{ backgroundColor: '#ff5f56' }}></div>
                    <div className="browser-dot" style={{ backgroundColor: '#ffbd2e' }}></div>
                    <div className="browser-dot" style={{ backgroundColor: '#27c93f' }}></div>
                  </div>
                  <img src="https://i.imgur.com/9C89zJG.png" alt="Havanah User Dashboard" />
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section id="testimonials" className="section">
            <div className="container">
              <div className="section-header">
                <h2>Trusted by <span className="gradient-text">Thousands</span></h2>
                <p>Don't just take our word for it. Here's what our users are saying about their experience with Havanah.</p>
              </div>
              <div className="testimonials-grid">
                <div className="testimonial-card">
                  <p>"Havanah completely changed how I find rental properties in Gambia. The platform is so easy to use, and I found the perfect apartment in just a few days. The entire process was secure and transparent."</p>
                  <div className="testimonial-author">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8x-N4SQMGakKfTOZq_lJb8gveK7pH3Wv8Phw47R34z_SsqmDOsEakg8oI_uZZYpUPGcICGYyIdr7bzRIF4GEIzo_eO1OmlS2t26JeVE7addvs81snYVfwFVoiYjQsuI-T-vmiNgD7kGJLN30NdL0LqmONEFI3LX_egx-m80nGyfKn6pLnvOS1KQH0ZnhRu93InMV2Z8uFNl5iyJOBIt2hDVX_FaRRvVQ-6uCi7pH6O03NopMUmjf5M4rdc7Qee-xnxASO2D7OLgAd" alt="Maria Rodriguez" />
                    <div className="author-info">
                      <h4>Aminata K.</h4>
                      <p>Satisfied Renter</p>
                    </div>
                  </div>
                </div>
                <div className="testimonial-card">
                  <p>"As an agent, Havanah has been a game-changer for my business. It provides a steady stream of qualified clients and makes managing my listings and payments incredibly simple. Highly recommended!"</p>
                  <div className="testimonial-author">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAB_vG8cGkUPrBq8WVAFv4tyJNSFNIxNbnsMy3UHrnPMz5SMVnE522XXG-jVyXBigT7a5H4pATwjMKzu8bVATrQWdjsgzg8CYBxhrSQ9YJU7xjYpsWM45Knm1z9iCFkFixBJWXo1opag4HH36Z9FyDBfJnkAWQQGSuw0SVqIJUGaSAg3Fwh0utgGM5MblxkcEo3MMd3RyA3Dw1gkYeK6CLuFdcLkRmrfbuatk9WcZvG6eTdOmO8KrGIHeSeuEvgNrtoMItzlQspxO3T" alt="David Chen" />
                    <div className="author-info">
                      <h4>Lamin J.</h4>
                      <p>Real Estate Agent</p>
                    </div>
                  </div>
                </div>
                <div className="testimonial-card">
                  <p>"I used Havanah to rent a car for my vacation and the experience was flawless. The booking was instant, the car was exactly as described, and the payment was secure. I'll definitely be using it again!"</p>
                  <div className="testimonial-author">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYv_3H08k036vT59K59q9cUdG72d09gyV0wUbSdeXqSJRS6NxjAQuM_Ep0pxfV6PD8UeInh7qMKYTsQTWkDs41ZJLtywzkLaH3E1YYHDGMyqzv43KmIxYDt6j_SuCihF63YzG6adZ24ahHE08iH1ZIpzUeXKUPRkNRTvz45QkpFYa9cRfS2byEouoejL_M8pHd6orv-zQ8MZupETKNKzGMc3NgJYzNsIxXcuZS85ukii8ZStnnhhtkspXP4i221CioUUO_ypY6CByD" alt="Sarah Jenkins" />
                    <div className="author-info">
                      <h4>Fatou S.</h4>
                      <p>Happy Tourist</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="section">
            <div className="container">
              <div className="section-header">
                <h2>Simple, Flexible <span className="gradient-text">Pricing</span></h2>
                <p>Choose the plan that's right for you. Get started for free or unlock powerful features with our premium plans.</p>
              </div>
              <div className="pricing-grid">
                <div className="pricing-card">
                  <h3>Free</h3>
                  <p>For casual users</p>
                  <div className="pricing-price">D0<span>/month</span></div>
                  <ul className="pricing-features">
                    <li><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Browse unlimited services</li>
                    <li><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Create a secure account</li>
                    <li><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Up to 3 bookings per month</li>
                    <li><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Standard support</li>
                  </ul>
                  <Link href="/auth/signup" className="btn btn-secondary" style={{ width: '100%' }}>Get Started</Link>
                </div>
                <div className="pricing-card featured">
                  <h3>Premium User</h3>
                  <p>For frequent users</p>
                  <div className="pricing-price">D2,500<span>/month</span></div>
                  <ul className="pricing-features">
                    <li><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Unlimited bookings</li>
                    <li><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>No platform fees</li>
                    <li><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Access to exclusive deals</li>
                    <li><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Priority customer support</li>
                  </ul>
                  <Link href="/auth/signup" className="btn btn-primary" style={{ width: '100%' }}>Choose Plan</Link>
                </div>
                <div className="pricing-card">
                  <h3>Pro Agent</h3>
                  <p>For service providers</p>
                  <div className="pricing-price">D5,000<span>/month</span></div>
                  <ul className="pricing-features">
                    <li><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Create and manage listings</li>
                    <li><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Advanced analytics dashboard</li>
                    <li><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Featured listing options</li>
                    <li><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Direct messaging with clients</li>
                  </ul>
                  <Link href="/auth/signup?role=agent" className="btn btn-secondary" style={{ width: '100%' }}>Become an Agent</Link>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section id="faq" className="section">
            <div className="container">
              <div className="section-header">
                <h2>Frequently Asked <span className="gradient-text">Questions</span></h2>
                <p>Have questions? We've got answers. If you can't find what you're looking for, feel free to contact us.</p>
              </div>
              <div className="faq-container">
                <details className="faq-item">
                  <summary>How does Havanah ensure user safety?<ChevronDownIcon/></summary>
                  <div className="faq-content">
                    We take safety very seriously. All service providers are vetted, payments are processed through a secure gateway, and we hold funds in escrow until the service is confirmed as completed. We also have a robust review system to maintain high standards.
                  </div>
                </details>
                <details className="faq-item">
                  <summary>What are the fees for using Havanah?<ChevronDownIcon/></summary>
                  <div className="faq-content">
                    For users, our platform is free for basic use with a small service fee on bookings. Our Premium plan removes this fee. For agents, we offer a subscription-based model that provides them with tools to manage and grow their business.
                  </div>
                </details>
                <details className="faq-item">
                  <summary>What happens if I have a problem with a service?<ChevronDownIcon/></summary>
                  <div className="faq-content">
                    If you encounter any issues, our dedicated support team is here to help. You can open a dispute through your dashboard, and our team will mediate to ensure a fair resolution for both parties.
                  </div>
                </details>
                <details className="faq-item">
                  <summary>Can I list my own services on the platform?<ChevronDownIcon/></summary>
                  <div className="faq-content">
                    Absolutely! We're always looking for trusted and reliable service providers. You can sign up as an Agent and choose the "Pro Agent" plan to start creating your listings and connecting with customers.
                  </div>
                </details>
              </div>
            </div>
          </section>
        </main>
        
        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <div className="footer-grid">
              <div className="footer-col">
                <div className="logo">
                  <img src="/logo.jpg" alt="Havanah Logo" />
                </div>
                <p>Your trusted marketplace for premium services in Gambia.</p>
              </div>
              <div className="footer-col">
                <h4>Platform</h4>
                <ul>
                  <li><a href="#features">Features</a></li>
                  <li><a href="#pricing">Pricing</a></li>
                  <li><a href="#">Safety & Trust</a></li>
                  <li><a href="#faq">FAQ</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Company</h4>
                <ul>
                  <li><a href="#">About Us</a></li>
                  <li><a href="#">Contact</a></li>
                  <li><a href="#">Careers</a></li>
                  <li><a href="#">Blog</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Legal</h4>
                <ul>
                  <li><a href="#">Privacy Policy</a></li>
                  <li><a href="#">Terms of Service</a></li>
                  <li><a href="#">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
            <div className="footer-bottom">
              <p>&copy; {new Date().getFullYear()} Havanah. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}