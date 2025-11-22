'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/app-layout';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
