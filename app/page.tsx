'use client';

import { useEffect, lazy, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

const LandingPage = lazy(() => import('./(landing)/page'));

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // If loading is complete, redirect authenticated users to their dashboard
    if (!loading && user) {
      if (user.role === 'agent') {
        router.push('/agent-dashboard');
      } else if (user.role === 'user') {
        router.push('/user-dashboard');
      }
    }
  }, [user, loading, router]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full glass animate-pulse">
            <span className="text-2xl font-bold text-gradient-primary">H</span>
          </div>
          <p className="text-text-muted-light dark:text-text-muted-dark">Loading...</p>
        </div>
      </div>
    );
  }

  // If authenticated, user will be redirected in useEffect
  // If not authenticated, show landing page
  if (!user) {
    return (
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full glass animate-pulse">
              <span className="text-2xl font-bold text-gradient-primary">H</span>
            </div>
            <p className="text-text-muted-light dark:text-text-muted-dark">Loading page...</p>
          </div>
        </div>
      }>
        <LandingPage />
      </Suspense>
    );
  }

  // Fallback (should not reach here as useEffect redirects authenticated users)
  return null;
}

