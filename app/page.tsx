'use client';

import { useState } from 'react';
import ExplorePage from '../components/ExplorePage';
import ItemDetailsPage from '../components/ItemDetailsPage';
import AgentDashboardPage from '../components/AgentDashboardPage';
import UserDashboardPage from '../components/UserDashboardPage';
import CheckoutPage from '../components/CheckoutPage';
import MessagingPage from '../components/MessagingPage';

export default function Home() {
  const [currentPage, setCurrentPage] = useState('explore');
  const [darkMode, setDarkMode] = useState(false);
  const [navOpen, setNavOpen] = useState(true);

  const pages = [
    { id: 'explore', label: 'Explore' },
    { id: 'item-details', label: 'Item Details' },
    { id: 'agent-dashboard', label: 'Agent Dashboard' },
    { id: 'user-dashboard', label: 'User Dashboard' },
    { id: 'checkout', label: 'Checkout' },
    { id: 'messaging', label: 'Messaging' },
  ];

  return (
    <div className={darkMode ? 'dark-mode' : ''}>
      <style jsx>{`
        .nav-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--border-light);
          z-index: 100;
          padding: 1rem 2rem;
          transition: all 0.3s ease;
        }

        .dark-mode .nav-container {
          background: rgba(16, 28, 34, 0.95);
          border-bottom-color: var(--border-dark);
        }

        .nav-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .nav-toggle-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-light);
          transition: all 0.3s;
        }

        .dark-mode .nav-toggle-btn {
          color: var(--text-dark);
        }

        .nav-toggle-btn:hover {
          color: var(--primary);
        }

        .nav-tabs {
          display: flex;
          gap: 1rem;
          max-width: 1400px;
          margin: 0 auto;
          flex-wrap: wrap;
          align-items: center;
          overflow-x: auto;
          max-height: ${navOpen ? '100px' : '0px'};
          overflow: hidden;
          transition: max-height 0.3s ease;
        }

        .nav-tabs.open {
          max-height: 100px;
        }

        .nav-tab {
          padding: 0.5rem 1.5rem;
          border: none;
          background: transparent;
          color: var(--text-muted-light);
          font-family: 'Manrope', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          border-radius: 9999px;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .dark-mode .nav-tab {
          color: var(--text-muted-dark);
        }

        .nav-tab:hover {
          color: var(--primary);
          background-color: rgba(43, 173, 238, 0.1);
        }

        .nav-tab.active {
          color: var(--primary);
          background-color: rgba(43, 173, 238, 0.2);
          font-weight: 600;
        }

        .dark-mode .nav-tab.active {
          background-color: rgba(43, 173, 238, 0.3);
        }

        .nav-spacer {
          flex: 1;
        }

        .dark-mode-btn {
          padding: 0.5rem 1.5rem;
          border: none;
          background: transparent;
          color: var(--text-muted-light);
          font-family: 'Manrope', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          border-radius: 9999px;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .dark-mode .dark-mode-btn {
          color: var(--text-muted-dark);
        }

        .dark-mode-btn:hover {
          color: var(--primary);
          background-color: rgba(43, 173, 238, 0.1);
        }
      `}</style>

      {/* Navigation */}
      <nav className="nav-container">
        <div className="nav-header">
          <button
            className="nav-toggle-btn"
            onClick={() => setNavOpen(!navOpen)}
            title={navOpen ? 'Collapse Navigator' : 'Expand Navigator'}
          >
            <span className="material-symbols-outlined">
              {navOpen ? 'expand_less' : 'expand_more'}
            </span>
          </button>
          <div className={`nav-tabs ${navOpen ? 'open' : ''}`}>
            {pages.map((page) => (
              <button
                key={page.id}
                className={`nav-tab ${currentPage === page.id ? 'active' : ''}`}
                onClick={() => setCurrentPage(page.id)}
              >
                {page.label}
              </button>
            ))}
            <div className="nav-spacer"></div>
            <button
              className="dark-mode-btn"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </div>
      </nav>

      {/* Explore Page */}
      {currentPage === 'explore' && <ExplorePage />}

      {/* Item Details Page */}
      {currentPage === 'item-details' && <ItemDetailsPage />}

      {/* Agent Dashboard Page */}
      {currentPage === 'agent-dashboard' && <AgentDashboardPage />}

      {/* User Dashboard Page */}
      {currentPage === 'user-dashboard' && <UserDashboardPage />}

      {/* Checkout Page */}
      {currentPage === 'checkout' && <CheckoutPage />}

      {/* Messaging Page */}
      {currentPage === 'messaging' && <MessagingPage />}
    </div>
  );
}
