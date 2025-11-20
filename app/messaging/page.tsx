
'use client';

import React from 'react';
import Sidebar from '@/components/layout/sidebar/sidebar';
import Messaging from '@/components/messaging/messaging';

export default function MessagesPage() {
  return (
    <div style={{ 
      display: 'flex', 
      width: '100%', 
      height: '100vh', 
      overflow: 'hidden',
      backgroundColor: '#f9fafb' 
    }}>
      {/* 
        The Sidebar component uses position: fixed. 
        We render it here so it stays persistent.
      */}
      <Sidebar />

      {/* 
        Main Content Wrapper 
        We add a left margin to push the content past the fixed sidebar.
        The width matches the variable width defined in sidebar.module.css.
      */}
      <main className="main-layout">
        <Messaging />
      </main>

      {/* 
        Layout Styles 
        These ensure the main content sits correctly next to the sidebar
        and adapts when the sidebar hides/shrinks on mobile/tablet.
      */}
      <style jsx>{`
        .main-layout {
          flex: 1;
          margin-left: 280px; /* Matches Sidebar Desktop Width */
          height: 100%;
          width: calc(100% - 280px);
          position: relative;
          transition: margin-left 0.3s ease, width 0.3s ease;
        }

        /* Tablet Adjustment */
        @media (max-width: 1024px) {
          .main-layout {
            margin-left: 240px;
            width: calc(100% - 240px);
          }
        }

        /* Mobile Adjustment */
        @media (max-width: 768px) {
          .main-layout {
            margin-left: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}