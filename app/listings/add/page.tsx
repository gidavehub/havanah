import React from 'react';
import AddListingForm from '@/components/listings/add/add';

export const metadata = {
  title: 'Add New Listing | Havanah Agent Portal',
  description: 'Create a new property or vehicle listing.',
};

export default function AddListingPage() {
  return (
    <main style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f0fdf4 0%, #fffbeb 50%, #f0f9ff 100%)',
      paddingBottom: '4rem'
    }}>
      <AddListingForm />
    </main>
  );
}