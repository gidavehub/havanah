'use client';

import React from 'react';
import PublicLayout from '@/components/layout/public-layout';

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicLayout>{children}</PublicLayout>;
}
