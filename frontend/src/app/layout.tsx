import './globals.css';
import type { Metadata } from 'next';
import { Outfit, Plus_Jakarta_Sans, Caveat } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import AppShell from '@/components/layout/AppShell';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-heading',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-handwriting',
  display: 'swap',
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#20100A'
};

export const metadata: Metadata = {
  title: 'NUTTRYX™ | Pure Peanut Butter - Creamy, Roasted & Protein Rich',
  description: '100% slow-roasted Gujarat bold peanuts. 30g pure plant protein, zero added refined sugar, zero palm oil, 100% vegetarian. Fuel your fitness, study, and daily life.',
  keywords: [
    'peanut butter',
    'pure peanut butter',
    'high protein peanut butter',
    'dark chocolate peanut butter',
    'nuttryx',
    'clean peanut butter india',
    'zero palm oil peanut butter',
    'fitness nutrition'
  ],
  authors: [{ name: 'NUTTRYX Foods' }],
  icons: {
    icon: '/images/nuttryx-logo-badge.jpg',
    apple: '/images/nuttryx-logo-badge.jpg'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${plusJakartaSans.variable} ${caveat.variable}`}>
      <body>
        <AuthProvider>
          <CartProvider>
            <AppShell>{children}</AppShell>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
