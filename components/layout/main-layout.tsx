'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-store';
import Navbar from '@/components/layout/navbar/navbar';
import Sidebar from '@/components/layout/sidebar/sidebar'; 
import { ToastProvider } from '@/components/toast/toast';
import GlobalNotificationListener from '@/components/messaging/GlobalNotificationListener';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, initializeAuth } = useAuth();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Route Definitions
  const isAuthPage = pathname?.startsWith('/auth');
  const isSidebarRoute = 
    pathname?.startsWith('/agent') ||
    pathname?.startsWith('/user') ||
    pathname?.startsWith('/messaging') ||
    pathname?.startsWith('/connections') ||
    pathname?.startsWith('/account') || 
    pathname?.startsWith('/upgrade');

  const isMessagingPage = pathname?.startsWith('/messaging');

  // Auth Protection
  useEffect(() => {
    if (!loading) {
      if (isSidebarRoute && !user) router.push('/auth?redirect=' + pathname);
      if (isAuthPage && user) router.push('/explore');
    }
  }, [user, loading, isSidebarRoute, isAuthPage, router, pathname]);

  if (loading) {
    return (
      <div className="h-[100dvh] w-full flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-emerald-500 rounded-full animate-spin border-t-transparent" />
      </div>
    );
  }

  // --- 1. AUTH LAYOUT ---
  if (isAuthPage) {
    return (
      <ToastProvider>
        <GlobalNotificationListener />
        {children}
      </ToastProvider>
    );
  }

  // --- 2. MESSAGING LAYOUT (Special Fixed Layout) ---
  // This completely separates messaging from the normal dashboard flow to prevent scrolling issues.
  if (isSidebarRoute && isMessagingPage) {
    return (
      <ToastProvider>
        <GlobalNotificationListener />
        {/* Outer Shell: Fixed to viewport, no scrolling on body */}
        <div className="fixed inset-0 z-0 flex bg-gray-50 overflow-hidden h-[100dvh]">
          
          {/* Desktop Sidebar (Fixed Width) */}
          <div className="hidden lg:block w-[280px] h-full flex-shrink-0">
             <Sidebar />
          </div>

          {/* Main Content Area */}
          <main className="flex-1 relative flex flex-col h-full overflow-hidden bg-[#f0f2f5]">
            {/* The children (MessagingPage) will fill this 100% */}
            <div className="flex-1 relative h-full w-full">
               {children}
            </div>

            {/* Mobile Bottom Nav Spacer 
                This invisible block pushes the bottom of the chat UP so it doesn't hide behind the mobile nav.
                We use 'h-[70px]' to match your Bottom Nav height roughly.
            */}
            <div className="lg:hidden h-[70px] flex-shrink-0 bg-transparent pointer-events-none" />
          </main>
          
          {/* Mobile Sidebar (Fixed on top of everything at bottom) */}
          <div className="lg:hidden">
             <Sidebar />
          </div>
        </div>
      </ToastProvider>
    );
  }

  // --- 3. STANDARD DASHBOARD LAYOUT (Normal Scrolling) ---
  if (isSidebarRoute) {
    return (
      <ToastProvider>
        <GlobalNotificationListener />
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />
          {/* Standard padding for normal pages */}
          <main className="flex-1 ml-0 lg:ml-[280px] pb-24 lg:pb-0 min-w-0">
            {children}
          </main>
        </div>
      </ToastProvider>
    );
  }

  // --- 4. PUBLIC LAYOUT ---
  return (
    <ToastProvider>
      <GlobalNotificationListener />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 pt-[80px]">
          {children}
        </main>
      </div>
    </ToastProvider>
  );
}