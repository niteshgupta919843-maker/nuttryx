'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Toast from '@/components/ui/Toast';
import { usePathname } from 'next/navigation';

// Code-split heavy interactive modals out of the initial critical rendering path
const CartDrawer = dynamic(() => import('@/components/modals/CartDrawer'), { ssr: false });
const QuickViewModal = dynamic(() => import('@/components/modals/QuickViewModal'), { ssr: false });
const SampleModal = dynamic(() => import('@/components/modals/SampleModal'), { ssr: false });
const CheckoutModal = dynamic(() => import('@/components/modals/CheckoutModal'), { ssr: false });
const AuthModal = dynamic(() => import('@/components/modals/AuthModal'), { ssr: false });

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const isLoginPage = pathname?.startsWith('/login');

  if (isAdmin || isLoginPage) {
    // Dedicated full-screen portal without cluttered store headers/footers
    return (
      <main style={{ width: '100vw', minHeight: '100vh' }}>
        {children}
        <Toast />
      </main>
    );
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <CartDrawer />
      <QuickViewModal />
      <SampleModal />
      <CheckoutModal />
      <AuthModal />
      <Toast />
    </>
  );
}
