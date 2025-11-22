'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/app-layout';

export default function ListingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
