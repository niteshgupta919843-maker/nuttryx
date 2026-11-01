'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
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
  ArrowLeft,
  ArrowRight,
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Check,
  Dumbbell,
  Leaf,
  Zap,
  X
} from 'lucide-react';
import ForgotPasswordFlow from '@/components/auth/ForgotPasswordFlow';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, login, register } = useAuth();
  const { triggerToast } = useCart();

  const redirectUrl = searchParams.get('redirect') || '/';

  const modeParam = searchParams.get('mode') || searchParams.get('tab') || searchParams.get('action');
  const initialMode = (modeParam === 'register' || modeParam === 'create' || modeParam === 'signup') ? 'register' : modeParam === 'forgot' ? 'forgot' : 'login';
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);

  // Sync mode if query parameters update
  useEffect(() => {
    const currentMode = searchParams.get('mode') || searchParams.get('tab') || searchParams.get('action');
    if (currentMode === 'register' || currentMode === 'create' || currentMode === 'signup') {
      setMode('register');
    } else if (currentMode === 'forgot' || currentMode === 'reset') {
      setMode('forgot');
    } else if (currentMode === 'login' || currentMode === 'signin') {
      setMode('login');
    }
  }, [searchParams]);

  // Login Form
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register Form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Forgot Password Form
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);

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

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!forgotIdentifier.trim()) {
      setErrorMsg('Please enter your registered email or mobile number.');
      return;
    }
    if (!forgotNewPassword) {
      setErrorMsg('Please enter a new password.');
      return;
    }
    if (forgotNewPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter carefully.');
      return;
    }

    setLoading(true);
    try {
      let res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: forgotIdentifier.trim(),
          newPassword: forgotNewPassword
        })
      });
      if (!res.ok) {
        res = await fetch('http://localhost:5000/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identifier: forgotIdentifier.trim(),
            newPassword: forgotNewPassword
          })
        });
      }
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg('✓ Password updated successfully! Redirecting to sign in...');
        triggerToast('✓ Password updated! Please sign in with your new password.');
        setLoginIdentifier(forgotIdentifier.trim());
        setLoginPassword('');
        setForgotNewPassword('');
        setForgotConfirmPassword('');
        setTimeout(() => {
          setMode('login');
          setSuccessMsg('✓ Password changed. Enter your new password to sign in.');
        }, 1500);
      } else {
        setErrorMsg(data.message || 'Could not reset password. Please verify your details.');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <style>{`
        /* ── Base Container Styles ── */
        .login-page-container {
          min-height: 100vh;
          min-height: 100dvh;
          width: 100%;
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          background: #110704;
          overflow-x: hidden;
          box-sizing: border-box;
          font-family: inherit;
        }

        /* 🖥️ Desktop Left Hero Showcase (matching Image 1) */
        .desktop-hero-showcase {
          position: relative;
          height: 100vh;
          min-height: 100%;
          background: #170B06 url('/images/login-desktop-clean-backdrop.jpg') no-repeat center right / cover;
          overflow: hidden;
          display: flex;
          align-items: center;
          box-sizing: border-box;
        }

        .desktop-hero-content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 48px clamp(32px, 4vw, 56px);
          max-width: 540px;
          box-sizing: border-box;
        }

        .hero-shop-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 13px 32px;
          border-radius: 9999px;
          background: linear-gradient(135deg, #F58428 0%, #D86613 100%);
          color: #FFFFFF;
          font-weight: 700;
          font-size: 1rem;
          text-decoration: none;
          box-shadow: 0 6px 22px rgba(229, 131, 45, 0.45);
          transition: all 0.2s ease;
        }
        .hero-shop-btn:hover {
          filter: brightness(1.08);
          transform: translateY(-2px);
          box-shadow: 0 8px 26px rgba(229, 131, 45, 0.6);
        }

        /* 📱 Right Form Pane (Desktop & Mobile) */
        .login-form-pane {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px 20px;
          background: #110704;
          background: radial-gradient(ellipse at 50% 35%, #1F0F09 0%, #100603 100%);
          position: relative;
          overflow-y: auto;
          box-sizing: border-box;
        }

        /* ── The Luxury Glass-Tempered Authentication Card ── */
        .dark-auth-card {
          width: 100%;
          max-width: 410px;
          background: linear-gradient(145deg, rgba(34, 16, 9, 0.78) 0%, rgba(18, 8, 4, 0.84) 100%);
          backdrop-filter: blur(24px) saturate(190%);
          -webkit-backdrop-filter: blur(24px) saturate(190%);
          border-radius: 28px;
          border: 1.5px solid rgba(229, 131, 45, 0.35);
          border-top: 1.5px solid rgba(255, 255, 255, 0.25);
          box-shadow: 0 24px 64px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.2), 0 0 45px rgba(229, 131, 45, 0.1);
          padding: clamp(24px, 3.5vh, 32px) clamp(20px, 3vw, 26px);
          box-sizing: border-box;
          text-align: center;
          position: relative;
          margin: auto;
        }

        .login-back-button {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #A8988C;
          text-decoration: none;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.14);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          transition: all 0.2s ease;
        }
        .login-back-button:hover {
          color: #FFFFFF;
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(229, 131, 45, 0.4);
          transform: translateX(-2px);
        }

        .dark-auth-input-group {
          position: relative;
          margin-bottom: 13px;
          text-align: left;
        }

        .dark-auth-input {
          width: 100%;
          height: 48px;
          padding: 0 16px 0 42px;
          background: rgba(255, 255, 255, 0.06);
          border: 1.5px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-radius: 12px;
          color: #FFFFFF;
          font-size: 0.9rem;
          outline: none;
          box-sizing: border-box;
          transition: all 0.2s ease;
        }
        .dark-auth-input::placeholder {
          color: #8C7B71;
          font-size: 0.86rem;
        }
        .dark-auth-input:focus {
          border-color: #E5832D;
          background: rgba(255, 255, 255, 0.1);
          box-shadow: 0 0 0 3.5px rgba(229, 131, 45, 0.25);
        }

        /* ── Chrome/Safari Autofill Dark Fix ── */
        .dark-auth-input:-webkit-autofill,
        .dark-auth-input:-webkit-autofill:hover, 
        .dark-auth-input:-webkit-autofill:focus, 
        .dark-auth-input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px #24130C inset !important;
          -webkit-text-fill-color: #FFFFFF !important;
          caret-color: #FFFFFF !important;
          border-color: rgba(229, 131, 45, 0.45) !important;
          transition: background-color 5000s ease-in-out 0s;
        }

        .dark-auth-btn-primary {
          width: 100%;
          height: 48px;
          background: linear-gradient(180deg, #F58428 0%, #D86613 100%);
          color: #FFFFFF;
          font-size: 0.98rem;
          font-weight: 700;
          letter-spacing: 0.01em;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 6px 22px rgba(229, 131, 45, 0.45);
          transition: all 0.2s ease;
          margin-top: 6px;
        }
        .dark-auth-btn-primary:hover:not(:disabled) {
          filter: brightness(1.06);
          box-shadow: 0 8px 26px rgba(229, 131, 45, 0.58);
          transform: translateY(-1px);
        }
        .dark-auth-btn-primary:active:not(:disabled) {
          transform: translateY(0);
        }

        /* Custom Checkbox */
        .dark-checkbox-wrap {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          user-select: none;
        }
        .dark-checkbox-box {
          width: 17px;
          height: 17px;
          border-radius: 4px;
          border: 1.5px solid rgba(255, 255, 255, 0.26);
          background: rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }
        .dark-checkbox-box.checked {
          background: #E5832D;
          border-color: #E5832D;
        }

        /* 📱 Mobile & Tablet View (matching Image 2) */
        @media (max-width: 1023px) {
          .login-page-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            min-height: 100dvh;
            background: url('/images/login-mobile-clean-final-hd.jpg?v=2') no-repeat center top / cover, #110704;
            padding: 24px 16px;
            box-sizing: border-box;
          }
          .desktop-hero-showcase {
            display: none !important;
          }
          .login-form-pane {
            background: transparent !important;
            padding: 0;
            width: 100%;
            min-height: auto;
          }
          .dark-auth-card {
            backdrop-filter: blur(26px) saturate(190%) !important;
            -webkit-backdrop-filter: blur(26px) saturate(190%) !important;
            background: linear-gradient(145deg, rgba(34, 16, 9, 0.78) 0%, rgba(18, 8, 4, 0.84) 100%) !important;
            box-shadow: 0 24px 64px rgba(0, 0, 0, 0.82), inset 0 1px 1px rgba(255, 255, 255, 0.22), 0 0 45px rgba(229, 131, 45, 0.15) !important;
            border: 1.5px solid rgba(229, 131, 45, 0.35) !important;
            border-top: 1.5px solid rgba(255, 255, 255, 0.28) !important;
            border-radius: 28px !important;
            padding: 24px 20px 22px !important;
            max-width: 390px !important;
          }
        }
      `}</style>

      {/* ══ LEFT HERO SHOWCASE (Desktop View Only - Real Crisp Typography over Product Backdrop) ══ */}
      <div className="desktop-hero-showcase">
        
        {/* Top Brand Logo */}
        <Link 
          href="/" 
          style={{ 
            position: 'absolute', 
            top: '36px', 
            left: 'clamp(32px, 4vw, 56px)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            textDecoration: 'none',
            zIndex: 3
          }}
        >
          <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
            <path d="M14 22C14 22 9 18.5 7.5 14C6 9.5 8.5 6 12 7C15.5 8 14 15 14 22Z" stroke="#E5832D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 22C14 22 19 18.5 20.5 14C22 9.5 19.5 6 16 7C12.5 8 14 15 14 22Z" stroke="#E5832D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '0.06em', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
              NUTTRYX
            </div>
            <div style={{ fontSize: '0.74rem', color: '#B3A295', fontWeight: 500, marginTop: '3px' }}>
              Healthy Nutrition, Better You
            </div>
          </div>
        </Link>

        {/* Center Content Block */}
        <div className="desktop-hero-content">
          
          {/* New Launch Pill Badge */}
          <div>
            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 14px',
                borderRadius: '9999px',
                border: '1px solid rgba(229, 131, 45, 0.45)',
                background: 'rgba(229, 131, 45, 0.12)',
                color: '#F58428',
                fontSize: '0.82rem',
                fontWeight: 700,
                marginBottom: '16px'
              }}
            >
              <span>🔥</span>
              <span>New Launch</span>
            </div>
          </div>

          {/* Heading with Curved Underline */}
          <h1 
            style={{ 
              fontFamily: 'var(--font-heading)', 
              fontSize: 'clamp(2.4rem, 3.4vw, 3.6rem)', 
              fontWeight: 900, 
              lineHeight: 1.1, 
              color: '#FFFFFF', 
              margin: '0 0 14px' 
            }}
          >
            NUTTRYX <br />
            <span style={{ color: '#E5832D', position: 'relative', display: 'inline-block' }}>
              Peanut Butter
              {/* Decorative Underline matching artwork */}
              <svg 
                style={{ position: 'absolute', bottom: '-8px', left: 0, width: '100%', height: '10px' }} 
                viewBox="0 0 200 10" 
                fill="none"
              >
                <path d="M2 7C50 2 150 2 198 7" stroke="#E5832D" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          {/* Tagline */}
          <p style={{ color: '#C9BDB3', fontSize: '1.02rem', fontWeight: 500, margin: '0 0 26px', letterSpacing: '0.01em' }}>
            High Protein • No Added Sugar • Great Taste
          </p>

          {/* 3 Feature Icons Row */}
          <div style={{ display: 'flex', gap: '22px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', textAlign: 'center' }}>
              <div 
                style={{ 
                  width: '46px', 
                  height: '46px', 
                  borderRadius: '50%', 
                  border: '1.5px solid rgba(229, 131, 45, 0.35)', 
                  background: 'rgba(229, 131, 45, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}
              >
                <Dumbbell size={20} color="#E5832D" />
              </div>
              <span style={{ fontSize: '0.78rem', color: '#D4C6BC', fontWeight: 600, maxWidth: '64px', lineHeight: 1.3 }}>
                Rich in Protein
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', textAlign: 'center' }}>
              <div 
                style={{ 
                  width: '46px', 
                  height: '46px', 
                  borderRadius: '50%', 
                  border: '1.5px solid rgba(229, 131, 45, 0.35)', 
                  background: 'rgba(229, 131, 45, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}
              >
                <Leaf size={20} color="#E5832D" />
              </div>
              <span style={{ fontSize: '0.78rem', color: '#D4C6BC', fontWeight: 600, maxWidth: '64px', lineHeight: 1.3 }}>
                No Added Sugar
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', textAlign: 'center' }}>
              <div 
                style={{ 
                  width: '46px', 
                  height: '46px', 
                  borderRadius: '50%', 
                  border: '1.5px solid rgba(229, 131, 45, 0.35)', 
                  background: 'rgba(229, 131, 45, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}
              >
                <Zap size={20} color="#E5832D" />
              </div>
              <span style={{ fontSize: '0.78rem', color: '#D4C6BC', fontWeight: 600, maxWidth: '72px', lineHeight: 1.3 }}>
                Long Lasting Energy
              </span>
            </div>
          </div>

          {/* CTA Shop Now Button */}
          <div>
            <Link href="/shop" className="hero-shop-btn">
              <span>Shop Now</span>
              <ArrowRight size={17} />
            </Link>
          </div>

          {/* Carousel Dots Indicator */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '36px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E5832D' }} />
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.25)' }} />
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.25)' }} />
          </div>

        </div>

      </div>

      {/* ══ RIGHT FORM PANE (Desktop & Mobile) ══ */}
      <div className="login-form-pane">
        
        {mode === 'forgot' ? (
          <ForgotPasswordFlow 
            forAdmin={false}
            initialIdentifier={loginIdentifier}
            onBackToLogin={() => {
              setMode('login');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            onSuccess={(newPass, id) => {
              if (id) setLoginIdentifier(id);
              if (newPass) setLoginPassword(newPass);
              setMode('login');
              setSuccessMsg('✓ Password reset successfully! You can now sign in.');
              triggerToast('✓ Password updated! Please sign in with your new password.');
            }}
          />
        ) : (
          /* ── THE LUXURY DARK AUTHENTICATION CARD ── */
          <div className="dark-auth-card">

          {/* Top Back to Store inside Card */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '12px' }}>
            <Link href="/" className="login-back-button">
              <ArrowLeft size={13} color="#E5832D" />
              <span>Back to Store</span>
            </Link>
          </div>

          {/* Top Sprout Icon Badge */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
            <div 
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'rgba(229, 131, 45, 0.09)',
                border: '1.5px solid rgba(229, 131, 45, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 18px rgba(229, 131, 45, 0.18)'
              }}
            >
              <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
                <path 
                  d="M14 22C14 22 9 18.5 7.5 14C6 9.5 8.5 6 12 7C15.5 8 14 15 14 22Z" 
                  stroke="#E5832D" 
                  strokeWidth="1.9" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M14 22C14 22 19 18.5 20.5 14C22 9.5 19.5 6 16 7C12.5 8 14 15 14 22Z" 
                  stroke="#E5832D" 
                  strokeWidth="1.9" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Brand Name & Tagline */}
          <h1 
            style={{
              color: '#FFFFFF',
              fontSize: '1.4rem',
              fontWeight: 900,
              letterSpacing: '0.08em',
              margin: '0 0 4px',
              fontFamily: 'var(--font-heading)'
            }}
          >
            NUTTRYX
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{ height: '1px', width: '28px', background: 'rgba(255, 255, 255, 0.14)' }} />
            <span style={{ fontSize: '0.76rem', color: '#9E8F85', fontWeight: 500, letterSpacing: '0.02em' }}>
              Healthy Nutrition, Better You
            </span>
            <div style={{ height: '1px', width: '28px', background: 'rgba(255, 255, 255, 0.14)' }} />
          </div>

          {/* Header Title & Subtitle */}
          <h2 
            style={{
              color: '#FFFFFF',
              fontSize: '1.6rem',
              fontWeight: 800,
              margin: '0 0 6px',
              letterSpacing: '-0.01em'
            }}
          >
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>

          <p 
            style={{
              color: '#A8988C',
              fontSize: '0.82rem',
              lineHeight: 1.45,
              margin: '0 auto 18px',
              maxWidth: '300px'
            }}
          >
            {mode === 'login' 
              ? 'Sign in to your account to continue shopping, track orders and more.'
              : 'Sign up today to earn rewards, track orders and enjoy fast checkout.'
            }
          </p>

          {/* Sample Claim Prompt Banner */}
          {redirectUrl.includes('sample') && (
            <div
              style={{
                background: 'rgba(229, 131, 45, 0.15)',
                border: '1.5px solid rgba(229, 131, 45, 0.45)',
                borderRadius: '14px',
                padding: '11px 14px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>🎁</span>
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#FFFFFF' }}>Claim 50g Sample Pack</div>
                <div style={{ fontSize: '0.74rem', color: '#D4C6BC', marginTop: '2px' }}>
                  Please sign in or create an account to get your sample delivered.
                </div>
              </div>
            </div>
          )}

          {/* Alert Notifications */}
          {errorMsg && (
            <div 
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#FCA5A5',
                padding: '9px 12px',
                borderRadius: '10px',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '14px',
                textAlign: 'left'
              }}
            >
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div 
              style={{
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#6EE7B7',
                padding: '9px 12px',
                borderRadius: '10px',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '14px',
                textAlign: 'left'
              }}
            >
              <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ════ TAB 1: SIGN IN FORM ════ */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit}>
              
              {/* Identifier Input */}
              <div className="dark-auth-input-group">
                <input 
                  id="login-id-field"
                  type="text"
                  placeholder="Email or Mobile Number"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  required
                  className="dark-auth-input"
                />
                <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#8A786E' }}>
                  <Mail size={16} />
                </div>
              </div>

              {/* Password Input */}
              <div className="dark-auth-input-group">
                <input 
                  type={showLoginPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="dark-auth-input"
                  style={{ paddingRight: '40px' }}
                />
                <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#8A786E' }}>
                  <Lock size={16} />
                </div>
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#8A786E',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Remember Me & Forgot Password Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '12px 2px 18px' }}>
                <div 
                  className="dark-checkbox-wrap"
                  onClick={() => setRememberMe(!rememberMe)}
                >
                  <div className={`dark-checkbox-box ${rememberMe ? 'checked' : ''}`}>
                    {rememberMe && <Check size={11} color="#FFFFFF" strokeWidth={3} />}
                  </div>
                  <span style={{ fontSize: '0.82rem', color: '#A8988C' }}>Remember me</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot');
                    setErrorMsg('');
                    setSuccessMsg('');
                    setForgotIdentifier(loginIdentifier);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#E5832D',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  Forgot Password?
                </button>
              </div>

              {/* Primary Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="dark-auth-btn-primary"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>

              {/* Footer Prompt */}
              <div style={{ marginTop: '20px', fontSize: '0.84rem', color: '#A8988C' }}>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#E5832D',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  Sign Up
                </button>
              </div>
            </form>
          )}

          {/* ════ TAB 2: CREATE ACCOUNT (SIGN UP) ════ */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit}>
              <div className="dark-auth-input-group">
                <input 
                  type="text"
                  placeholder="Full Name"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                  className="dark-auth-input"
                />
                <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#8A786E' }}>
                  <UserIcon size={16} />
                </div>
              </div>

              <div className="dark-auth-input-group">
                <input 
                  type="email"
                  placeholder="Email Address"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                  className="dark-auth-input"
                />
                <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#8A786E' }}>
                  <Mail size={16} />
                </div>
              </div>

              <div className="dark-auth-input-group">
                <input 
                  type="tel"
                  placeholder="Mobile Number (e.g. 9876543210)"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  required
                  className="dark-auth-input"
                />
                <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#8A786E' }}>
                  <Phone size={16} />
                </div>
              </div>

              <div className="dark-auth-input-group">
                <input 
                  type={showRegPassword ? 'text' : 'password'}
                  placeholder="Create Password (min. 6 characters)"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                  minLength={6}
                  className="dark-auth-input"
                  style={{ paddingRight: '40px' }}
                />
                <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#8A786E' }}>
                  <Lock size={16} />
                </div>
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#8A786E',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  {showRegPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Primary Sign Up Button */}
              <button
                type="submit"
                disabled={loading}
                className="dark-auth-btn-primary"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>Sign Up</span>
                )}
              </button>

              {/* Footer Prompt */}
              <div style={{ marginTop: '20px', fontSize: '0.84rem', color: '#A8988C' }}>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#E5832D',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

          </div>
        )}
      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#120703' }}>
        <Loader2 size={40} className="animate-spin" color="#E5832D" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
