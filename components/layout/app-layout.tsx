'use client';

import React from 'react';
import Navbar from '@/components/layout/navbar/navbar';
import Sidebar from '@/components/layout/sidebar/sidebar';
import styles from './app-layout.module.css';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.dashboardWrapper}>
      <Navbar />
      <div className={styles.dashboardContainer}>
        <Sidebar />
        <main className={styles.mainContent}>{children}</main>
      </div>
    </div>
  );
}

