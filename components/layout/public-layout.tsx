'use client';

import React from 'react';
import Navbar from '@/components/layout/navbar/navbar';
import styles from './public-layout.module.css';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.publicWrapper}>
      <Navbar />
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
}
