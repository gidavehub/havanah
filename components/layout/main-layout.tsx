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

  // 0. Initialize Auth on Mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // 1. Define Route Groups
  const isAuthPage = pathname?.startsWith('/auth');
  
  // Routes that use the Sidebar (Dashboard, Messaging, etc.)
  const isSidebarRoute = 
    pathname?.startsWith('/agent') ||
    pathname?.startsWith('/user') ||
    pathname?.startsWith('/messaging') ||
    pathname?.startsWith('/connections') ||
    pathname?.startsWith('/account') || 
    pathname?.startsWith('/upgrade');

  // Check specifically for messaging to alter layout behavior
  const isMessagingPage = pathname?.startsWith('/messaging');

  // 2. Auth Protection Logic
  useEffect(() => {
    if (!loading) {
      if (isSidebarRoute && !user) {
        router.push('/auth?redirect=' + pathname);
      }
      if (isAuthPage && user) {
        router.push('/explore');
      }
    }
  }, [user, loading, isSidebarRoute, isAuthPage, router, pathname]);

  // 3. Loading State
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-gray-500 font-medium animate-pulse">Loading Havanah...</p>
        </div>
      </div>
    );
  }

  // 4. Render Logic

  // CASE A: Auth Pages
  if (isAuthPage) {
    return (
      <ToastProvider>
        <GlobalNotificationListener />
        {children}
      </ToastProvider>
    );
  }

  // CASE B: Private/Dashboard Pages - Sidebar + Content Area
  if (isSidebarRoute) {
    return (
      <ToastProvider>
        <GlobalNotificationListener />
        
        {/* Container is explicitly relative to allow absolute/fixed positioning of children */}
        <div className="relative w-full h-full bg-gray-50">
          
          <Sidebar />
          
          <main 
            className={`
              transition-all duration-300
              ${isMessagingPage 
                ? // MESSAGING LAYOUT: FIXED POSITIONING (No Scrolling on Body)
                  // Mobile: Fixed top, left, right. Bottom stops at 80px (height of mobile nav).
                  // Desktop: Fixed top, right, bottom. Left starts at 280px (width of sidebar).
                  'fixed top-0 right-0 left-0 bottom-[80px] lg:left-[280px] lg:bottom-0 z-0 overflow-hidden bg-[#f0f2f5]'
                
                : // STANDARD LAYOUT: FLOW POSITIONING (Normal Scrolling)
                  'flex-1 min-h-screen ml-0 lg:ml-[280px] pb-24 lg:pb-0'
              }
            `}
          >
            {children}
          </main>
        </div>
      </ToastProvider>
    );
  }

  // CASE C: Public Pages
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