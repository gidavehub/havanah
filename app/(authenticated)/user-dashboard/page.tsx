'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';
import { useTheme } from '@/lib/theme-context';

export default function UserDashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/login');
      } else if (user.role !== 'user') {
        router.push('/agent-dashboard');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--background-light)' }} className={theme === 'dark' ? 'dark-mode' : ''}>
        <style jsx>{`
          .loading-wrapper {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            align-items: center;
            text-align: center;
          }
          .loading-badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 4rem;
            height: 4rem;
            border-radius: 50%;
            background: var(--glass-light);
            border: 1px solid rgba(255, 255, 255, 0.3);
            animation: pulse 2s ease-in-out infinite;
          }
          .loading-text {
            color: var(--text-muted-light);
            font-size: 1rem;
          }
          body.dark-mode .loading-text {
            color: var(--text-muted-dark);
          }
          .loading-letter {
            font-size: 1.5rem;
            font-weight: 700;
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
        `}</style>
        <div className="loading-wrapper">
          <div className="loading-badge">
            <span className="loading-letter">H</span>
          </div>
          <p className="loading-text">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className={theme === 'dark' ? 'dark-mode' : ''}>
      <style jsx>{`
        .user-dashboard-wrapper {
          min-height: 100vh;
          background-color: var(--background-light);
          transition: background-color var(--transition-base);
        }

        body.dark-mode .user-dashboard-wrapper {
          background-color: var(--background-dark);
        }

        .nav-bar {
          background: var(--glass-light);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-light);
          position: sticky;
          top: 0;
          z-index: 40;
        }

        body.dark-mode .nav-bar {
          background: var(--glass-dark);
          border-bottom-color: var(--border-dark);
        }

        .nav-content {
          max-width: 80rem;
          margin: 0 auto;
          padding: 1rem 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .logo-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
        }

        .logo-badge {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          background: var(--glass-light);
          border: 1px solid rgba(255, 255, 255, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s;
        }

        .logo-badge:hover {
          transform: scale(1.1);
        }

        body.dark-mode .logo-badge {
          background: var(--glass-dark);
        }

        .logo-letter {
          font-size: 1.125rem;
          font-weight: 700;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .logo-text {
          font-weight: 700;
          font-size: 1.125rem;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: none;
        }

        @media (min-width: 640px) {
          .logo-text {
            display: inline;
          }
        }

        .nav-center {
          display: none;
          align-items: center;
          gap: 1.5rem;
          font-size: 0.875rem;
        }

        @media (min-width: 768px) {
          .nav-center {
            display: flex;
          }
        }

        .nav-center a {
          color: var(--text-light);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s;
        }

        body.dark-mode .nav-center a {
          color: var(--text-dark);
        }

        .nav-center a:hover {
          color: var(--primary);
        }

        .nav-center a.active {
          color: var(--primary);
          font-weight: 600;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .theme-toggle {
          padding: 0.5rem;
          border-radius: 0.5rem;
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
        }

        .theme-toggle:hover {
          background: rgba(43, 173, 238, 0.1);
        }

        .signout-btn {
          padding: 0.5rem 1rem;
          background: var(--glass-light);
          color: var(--text-light);
          border: 1px solid var(--border-light);
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          backdrop-filter: blur(12px);
          transition: all 0.3s;
        }

        body.dark-mode .signout-btn {
          background: var(--glass-dark);
          color: var(--text-dark);
          border-color: var(--border-dark);
        }

        .signout-btn:hover {
          background: rgba(43, 173, 238, 0.1);
          border-color: var(--primary);
          color: var(--primary);
        }

        .main-content {
          max-width: 80rem;
          margin: 0 auto;
          padding: 3rem 1rem;
        }

        .welcome-section {
          margin-bottom: 3rem;
        }

        .welcome-title {
          font-size: 2.25rem;
          font-weight: 700;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
        }

        .welcome-subtitle {
          color: var(--text-muted-light);
          font-size: 1rem;
        }

        body.dark-mode .welcome-subtitle {
          color: var(--text-muted-dark);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .stat-card {
          background: var(--glass-light);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 0.5rem;
          padding: 1.5rem;
          animation: fadeIn 0.5s ease-out;
        }

        body.dark-mode .stat-card {
          background: var(--glass-dark);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .stat-icon {
          font-size: 2.25rem;
          margin-bottom: 0.75rem;
        }

        .stat-label {
          color: var(--text-muted-light);
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
          font-weight: 500;
        }

        body.dark-mode .stat-label {
          color: var(--text-muted-dark);
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-light);
        }

        body.dark-mode .stat-value {
          color: var(--text-dark);
        }

        .featured-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .featured-card {
          background: var(--glass-light);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 0.5rem;
          padding: 2rem;
        }

        body.dark-mode .featured-card {
          background: var(--glass-dark);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .featured-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--text-light);
        }

        body.dark-mode .featured-title {
          color: var(--text-dark);
        }

        .item-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .item-row {
          padding: 1rem;
          border-radius: 0.5rem;
          border: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        body.dark-mode .item-row {
          border-color: var(--border-dark);
        }

        .item-row:hover {
          border-color: var(--primary);
          background: rgba(43, 173, 238, 0.05);
        }

        body.dark-mode .item-row:hover {
          background: rgba(43, 173, 238, 0.1);
        }

        .item-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .item-icon {
          width: 4rem;
          height: 4rem;
          border-radius: 0.5rem;
          background: var(--glass-light);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        body.dark-mode .item-icon {
          background: var(--glass-dark);
        }

        .item-info h3 {
          font-weight: 600;
          color: var(--text-light);
          margin: 0 0 0.25rem 0;
        }

        body.dark-mode .item-info h3 {
          color: var(--text-dark);
        }

        .item-info p {
          font-size: 0.875rem;
          color: var(--text-muted-light);
          margin: 0;
        }

        body.dark-mode .item-info p {
          color: var(--text-muted-dark);
        }

        .item-arrow {
          color: var(--primary);
          font-size: 1.5rem;
        }

        .sidebar-card {
          background: var(--glass-light);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 0.5rem;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }

        body.dark-mode .sidebar-card {
          background: var(--glass-dark);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .sidebar-title {
          font-size: 1.125rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--text-light);
        }

        body.dark-mode .sidebar-title {
          color: var(--text-dark);
        }

        .sidebar-content {
          color: var(--text-muted-light);
          font-size: 0.875rem;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        body.dark-mode .sidebar-content {
          color: var(--text-muted-dark);
        }

        .sidebar-btn {
          width: 100%;
          padding: 0.75rem 1rem;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
          color: white;
          border: none;
          border-radius: 9999px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.3s;
        }

        .sidebar-btn:hover {
          opacity: 0.9;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (max-width: 768px) {
          .featured-section {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="user-dashboard-wrapper">
        {/* Navigation */}
        <nav className="nav-bar">
          <div className="nav-content">
            <div className="nav-left">
              <Link href="/" className="logo-link">
                <div className="logo-badge">
                  <span className="logo-letter">H</span>
                </div>
                <span className="logo-text">Havanah</span>
              </Link>
            </div>

            <div className="nav-center">
              <a href="/user-dashboard" className="active">Dashboard</a>
              <a href="/bookings">My Bookings</a>
              <a href="/messages">Messages</a>
              <a href="/profile">Profile</a>
            </div>

            <div className="nav-right">
              <button onClick={toggleTheme} className="theme-toggle">
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
              <button
                onClick={() => {
                  signOut().then(() => router.push('/'));
                }}
                className="signout-btn"
              >
                Sign Out
              </button>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="main-content">
          {/* Welcome section */}
          <div className="welcome-section">
            <h1 className="welcome-title">
              Welcome back, {(user as any)?.displayName || (user as any)?.email?.split('@')[0] || 'Guest'}! 👋
            </h1>
            <p className="welcome-subtitle">Browse and manage your services, bookings, and messages</p>
          </div>

          {/* Quick stats */}
          <div className="stats-grid">
            {[
              { label: 'Active Bookings', value: '3', icon: '📅' },
              { label: 'Saved Items', value: '12', icon: '❤️' },
              { label: 'Total Spent', value: '5,250 GMD', icon: '💰' },
              { label: 'Reviews', value: '4.8★', icon: '⭐' },
            ].map((stat, index) => (
              <div key={index} className="stat-card" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="stat-icon">{stat.icon}</div>
                <p className="stat-label">{stat.label}</p>
                <p className="stat-value">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Featured section */}
          <div className="featured-section">
            <div style={{ gridColumn: 'span 2' }}>
              <div className="featured-card">
                <h2 className="featured-title">Recommended for You</h2>
                <div className="item-list">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="item-row">
                      <div className="item-left">
                        <div className="item-icon">🏠</div>
                        <div className="item-info">
                          <h3>Luxury Apartment in Serrekunda</h3>
                          <p>2 bedrooms • Swimming pool • Free WiFi</p>
                        </div>
                      </div>
                      <div className="item-arrow">→</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="sidebar-card">
                <h3 className="sidebar-title">✨ Special Offer</h3>
                <p className="sidebar-content">
                  Get 20% off on your next booking with code WELCOME20
                </p>
                <button className="sidebar-btn">Explore Deals</button>
              </div>

              <div className="sidebar-card">
                <h3 className="sidebar-title">📱 Need Help?</h3>
                <p className="sidebar-content">
                  Our customer support team is here to assist you 24/7
                </p>
                <button className="sidebar-btn">Contact Support</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
