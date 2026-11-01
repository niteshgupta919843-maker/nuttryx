'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { 
  Lock, 
  Mail, 
  Phone, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  AlertCircle, 
  ShoppingBag,
  Sparkles,
  Loader2,
  ShieldCheck,
  Star,
  Check
} from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, login, register } = useAuth();
  const { triggerToast } = useCart();

  const redirectUrl = searchParams.get('redirect') || '/';
  const isFromAddToCart = searchParams.get('action') === 'add_to_cart';

  const modeParam = searchParams.get('mode') || searchParams.get('tab') || searchParams.get('action');
  const initialMode = (modeParam === 'register' || modeParam === 'create' || modeParam === 'signup') ? 'register' : 'login';
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Sync mode if query parameters update
  useEffect(() => {
    const currentMode = searchParams.get('mode') || searchParams.get('tab') || searchParams.get('action');
    if (currentMode === 'register' || currentMode === 'create' || currentMode === 'signup') {
      setMode('register');
    } else if (currentMode === 'login' || currentMode === 'signin') {
      setMode('login');
    }
  }, [searchParams]);

  // Login Form
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register Form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // If already logged in, redirect away immediately
  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace(redirectUrl);
    }
  }, [isAuthenticated, user, redirectUrl, router]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!loginIdentifier.trim()) {
      setErrorMsg('Please enter your email or mobile number.');
      return;
    }

    setLoading(true);
    const result = await login(loginIdentifier, loginPassword);
    setLoading(false);

    if (result.success) {
      setSuccessMsg(result.message);
      triggerToast('🎉 Welcome back to NUTTRYX!');
      setTimeout(() => {
        router.push(redirectUrl);
      }, 300);
    } else {
      setErrorMsg(result.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regName.trim() || !regEmail.trim() || !regPhone.trim() || !regPassword.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const result = await register({
      name: regName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim(),
      password: regPassword.trim()
    });
    setLoading(false);

    if (result.success) {
      setSuccessMsg(result.message);
      triggerToast('🎉 Account created! Welcome to NUTTRYX.');
      setTimeout(() => {
        router.push(redirectUrl);
      }, 300);
    } else {
      setErrorMsg(result.message || 'Registration failed. Email or phone may already exist.');
    }
  };

  return (
    <div style={{ height: '100vh', maxHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FFFFFF', overflow: 'hidden' }}>
      
      {/* ── Top Minimalist Header ── */}
      <header 
        style={{
          height: '56px',
          padding: '0 24px',
          borderBottom: '1px solid #ECE4D8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#FAF7F2',
          flexShrink: 0
        }}
      >
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div 
            style={{ 
              width: '34px', 
              height: '34px', 
              borderRadius: '50%', 
              overflow: 'hidden', 
              border: '2px solid #D9822B',
              flexShrink: 0
            }}
          >
            <img 
              src="/images/nuttryx-logo-badge.jpg" 
              alt="NUTTRYX Logo" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
          <div>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 900, color: '#20100A', letterSpacing: '0.04em' }}>
              NUTTRYX<span style={{ color: '#D9822B' }}>™</span>
            </span>
            <div style={{ fontSize: '0.58rem', color: '#736257', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Pure Peanut Butter
            </div>
          </div>
        </Link>

        <Link 
          href="/" 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '9999px',
            border: '1.5px solid #D9822B',
            color: '#20100A',
            textDecoration: 'none',
            fontSize: '0.8rem',
            fontWeight: 800,
            background: '#FFFFFF',
            transition: 'all 0.15s ease'
          }}
        >
          <ArrowLeft size={14} color="#D9822B" />
          <span>Back to Store</span>
        </Link>
      </header>

      {/* ── Split Screen Body ── */}
      <div 
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          height: 'calc(100vh - 56px)',
          overflow: 'hidden'
        }}
      >
        
        {/* ══ LEFT HERO COLUMN: Visual & Brand Showcase ══ */}
        <div 
          style={{
            background: 'linear-gradient(145deg, #24140D 0%, #361C10 50%, #170904 100%)',
            color: '#FFFFFF',
            padding: 'clamp(16px, 2.5vh, 26px) clamp(20px, 2.8vw, 36px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            height: '100%',
            boxSizing: 'border-box'
          }}
        >
          {/* Subtle Ambient Glow */}
          <div 
            style={{
              position: 'absolute',
              top: '-10%',
              left: '-10%',
              width: '360px',
              height: '360px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(217,130,43,0.25) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} 
          />

          <div>
            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '9999px',
                background: 'rgba(217,130,43,0.18)',
                border: '1px solid #D9822B',
                color: '#F7A740',
                fontSize: '0.72rem',
                fontWeight: 800,
                marginBottom: '10px'
              }}
            >
              <Sparkles size={13} />
              <span>THE CLEAN LABEL REVOLUTION</span>
            </div>

            <h1 
              style={{ 
                fontFamily: 'var(--font-heading)', 
                fontSize: 'clamp(1.45rem, 2.2vw, 2rem)', 
                fontWeight: 900, 
                lineHeight: 1.15, 
                color: '#FAF7F2',
                marginBottom: '8px' 
              }}
            >
              Fuel Your Fitness With <span style={{ color: '#D9822B' }}>Pure Peanut Butter.</span>
            </h1>

            <p style={{ color: '#D4C7BC', fontSize: '0.84rem', lineHeight: 1.48, maxWidth: '460px', marginBottom: '14px' }}>
              100% slow-roasted Gujarat bold peanuts. 30g pure plant protein, zero refined sugar, zero palm oil. Real nutrition made for athletes and busy lives.
            </p>

            {/* Featured Product Jar Showcase */}
            <div 
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1.5px solid rgba(217,130,43,0.3)',
                borderRadius: '16px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                backdropFilter: 'blur(10px)',
                maxWidth: '430px',
                marginBottom: '14px'
              }}
            >
              <div 
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: '#FFFFFF',
                  flexShrink: 0,
                  border: '1.5px solid #D9822B'
                }}
              >
                <img 
                  src="/images/dark-chocolate-peanut-butter.jpg" 
                  alt="Nuttryx Peanut Butter" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <div>
                <div style={{ fontSize: '0.94rem', fontWeight: 900, color: '#FAF7F2' }}>
                  Dark Chocolate Peanut Butter
                </div>
                <div style={{ fontSize: '0.76rem', color: '#D9822B', fontWeight: 700, margin: '1px 0 4px' }}>
                  Pure Dutch Dark Cacao • 30g Protein
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F7A740', fontSize: '0.74rem', fontWeight: 800 }}>
                  <Star size={12} fill="#F7A740" />
                  <span>4.9 / 5.0 (2,400+ Reviews)</span>
                </div>
              </div>
            </div>

            {/* Quality Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: '#EBE2D8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#2D6A4F', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={11} strokeWidth={3} />
                </div>
                <span>Fresh safety seal & complimentary batch lab report with every jar</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#2D6A4F', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={11} strokeWidth={3} />
                </div>
                <span>Free express courier shipping on orders above ₹499</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#2D6A4F', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={11} strokeWidth={3} />
                </div>
                <span>Live WhatsApp & SMS order tracking updates</span>
              </div>
            </div>
          </div>

          {/* Bottom Social Proof */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '10px', marginTop: '12px', fontSize: '0.74rem', color: '#A8998C' }}>
            Trusted by 15,000+ fitness athletes, gym goers, and families across India.
          </div>
        </div>

        {/* ══ RIGHT FORM COLUMN: Professional Auth Portal ══ */}
        <div 
          style={{
            background: '#FAF7F2',
            padding: 'clamp(10px, 2vh, 18px) clamp(16px, 2vw, 28px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            boxSizing: 'border-box',
            overflowY: 'auto'
          }}
        >
          <div 
            style={{
              width: '100%',
              maxWidth: '430px',
              background: '#FFFFFF',
              borderRadius: '20px',
              boxShadow: '0 12px 32px rgba(32, 16, 10, 0.08)',
              border: '1.5px solid #ECE4D8',
              overflow: 'hidden'
            }}
          >
            {/* Context Banner if triggered by Add to Cart */}
            {isFromAddToCart && (
              <div 
                style={{
                  background: '#24140D',
                  color: '#FFFFFF',
                  padding: '10px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  borderBottom: '2.5px solid #D9822B'
                }}
              >
                <div 
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#D9822B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <ShoppingBag size={13} color="#FFF" />
                </div>
                <span>Sign in or create a new ID to add your item to cart! 🥜</span>
              </div>
            )}

            {/* Portal Card Header */}
            <div style={{ padding: 'clamp(14px, 1.8vh, 18px) 24px 6px', textAlign: 'center' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 900, color: '#20100A', marginBottom: '3px' }}>
                {mode === 'login' ? 'Sign In to Your Account' : 'Create Your Free Account'}
              </h2>
              <p style={{ color: '#736257', fontSize: '0.8rem', margin: 0 }}>
                {mode === 'login' 
                  ? 'Access your orders, saved addresses, and express checkout' 
                  : 'Join NUTTRYX in 30 seconds for real-time tracking & perks'}
              </p>

              {/* Segmented Switcher */}
              <div 
                style={{
                  display: 'flex',
                  background: '#FAF7F2',
                  borderRadius: '10px',
                  padding: '3px',
                  marginTop: '12px',
                  border: '1px solid #E8DDCE'
                }}
              >
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: mode === 'login' ? '#20100A' : 'transparent',
                    color: mode === 'login' ? '#FFFFFF' : '#736257',
                    fontWeight: 800,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: mode === 'register' ? '#20100A' : 'transparent',
                    color: mode === 'register' ? '#FFFFFF' : '#736257',
                    fontWeight: 800,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Create New ID ✨
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div style={{ padding: '6px 24px clamp(14px, 1.8vh, 18px)' }}>
              
              {errorMsg && (
                <div 
                  style={{
                    background: '#FFEBEE',
                    border: '1px solid #FFCDD2',
                    color: '#C62828',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '10px'
                  }}
                >
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div 
                  style={{
                    background: '#E8F5E9',
                    border: '1px solid #C8E6C9',
                    color: '#2D6A4F',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '10px'
                  }}
                >
                  <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* ════ TAB 1: SIGN IN FORM ════ */}
              {mode === 'login' && (
                <form onSubmit={handleLoginSubmit}>
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#381C12', marginBottom: '4px' }}>
                      Email or Mobile Number:
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="text" 
                        placeholder="e.g. nitesh@example.com or 9876543210"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          padding: '9px 12px 9px 38px',
                          borderRadius: '8px',
                          border: '1.5px solid #E8DDCE',
                          fontSize: '0.88rem',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                      <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8A7A70' }}>
                        <Mail size={16} />
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#381C12' }}>
                        Password:
                      </label>
                      <span style={{ fontSize: '0.7rem', color: '#8A7A70' }}>
                        (Optional for quick access)
                      </span>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type={showLoginPassword ? 'text' : 'password'} 
                        placeholder="Enter your account password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '9px 38px 9px 38px',
                          borderRadius: '8px',
                          border: '1.5px solid #E8DDCE',
                          fontSize: '0.88rem',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                      <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8A7A70' }}>
                        <Lock size={16} />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: '#8A7A70',
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-accent"
                    style={{
                      width: '100%',
                      padding: '11px',
                      fontSize: '0.94rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      borderRadius: '8px',
                      cursor: loading ? 'wait' : 'pointer'
                    }}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Verifying credentials...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In to Account</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>

                  <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.8rem', color: '#736257' }}>
                    New to NUTTRYX?{' '}
                    <button
                      type="button"
                      onClick={() => { setMode('register'); setErrorMsg(''); }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#D9822B',
                        fontWeight: 800,
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        padding: 0
                      }}
                    >
                      Create a New ID
                    </button>
                  </div>
                </form>
              )}

              {/* ════ TAB 2: CREATE NEW ID (REGISTER) ════ */}
              {mode === 'register' && (
                <form onSubmit={handleRegisterSubmit}>
                  <div style={{ marginBottom: '8px' }}>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#381C12', marginBottom: '3px' }}>
                      Full Name:
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="text" 
                        placeholder="e.g. Nitesh Gupta"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          padding: '8px 12px 8px 36px',
                          borderRadius: '8px',
                          border: '1.5px solid #E8DDCE',
                          fontSize: '0.86rem',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                      <div style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#8A7A70' }}>
                        <UserIcon size={16} />
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '8px' }}>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#381C12', marginBottom: '3px' }}>
                      Mobile Number (WhatsApp tracking):
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="tel" 
                        placeholder="10-digit phone number"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          padding: '8px 12px 8px 36px',
                          borderRadius: '8px',
                          border: '1.5px solid #E8DDCE',
                          fontSize: '0.86rem',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                      <div style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#8A7A70' }}>
                        <Phone size={16} />
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '8px' }}>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#381C12', marginBottom: '3px' }}>
                      Email Address:
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="email" 
                        placeholder="e.g. nitesh@example.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          padding: '8px 12px 8px 36px',
                          borderRadius: '8px',
                          border: '1.5px solid #E8DDCE',
                          fontSize: '0.86rem',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                      <div style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#8A7A70' }}>
                        <Mail size={16} />
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#381C12', marginBottom: '3px' }}>
                      Create Password:
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type={showRegPassword ? 'text' : 'password'} 
                        placeholder="At least 6 characters"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        required
                        minLength={6}
                        style={{
                          width: '100%',
                          padding: '8px 36px 8px 36px',
                          borderRadius: '8px',
                          border: '1.5px solid #E8DDCE',
                          fontSize: '0.86rem',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                      <div style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#8A7A70' }}>
                        <Lock size={16} />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: '#8A7A70',
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        {showRegPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-accent"
                    style={{
                      width: '100%',
                      padding: '10px',
                      fontSize: '0.92rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      borderRadius: '8px',
                      cursor: loading ? 'wait' : 'pointer'
                    }}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Creating Your Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create New ID & Proceed</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>

                  <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.78rem', color: '#736257' }}>
                    Already have an ID?{' '}
                    <button
                      type="button"
                      onClick={() => { setMode('login'); setErrorMsg(''); }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#D9822B',
                        fontWeight: 800,
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        padding: 0
                      }}
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '12px', fontSize: '0.7rem', color: '#9E8C80' }}>
                <ShieldCheck size={13} color="#2D6A4F" />
                <span>256-Bit SSL Encrypted • 100% Privacy Protected</span>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#24140D' }}>
        <Loader2 size={40} className="animate-spin" color="#D9822B" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
