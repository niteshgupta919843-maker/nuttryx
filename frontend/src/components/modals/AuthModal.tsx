'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Check, 
  AlertCircle,
  Sparkles
} from 'lucide-react';

export default function AuthModal() {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authMode, 
    setAuthMode, 
    authPromptMessage,
    login, 
    register 
  } = useAuth();

  // Form states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register extra fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Dedicated full /login page is used exclusively across the app (no popup modal)
  return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMsg('Please enter your email or mobile number.');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    const res = await login(identifier, password);
    setLoading(false);
    if (!res.success) {
      setErrorMsg(res.message);
    } else {
      setSuccessMsg(res.message);
      setTimeout(() => {
        setSuccessMsg('');
      }, 1500);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !regPassword.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMsg('Password should be at least 6 characters.');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    const res = await register({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password: regPassword.trim()
    });
    setLoading(false);
    if (!res.success) {
      setErrorMsg(res.message);
    } else {
      setSuccessMsg(res.message);
      setTimeout(() => {
        setSuccessMsg('');
      }, 1500);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1150,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(20, 10, 5, 0.75)',
        backdropFilter: 'blur(6px)',
        padding: '20px',
        animation: 'fadeIn 0.2s ease'
      }}
      onClick={closeAuthModal}
    >
      <div 
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '460px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
          position: 'relative',
          border: '1.5px solid #E8DDCE'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header Banner */}
        <div 
          style={{
            background: 'linear-gradient(135deg, #24120A 0%, #361B0E 100%)',
            color: '#FFFFFF',
            padding: '26px 28px 20px',
            position: 'relative'
          }}
        >
          {/* Close button */}
          <button
            onClick={closeAuthModal}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.12)',
              color: '#FAF7F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: 'none'
            }}
          >
            <X size={17} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', overflow: 'hidden' }}>
              <Image src="/images/nuttryx-logo-badge.jpg" alt="NUTTRYX" width={38} height={38} style={{ objectFit: 'cover' }} />
            </div>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '0.04em', lineHeight: 1 }}>NUTTRYX</div>
              <div style={{ fontSize: '0.65rem', color: '#FFD199', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Member Access</div>
            </div>
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FAF7F2', margin: '4px 0' }}>
            {authMode === 'login' ? 'Welcome Back!' : 'Join the Clean Nutrition Club'}
          </h3>

          <p style={{ fontSize: '0.8rem', color: '#D5C4B8', lineHeight: 1.4 }}>
            {authPromptMessage || (authMode === 'login' 
              ? 'Access your orders, track shipments & manage delivery addresses.' 
              : 'Create your Nuttryx account and earn 15% discount on all orders.')}
          </p>
        </div>

        {/* Tab Switcher: Sign In vs Create Account */}
        <div style={{ display: 'flex', borderBottom: '1px solid #ECE4D8', background: '#FAF7F2' }}>
          <button
            type="button"
            onClick={() => { setAuthMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: authMode === 'login' ? '#FFFFFF' : 'transparent',
              color: authMode === 'login' ? '#20100A' : '#736257',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              borderBottom: authMode === 'login' ? '2.5px solid #20100A' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: authMode === 'register' ? '#FFFFFF' : 'transparent',
              color: authMode === 'register' ? '#20100A' : '#736257',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              borderBottom: authMode === 'register' ? '2.5px solid #20100A' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Create Account
          </button>
        </div>

        {/* Body Container */}
        <div style={{ padding: '24px 28px' }}>
          
          {/* Error Alert */}
          {errorMsg && (
            <div 
              style={{
                background: '#FFF5F5',
                border: '1px solid #FEB2B2',
                borderRadius: '10px',
                padding: '10px 14px',
                fontSize: '0.82rem',
                color: '#C53030',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px'
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Alert */}
          {successMsg && (
            <div 
              style={{
                background: '#E6F4EA',
                border: '1px solid #A8DAB5',
                borderRadius: '10px',
                padding: '10px 14px',
                fontSize: '0.82rem',
                color: '#137333',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px'
              }}
            >
              <Check size={16} style={{ flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ── Mode 1: Sign In ── */}
          {authMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#5C4A3E', marginBottom: '5px' }}>
                  Email Address or Mobile Number:
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#8A7669" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="text"
                    required
                    placeholder="e.g. niteshgupta@gmail.com or 9198430000"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      borderRadius: '10px',
                      border: '1px solid #E8DDCE',
                      fontSize: '0.88rem',
                      outline: 'none',
                      color: '#20100A'
                    }}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#5C4A3E' }}>
                    Password:
                  </label>
                  <span style={{ fontSize: '0.72rem', color: '#D9822B', cursor: 'pointer', fontWeight: 600 }}>
                    Forgot password?
                  </span>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#8A7669" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your account password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 38px 10px 38px',
                      borderRadius: '10px',
                      border: '1px solid #E8DDCE',
                      fontSize: '0.88rem',
                      outline: 'none',
                      color: '#20100A'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#8A7669',
                      cursor: 'pointer'
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: '8px',
                  padding: '13px',
                  borderRadius: '9999px',
                  background: '#20100A',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(32, 16, 10, 0.25)',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{loading ? 'Verifying Account...' : 'Sign In to Nuttryx'}</span>
                <ArrowRight size={16} />
              </button>

              <div style={{ textAlign: 'center', fontSize: '0.78rem', color: '#736257', marginTop: '6px' }}>
                Don&apos;t have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  style={{ color: '#D9822B', fontWeight: 800, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Create free account
                </button>
              </div>
            </form>
          ) : (
            /* ── Mode 2: Create Account ── */
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#5C4A3E', marginBottom: '4px' }}>
                  Full Name *:
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={15} color="#8A7669" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Nitesh Gupta"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: '8px', border: '1px solid #E8DDCE', fontSize: '0.86rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#5C4A3E', marginBottom: '4px' }}>
                  Mobile Number (for Order Tracking) *:
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={15} color="#8A7669" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: '8px', border: '1px solid #E8DDCE', fontSize: '0.86rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#5C4A3E', marginBottom: '4px' }}>
                  Email Address *:
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} color="#8A7669" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="email"
                    required
                    placeholder="e.g. nitesh@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: '8px', border: '1px solid #E8DDCE', fontSize: '0.86rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#5C4A3E', marginBottom: '4px' }}>
                  Create Password (min 6 chars) *:
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} color="#8A7669" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Choose a secure password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    style={{ width: '100%', padding: '9px 36px 9px 36px', borderRadius: '8px', border: '1px solid #E8DDCE', fontSize: '0.86rem', outline: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#8A7669', cursor: 'pointer' }}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: '10px',
                  padding: '13px',
                  borderRadius: '9999px',
                  background: '#D9822B',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(217, 130, 43, 0.35)',
                  transition: 'all 0.15s ease'
                }}
              >
                <Sparkles size={16} />
                <span>{loading ? 'Creating Account...' : 'Create Account & Join Club'}</span>
              </button>

              <div style={{ textAlign: 'center', fontSize: '0.78rem', color: '#736257', marginTop: '6px' }}>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  style={{ color: '#20100A', fontWeight: 800, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Sign in here
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}

