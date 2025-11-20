'use client';

import React from 'react';
import Sidebar from '@/components/layout/sidebar/sidebar';
import styles from './app-layout.module.css';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.appWrapper}>
      <Sidebar />
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
}
