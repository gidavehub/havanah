import React from 'react';
import NotificationsList from '@/components/notifications/notifications-list';

export const metadata = {
  title: 'Notifications | Havanah',
  description: 'View your latest updates and alerts.',
};

export default function NotificationsPage() {
  return (
    <main style={{ 
      minHeight: '100vh', 
      background: '#f9fafb',
      paddingBottom: '4rem'
    }}>
      <NotificationsList />
    </main>
  );
}