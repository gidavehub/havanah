import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In / Sign Up - HAVANA',
  description: 'Sign in to your account or create a new one',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
