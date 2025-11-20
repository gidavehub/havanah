import React from 'react';
import UserProfile from '@/components/profile/profile';

export const metadata = {
  title: 'My Profile | Havanah',
  description: 'Manage your account settings and profile information.',
};

export default function AccountPage() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#f9fafb',
      paddingBottom: '4rem'
    }}>
      <UserProfile />
    </main>
  );
}