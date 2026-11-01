'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { Sparkles, X } from 'lucide-react';

export default function Toast() {
  const { toast, closeToast, isCartOpen } = useCart();

  // If cart drawer is open, don't show the bottom toast so it never blocks "Proceed to Checkout"
  if (!toast || isCartOpen) return null;

  return (
    <div 
      onClick={closeToast}
      role="alert"
      aria-live="polite"
      title="Click to dismiss notification"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        zIndex: 1150, // Stays visible, but under CartDrawer (zIndex 1300) so it never blocks checkout
        background: '#24140D',
        color: '#FFFFFF',
        padding: '12px 18px',
        borderRadius: 'var(--radius-full)',
        boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
        border: '1.5px solid #D9822B',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '0.88rem',
        fontWeight: 600,
        animation: 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        maxWidth: 'calc(100vw - 48px)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        userSelect: 'none'
      }}
    >
      <div 
        style={{
          width: '26px',
          height: '26px',
          borderRadius: '50%',
          background: '#D9822B',
          color: '#FFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <Sparkles size={14} />
      </div>
      <span style={{ flex: 1, whiteSpace: 'normal', lineHeight: 1.3 }}>{toast}</span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          closeToast();
        }}
        aria-label="Dismiss notification"
        style={{
          background: 'rgba(255,255,255,0.12)',
          border: 'none',
          color: '#FAF7F2',
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          padding: 0,
          flexShrink: 0,
          transition: 'background 0.15s ease'
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.25)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)'; }}
      >
        <X size={13} />
      </button>
    </div>
  );
}
