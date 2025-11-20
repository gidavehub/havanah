'use client';

import { useAuth } from '@/lib/auth-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AppLayout from '@/components/layout/app-layout';
import UserDashboard from '@/components/dashboards/user-dashboard/user-dashboard';
import LandingPage from '@/components/landing/landing';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  // If user is logged in, show dashboard, otherwise show landing page
  if (user) {
    return (
      <AppLayout>
        <UserDashboard />
      </AppLayout>
    );
  }

  return <LandingPage />;
}
