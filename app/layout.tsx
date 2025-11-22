import type { Metadata } from 'next';
import './globals.css';
import ToastProvider from '@/components/toast/toast';

export const metadata: Metadata = {
  title: 'Havanah - Premium Real Estate & Vehicle Rentals',
  description: 'Your gateway to premium real estate and vehicle rentals. Rent or buy properties and vehicles with ease.',
  icons: {
    icon: '/logo.jpg',
  },
  openGraph: {
    title: 'Havanah',
    description: 'Premium Real Estate & Vehicle Rentals',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
