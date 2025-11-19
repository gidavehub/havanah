'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // If loading is complete and we're on the root, redirect appropriately
    if (!loading) {
      if (!user) {
        // This page handles redirect logic only
        // The actual landing page is at (landing)/page.tsx
        // Since this is the root, we'll let Next.js handle it
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

  // Render landing page content (non-authenticated users see landing)
  // This is handled via (landing)/page.tsx route group
  return null;
}

