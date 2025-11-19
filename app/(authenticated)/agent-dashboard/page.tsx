'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTheme } from '@/lib/theme-context';

export const dynamic = 'force-dynamic';

export default function AgentDashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/login');
      } else if (user.role !== 'agent') {
        router.push('/user-dashboard');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--background-light)' }} className={theme === 'dark' ? 'dark-mode' : ''}>
        <style jsx>{`
          .loading-container {
            text-align: center;
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          .loading-badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 4rem;
            height: 4rem;
            border-radius: 50%;
            background: var(--glass-light);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            animation: pulse 2s ease-in-out infinite;
            margin: 0 auto;
          }
          .loading-text {
            color: var(--text-muted-light);
            font-size: 1rem;
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
        <div className="loading-container">
          <div className="loading-badge">
            <span className="loading-letter">H</span>
          </div>
          <p className="loading-text">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'agent') return null;

  return (
    <div className={theme === 'dark' ? 'dark-mode' : ''}>
      <style jsx>{`
        .agent-dashboard-wrapper {
          min-height: 100vh;
          background-color: var(--background-light);
          transition: background-color var(--transition-base);
        }

        body.dark-mode .agent-dashboard-wrapper {
          background-color: var(--background-dark);
        }

        .nav-bar {
          background: var(--glass-light);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-light);
          position: sticky;
          top: 0;
          z-index: 40;
          transition: all var(--transition-fast);
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

        .welcome-header {
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

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .metric-card {
          background: var(--glass-light);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 0.5rem;
          padding: 1.5rem;
          animation: fadeIn 0.5s ease-out;
        }

        body.dark-mode .metric-card {
          background: var(--glass-dark);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .metric-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .metric-icon {
          font-size: 2rem;
        }

        .metric-change {
          font-size: 0.875rem;
          font-weight: 600;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
        }

        .metric-change.negative {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .metric-label {
          color: var(--text-muted-light);
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        body.dark-mode .metric-label {
          color: var(--text-muted-dark);
        }

        .metric-value {
          font-size: 1.875rem;
          font-weight: 700;
          color: var(--text-light);
        }

        body.dark-mode .metric-value {
          color: var(--text-dark);
        }

        .recent-activity {
          margin-top: 2rem;
        }

        .recent-title {
          font-size: 1.375rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--text-light);
        }

        body.dark-mode .recent-title {
          color: var(--text-dark);
        }

        .recent-subtitle {
          color: var(--text-muted-light);
          font-size: 0.875rem;
        }

        body.dark-mode .recent-subtitle {
          color: var(--text-muted-dark);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      <div className="agent-dashboard-wrapper">
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
              <a href="/agent-dashboard" className="active">Dashboard</a>
              <a href="/listings">My Listings</a>
              <a href="/bookings">Bookings</a>
              <a href="/earnings">Earnings</a>
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
          {/* Welcome header */}
          <div className="welcome-header">
            <h1 className="welcome-title">
              Welcome back, {(user as any)?.displayName || 'Agent'}! 🎯
            </h1>
            <p className="welcome-subtitle">
              Manage your listings, bookings, and grow your business on Havanah
            </p>
          </div>

          {/* Key metrics */}
          <div className="metrics-grid">
            {[
              { label: 'Total Earnings', value: '125,400 GMD', icon: '💵', change: '+12.5%' },
              { label: 'Active Listings', value: '24', icon: '📋', change: '+3' },
              { label: 'Pending Bookings', value: '8', icon: '⏳', change: '-2' },
              { label: 'Rating', value: '4.9★', icon: '⭐', change: '+0.1' },
            ].map((metric, index) => (
              <div key={index} className="metric-card" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="metric-header">
                  <span className="metric-icon">{metric.icon}</span>
                  <span className={`metric-change ${metric.change.startsWith('-') ? 'negative' : ''}`}>
                    {metric.change}
                  </span>
                </div>
                <p className="metric-label">{metric.label}</p>
                <p className="metric-value">{metric.value}</p>
              </div>
            ))}
          </div>

          {/* Recent activity section */}
          <div className="recent-activity">
            <h2 className="recent-title">Recent Activity</h2>
            <p className="recent-subtitle">
              Your latest bookings and listings activity will appear here.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
