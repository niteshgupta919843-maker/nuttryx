'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithGoogle } = useAuth();
  const { triggerToast } = useCart();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      setStatus('error');
      setErrorMsg(`Google authorization was cancelled or denied: ${error}`);
      return;
    }

    if (!code) {
      setStatus('error');
      setErrorMsg('No authorization code received from Google.');
      return;
    }

    const processOAuth = async () => {
      try {
        const result = await loginWithGoogle({ code });
        if (result.success) {
          setStatus('success');
          triggerToast('🎉 Successfully signed in with Google!');
          setTimeout(() => {
            router.replace('/');
          }, 600);
        } else {
          setStatus('error');
          setErrorMsg(result.message || 'Google sign-in failed. Please try again.');
        }
      } catch (err: any) {
        setStatus('error');
        setErrorMsg(err.message || 'An unexpected error occurred during Google sign-in.');
      }
    };

    processOAuth();
  }, [searchParams, loginWithGoogle, router, triggerToast]);

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: '#120703',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        color: '#FAF7F2',
        fontFamily: 'inherit'
      }}
    >
      <div 
        style={{
          background: 'rgba(26, 14, 8, 0.9)',
          border: '1px solid rgba(229, 131, 45, 0.3)',
          borderRadius: '24px',
          padding: '36px 32px',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
        }}
      >
        {status === 'loading' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
              <div 
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <Loader2 size={32} className="animate-spin" color="#E5832D" />
              </div>
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0 0 8px' }}>
              Signing in with Google...
            </h2>
            <p style={{ fontSize: '0.86rem', color: '#A8988C', margin: 0 }}>
              Please wait while we verify your Google account credentials.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
              <CheckCircle size={54} color="#22C55E" />
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0 0 8px', color: '#4ADE80' }}>
              Welcome to NUTTRYX!
            </h2>
            <p style={{ fontSize: '0.86rem', color: '#A8988C', margin: 0 }}>
              Google Sign-In verified. Redirecting to your store...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
              <AlertCircle size={54} color="#EF4444" />
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0 0 8px', color: '#F87171' }}>
              Sign-In Failed
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#D4C4B5', margin: '0 0 20px', lineHeight: 1.45 }}>
              {errorMsg}
            </p>
            <button
              onClick={() => router.replace('/login')}
              style={{
                background: '#E5832D',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Back to Sign In
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#120703' }}>
        <Loader2 size={36} className="animate-spin" color="#E5832D" />
      </div>
    }>
      <GoogleCallbackContent />
    </Suspense>
  );
}

