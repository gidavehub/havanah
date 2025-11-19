'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';
import { useTheme } from '@/lib/theme-context';

export default function AgentDashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
    if (!loading && user && user.role !== 'agent') {
      router.push('/user-dashboard');
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

  if (!user || user.role !== 'agent') return null;

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
            <a href="/agent-dashboard" className="text-sm font-medium text-primary">Dashboard</a>
            <a href="/listings" className="text-sm hover:text-primary transition-colors">My Listings</a>
            <a href="/bookings" className="text-sm hover:text-primary transition-colors">Bookings</a>
            <a href="/earnings" className="text-sm hover:text-primary transition-colors">Earnings</a>
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
            Welcome back, {(user as any)?.displayName || 'Agent'}! 🎯
          </h1>
          <p className="text-text-muted-light dark:text-text-muted-dark">
            Manage your listings, bookings, and grow your business on Havanah
          </p>
        </div>

        {/* Key metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Earnings', value: '125,400 GMD', icon: '💵', change: '+12.5%' },
            { label: 'Active Listings', value: '24', icon: '📋', change: '+3' },
            { label: 'Pending Bookings', value: '8', icon: '⏳', change: '-2' },
            { label: 'Rating', value: '4.9★', icon: '⭐', change: '+0.1' },
          ].map((metric, index) => (
            <div key={index} className="card-glass p-6 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex items-start justify-between mb-2">
                <span className="text-3xl">{metric.icon}</span>
                <span className="text-xs font-semibold text-green-500">{metric.change}</span>
              </div>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-1">{metric.label}</p>
              <p className="text-2xl font-bold">{metric.value}</p>
            </div>
          ))}
        </div>

        {/* Main dashboard grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Revenue chart placeholder */}
            <div className="card-glass p-8">
              <h2 className="text-2xl font-bold mb-6">Revenue This Month</h2>
              <div className="h-64 bg-background-light/50 dark:bg-background-dark/50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl mb-2">📊</div>
                  <p className="text-text-muted-light dark:text-text-muted-dark">Revenue chart will display here</p>
                </div>
              </div>
            </div>

            {/* Recent bookings */}
            <div className="card-glass p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Recent Bookings</h2>
                <Link href="/bookings" className="text-primary text-sm font-semibold hover:text-primary-dark">
                  View All →
                </Link>
              </div>
              <div className="space-y-3">
                {[
                  { client: 'Fatou K.', service: 'Home Cleaning', price: '1,200 GMD', status: 'Completed' },
                  { client: 'Omar M.', service: 'Car Rental', price: '2,500 GMD', status: 'In Progress' },
                  { client: 'Aisatou D.', service: 'Photography', price: '3,000 GMD', status: 'Upcoming' },
                  { client: 'Isatou J.', service: 'Event Planning', price: '5,000 GMD', status: 'Pending' },
                ].map((booking, index) => (
                  <div key={index} className="p-4 rounded-lg bg-background-light/50 dark:bg-background-dark/50 flex items-center justify-between hover:bg-background-light dark:hover:bg-background-dark transition-colors cursor-pointer">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 rounded-full glass flex items-center justify-center text-lg">
                        👤
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{booking.client}</h3>
                        <p className="text-xs text-text-muted-light dark:text-text-muted-dark">{booking.service}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{booking.price}</p>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full inline-block mt-1 ${
                        booking.status === 'Completed' ? 'bg-green-500/20 text-green-600' :
                        booking.status === 'In Progress' ? 'bg-blue-500/20 text-blue-600' :
                        booking.status === 'Upcoming' ? 'bg-yellow-500/20 text-yellow-600' :
                        'bg-gray-500/20 text-gray-600'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card-glass p-8 sticky top-32">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="btn-primary w-full py-3 rounded-lg text-sm font-medium">
                  + Create Listing
                </button>
                <button className="btn-secondary w-full py-3 rounded-lg text-sm font-medium">
                  Manage Listings
                </button>
                <button className="w-full px-4 py-3 rounded-lg glass border border-border-light dark:border-border-dark hover:border-primary transition-colors text-sm font-medium">
                  View Messages
                </button>
                <button className="w-full px-4 py-3 rounded-lg glass border border-border-light dark:border-border-dark hover:border-primary transition-colors text-sm font-medium">
                  Edit Profile
                </button>
              </div>
            </div>

            <div className="card-glass p-8">
              <h3 className="text-lg font-bold mb-4">📈 Growth Tips</h3>
              <ul className="space-y-3 text-sm text-text-muted-light dark:text-text-muted-dark">
                <li className="flex gap-2">
                  <span className="text-primary flex-shrink-0">✓</span>
                  <span>Add high-quality photos to your listings</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary flex-shrink-0">✓</span>
                  <span>Respond to booking inquiries within 2 hours</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary flex-shrink-0">✓</span>
                  <span>Maintain a 4.5+ star rating</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary flex-shrink-0">✓</span>
                  <span>Update availability regularly</span>
                </li>
              </ul>
            </div>

            <div className="card-glass p-8">
              <h3 className="text-lg font-bold mb-4">🎁 Premium Plan</h3>
              <p className="text-xs text-text-muted-light dark:text-text-muted-dark mb-4">
                Upgrade to Premium for 5,000 GMD/month and unlock priority placement, analytics, and marketing tools.
              </p>
              <button className="btn-primary w-full py-2 text-sm rounded-lg">
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
