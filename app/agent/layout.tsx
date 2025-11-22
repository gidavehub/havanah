'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/app-layout';

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
