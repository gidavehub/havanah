'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';
import { useTheme } from '@/lib/theme-context';

export default function UserDashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full glass animate-pulse">
            <span className="text-2xl font-bold text-gradient-primary">H</span>
          </div>
          <p className="text-text-muted-light dark:text-text-muted-dark">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className={`min-h-screen bg-background-light dark:bg-background-dark transition-colors ${theme === 'dark' ? 'dark-mode' : ''}`}>
      {/* Navigation */}
      <nav className="glass backdrop-blur-md border-b border-border-light dark:border-border-dark sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full glass flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">H</span>
            </div>
            <span className="font-bold text-lg text-gradient-primary hidden sm:inline">Havanah</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <a href="/user-dashboard" className="text-sm font-medium text-primary">Dashboard</a>
            <a href="/bookings" className="text-sm hover:text-primary transition-colors">My Bookings</a>
            <a href="/messages" className="text-sm hover:text-primary transition-colors">Messages</a>
            <a href="/profile" className="text-sm hover:text-primary transition-colors">Profile</a>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg glass hover:bg-background-light/50 dark:hover:bg-background-dark/50 transition-colors"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button
              onClick={() => {
                signOut().then(() => router.push('/'));
              }}
              className="btn-secondary px-4 py-2 text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 text-gradient-primary">
            Welcome back, {(user as any)?.displayName || (user as any)?.email?.split('@')[0] || 'Guest'}! 👋
          </h1>
          <p className="text-text-muted-light dark:text-text-muted-dark">
            Browse and manage your services, bookings, and messages
          </p>
        </div>

        {/* Quick stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Active Bookings', value: '3', icon: '📅' },
            { label: 'Saved Items', value: '12', icon: '❤️' },
            { label: 'Total Spent', value: '5,250 GMD', icon: '💰' },
            { label: 'Reviews', value: '4.8★', icon: '⭐' },
          ].map((stat, index) => (
            <div key={index} className="card-glass p-6 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="text-4xl mb-3">{stat.icon}</div>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-1">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Featured section */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="card-glass p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">Recommended for You</h2>
              <div className="grid gap-4">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="p-4 rounded-lg border border-border-light dark:border-border-dark hover:border-primary hover:bg-background-light/50 dark:hover:bg-background-dark/50 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg glass flex items-center justify-center text-2xl">
                        🏠
                      </div>
                      <div>
                        <h3 className="font-semibold group-hover:text-primary transition-colors">Property Service #{item}</h3>
                        <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                          Professional cleaning • 4.8★ (234 reviews)
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gradient-primary">1,200 GMD</p>
                      <button className="btn-primary px-3 py-1 text-sm mt-2">Book</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-glass p-8">
              <h2 className="text-2xl font-bold mb-4">Recent Bookings</h2>
              <div className="space-y-4">
                {[
                  { name: 'Home Cleaning', status: 'Completed', date: 'Dec 15, 2024' },
                  { name: 'Car Rental', status: 'In Progress', date: 'Dec 20, 2024' },
                  { name: 'Photography', status: 'Upcoming', date: 'Dec 25, 2024' },
                ].map((booking, index) => (
                  <div key={index} className="p-4 rounded-lg bg-background-light/50 dark:bg-background-dark/50 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{booking.name}</h3>
                      <p className="text-xs text-text-muted-light dark:text-text-muted-dark">{booking.date}</p>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      booking.status === 'Completed' ? 'bg-green-500/20 text-green-600' :
                      booking.status === 'In Progress' ? 'bg-blue-500/20 text-blue-600' :
                      'bg-yellow-500/20 text-yellow-600'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="card-glass p-8 sticky top-32">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="btn-primary w-full py-3 rounded-lg text-sm font-medium">
                  Browse Services
                </button>
                <button className="btn-secondary w-full py-3 rounded-lg text-sm font-medium">
                  View Messages
                </button>
                <button className="w-full px-4 py-3 rounded-lg glass border border-border-light dark:border-border-dark hover:border-primary transition-colors text-sm font-medium">
                  Edit Profile
                </button>
                <button className="w-full px-4 py-3 rounded-lg glass border border-border-light dark:border-border-dark hover:border-primary transition-colors text-sm font-medium">
                  Settings
                </button>
              </div>

              <div className="mt-8 pt-8 border-t border-border-light dark:border-border-dark">
                <h3 className="text-sm font-semibold mb-4">Upgrade to Premium</h3>
                <p className="text-xs text-text-muted-light dark:text-text-muted-dark mb-4">
                  Get unlimited bookings and priority support for 2,500 GMD/month
                </p>
                <button className="btn-primary w-full py-2 text-sm rounded-lg">
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
