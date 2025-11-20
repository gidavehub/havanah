import React from 'react';
import UpgradeController from '@/components/upgrade/upgrade-controller';

export const metadata = {
  title: 'Upgrade to Agent | Havanah',
  description: 'Unlock professional tools for real estate and vehicle listings.',
};

export default function UpgradePage() {
  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)'
    }}>
      <UpgradeController />
    </main>
  );
}