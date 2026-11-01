'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Lock, 
  Mail, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Check, 
  Clock, 
  Loader2, 
  AlertCircle, 
  CheckCircle2 
} from 'lucide-react';

interface ForgotPasswordFlowProps {
  forAdmin?: boolean;
  initialIdentifier?: string;
  onBackToLogin: () => void;
  onSuccess: (newPassword?: string, identifier?: string) => void;
  showStepBar?: boolean;
}

export default function ForgotPasswordFlow({
  forAdmin = false,
  initialIdentifier = '',
  onBackToLogin,
  onSuccess,
  showStepBar = true,
}: ForgotPasswordFlowProps) {
  // Current step in the 4-step wizard: 1 | 2 | 3 | 4
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [identifier, setIdentifier] = useState(initialIdentifier || (forAdmin ? 'niteshgupta919843@gmail.com' : ''));
  const [maskedEmail, setMaskedEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [resetToken, setResetToken] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & Timers
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successNotice, setSuccessNotice] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Refs for 6 OTP input boxes
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown effect for Step 2
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (step === 2 && resendTimer > 0) {
      setCanResend(false);
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (step === 2 && resendTimer === 0) {
      setCanResend(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, resendTimer]);

  // Focus first OTP input when arriving at Step 2
  useEffect(() => {
    if (step === 2) {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    }
  }, [step]);

  // Real-time password criteria
  const hasMinLength = newPassword.length >= 6;
  const hasLetter = /[A-Za-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const isPasswordValid = hasMinLength && hasLetter && hasNumber && passwordsMatch;

  // ──────────────────────────────────────────
  // 1. SEND OTP (Step 1 -> Step 2)
  // ──────────────────────────────────────────
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setSuccessNotice('');

    const cleanId = identifier.trim();
    if (!cleanId) {
      setErrorMsg('Please enter your registered email or mobile number.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: cleanId,
          forAdmin
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMaskedEmail(data.maskedEmail || data.targetEmail || cleanId);
        setStep(2);
        setResendTimer(60);
        setCanResend(false);
        setOtpDigits(['', '', '', '', '', '']);
        setSuccessNotice(data.message || 'OTP sent successfully!');
      } else {
        setErrorMsg(data.message || 'Failed to send OTP. Please check your credentials.');
      }
    } catch {
      setErrorMsg('Network error while connecting to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ──────────────────────────────────────────
  // 2. RESEND OTP
  // ──────────────────────────────────────────
  const handleResendOtp = async () => {
    if (!canResend || loading) return;
    setErrorMsg('');
    setSuccessNotice('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: identifier.trim(),
          forAdmin
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResendTimer(60);
        setCanResend(false);
        setSuccessNotice('New 6-digit OTP has been sent!');
      } else {
        setErrorMsg(data.message || 'Failed to resend OTP.');
      }
    } catch {
      setErrorMsg('Network error. Could not resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  // ──────────────────────────────────────────
  // 3. OTP INPUT MANAGEMENT (Auto-focus & Paste)
  // ──────────────────────────────────────────
  const handleOtpChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, '');
    if (!clean) {
      // Clear box
      const newDigits = [...otpDigits];
      newDigits[index] = '';
      setOtpDigits(newDigits);
      return;
    }

    if (clean.length === 1) {
      const newDigits = [...otpDigits];
      newDigits[index] = clean;
      setOtpDigits(newDigits);

      // Auto move focus to next input
      if (index < 5) {
        otpInputRefs.current[index + 1]?.focus();
      }
    } else if (clean.length > 1) {
      // Pasted multiple digits
      const digits = clean.slice(0, 6).split('');
      const newDigits = [...otpDigits];
      digits.forEach((d, i) => {
        if (i < 6) newDigits[i] = d;
      });
      setOtpDigits(newDigits);
      const focusIdx = Math.min(digits.length, 5);
      otpInputRefs.current[focusIdx]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted) {
      const newDigits = [...otpDigits];
      pasted.split('').forEach((d, i) => {
        newDigits[i] = d;
      });
      setOtpDigits(newDigits);
      const nextFocus = Math.min(pasted.length, 5);
      otpInputRefs.current[nextFocus]?.focus();
    }
  };

  // ──────────────────────────────────────────
  // 4. VERIFY OTP (Step 2 -> Step 3)
  // ──────────────────────────────────────────
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setSuccessNotice('');

    const fullOtp = otpDigits.join('');
    if (fullOtp.length < 6) {
      setErrorMsg('Please enter the complete 6-digit OTP code.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: identifier.trim(),
          otp: fullOtp,
          forAdmin
        })
      });

      const data = await res.json();
      if (res.ok && data.success && data.resetToken) {
        setResetToken(data.resetToken);
        setStep(3);
        setSuccessNotice('OTP verified successfully!');
      } else {
        setErrorMsg(data.message || 'Invalid OTP code. Please check and try again.');
      }
    } catch {
      setErrorMsg('Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ──────────────────────────────────────────
  // 5. UPDATE PASSWORD (Step 3 -> Step 4)
  // ──────────────────────────────────────────
  const handleUpdatePassword = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setSuccessNotice('');

    if (!isPasswordValid) {
      setErrorMsg('Please make sure your new password meets all security requirements.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: identifier.trim(),
          resetToken,
          newPassword,
          forAdmin
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStep(4);
        setSuccessNotice('Password reset successfully!');
      } else {
        setErrorMsg(data.message || 'Could not reset password. Please start again.');
      }
    } catch {
      setErrorMsg('Network error while resetting password.');
    } finally {
      setLoading(false);
    }
  };

  // Format seconds to mm:ss
  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ width: '100%', maxWidth: '420px', margin: '0 auto' }}>
      {/* ─────────────────────────────────────────────────────────────
          TOP STEP PROGRESS BAR (Matching reference image)
      ───────────────────────────────────────────────────────────── */}
      {showStepBar && (
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '28px',
            padding: '0 4px',
            position: 'relative'
          }}
        >
          {/* Step 1 Node */}
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div 
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: step >= 1 ? '#E5832D' : 'rgba(255,255,255,0.08)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 6px',
                fontSize: '0.82rem',
                fontWeight: 700,
                boxShadow: step === 1 ? '0 0 16px rgba(229, 131, 45, 0.6)' : 'none',
                border: step >= 1 ? '2px solid #FFA654' : '1px solid rgba(255,255,255,0.15)'
              }}
            >
              {step > 1 ? <Check size={16} strokeWidth={3} /> : '1'}
            </div>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: step >= 1 ? '#FAF7F2' : '#8A786E' }}>
              Email / Number
            </div>
            <div style={{ fontSize: '0.62rem', color: '#8A786E', display: 'none' }}>
              Enter registered details
            </div>
          </div>

          {/* Connector 1 -> 2 */}
          <div style={{ height: '2px', flex: 0.5, background: step >= 2 ? '#E5832D' : 'rgba(255,255,255,0.12)', marginBottom: '20px' }} />

          {/* Step 2 Node */}
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div 
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: step >= 2 ? '#E5832D' : 'rgba(255,255,255,0.08)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 6px',
                fontSize: '0.82rem',
                fontWeight: 700,
                boxShadow: step === 2 ? '0 0 16px rgba(229, 131, 45, 0.6)' : 'none',
                border: step >= 2 ? '2px solid #FFA654' : '1px solid rgba(255,255,255,0.15)'
              }}
            >
              {step > 2 ? <Check size={16} strokeWidth={3} /> : '2'}
            </div>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: step >= 2 ? '#FAF7F2' : '#8A786E' }}>
              OTP Verification
            </div>
          </div>

          {/* Connector 2 -> 3 */}
          <div style={{ height: '2px', flex: 0.5, background: step >= 3 ? '#E5832D' : 'rgba(255,255,255,0.12)', marginBottom: '20px' }} />

          {/* Step 3 Node */}
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div 
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: step >= 3 ? '#E5832D' : 'rgba(255,255,255,0.08)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 6px',
                fontSize: '0.82rem',
                fontWeight: 700,
                boxShadow: step === 3 ? '0 0 16px rgba(229, 131, 45, 0.6)' : 'none',
                border: step >= 3 ? '2px solid #FFA654' : '1px solid rgba(255,255,255,0.15)'
              }}
            >
              {step > 3 ? <Check size={16} strokeWidth={3} /> : '3'}
            </div>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: step >= 3 ? '#FAF7F2' : '#8A786E' }}>
              New Password
            </div>
          </div>

          {/* Connector 3 -> 4 */}
          <div style={{ height: '2px', flex: 0.5, background: step === 4 ? '#22C55E' : 'rgba(255,255,255,0.12)', marginBottom: '20px' }} />

          {/* Step 4 Node */}
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div 
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: step === 4 ? '#22C55E' : 'rgba(255,255,255,0.08)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 6px',
                fontSize: '0.82rem',
                fontWeight: 700,
                boxShadow: step === 4 ? '0 0 16px rgba(34, 197, 94, 0.6)' : 'none',
                border: step === 4 ? '2px solid #4ADE80' : '1px solid rgba(255,255,255,0.15)'
              }}
            >
              <Check size={16} strokeWidth={3} />
            </div>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: step === 4 ? '#4ADE80' : '#8A786E' }}>
              Done
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MAIN CARD CONTAINER
      ───────────────────────────────────────────────────────────── */}
      <div 
        style={{
          background: 'rgba(24, 13, 8, 0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(229, 131, 45, 0.32)',
          borderRadius: '24px',
          padding: '28px 24px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.65), 0 0 40px rgba(229, 131, 45, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
          position: 'relative',
          color: '#FAF7F2'
        }}
      >
        {/* Back to Login Pill (Steps 1, 2, 3) */}
        {step < 4 && (
          <button
            type="button"
            onClick={onBackToLogin}
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '20px',
              color: '#D4C4B5',
              padding: '6px 12px',
              fontSize: '0.75rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
              e.currentTarget.style.color = '#D4C4B5';
            }}
          >
            <ArrowLeft size={13} />
            <span>Back to Login</span>
          </button>
        )}

        {/* Top Centered Badge Icon */}
        <div style={{ textAlign: 'center', marginTop: step < 4 ? '20px' : '6px', marginBottom: '14px' }}>
          {step === 1 && (
            <div 
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'rgba(229, 131, 45, 0.12)',
                border: '1px solid rgba(229, 131, 45, 0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#E5832D',
                boxShadow: '0 0 20px rgba(229, 131, 45, 0.25)'
              }}
            >
              {/* Nuttryx leaf heart */}
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                <path d="M14 22C14 22 9 18.5 7.5 14C6 9.5 8.5 6 12 7C15.5 8 14 15 14 22Z" stroke="#E5832D" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M14 22C14 22 19 18.5 20.5 14C22 9.5 19.5 6 16 7C12.5 8 14 15 14 22Z" stroke="#E5832D" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </div>
          )}

          {step === 2 && (
            <div 
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'rgba(229, 131, 45, 0.12)',
                border: '1px solid rgba(229, 131, 45, 0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#E5832D',
                boxShadow: '0 0 20px rgba(229, 131, 45, 0.25)',
                position: 'relative'
              }}
            >
              <Mail size={22} />
              <div 
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  background: '#E5832D',
                  color: '#FFFFFF',
                  borderRadius: '4px',
                  fontSize: '8px',
                  fontWeight: 900,
                  padding: '1px 3px',
                  letterSpacing: '1px',
                  lineHeight: 1
                }}
              >
                ***
              </div>
            </div>
          )}

          {step === 3 && (
            <div 
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'rgba(229, 131, 45, 0.12)',
                border: '1px solid rgba(229, 131, 45, 0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#E5832D',
                boxShadow: '0 0 20px rgba(229, 131, 45, 0.25)'
              }}
            >
              <Lock size={22} />
            </div>
          )}

          {step === 4 && (
            <div style={{ position: 'relative', display: 'inline-block', margin: '10px 0 16px' }}>
              {/* Glowing Radial Dashes */}
              <svg width="100" height="100" viewBox="0 0 100 100" style={{ display: 'block' }}>
                {/* Radial rays */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                  <line
                    key={i}
                    x1="50"
                    y1="10"
                    x2="50"
                    y2="20"
                    stroke="#22C55E"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    transform={`rotate(${angle} 50 50)`}
                    opacity="0.8"
                  />
                ))}
                {/* Center Circle */}
                <circle cx="50" cy="50" r="28" fill="#22C55E" />
                {/* Checkmark */}
                <path
                  d="M40 50 L47 57 L61 43"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Global Error Banner */}
        {errorMsg && (
          <div 
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#FCA5A5',
              padding: '9px 12px',
              borderRadius: '12px',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
              textAlign: 'left'
            }}
          >
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Global Success Banner */}
        {successNotice && step < 4 && (
          <div 
            style={{
              background: 'rgba(34, 197, 94, 0.12)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              color: '#86EFAC',
              padding: '9px 12px',
              borderRadius: '12px',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
              textAlign: 'left'
            }}
          >
            <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
            <span>{successNotice}</span>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════
            STEP 1: EMAIL / NUMBER
        ═════════════════════════════════════════════════════════════ */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#E5832D', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '2px' }}>
              NUTTRYX
            </div>
            <div style={{ fontSize: '0.74rem', color: '#8A786E', marginBottom: '14px' }}>
              Healthy Nutrition, Better You
            </div>

            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 6px', color: '#FFFFFF' }}>
              Forgot Password?
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#A8988C', margin: '0 auto 22px', maxWidth: '300px', lineHeight: 1.45 }}>
              Enter your registered email or mobile number and we&apos;ll send you an OTP to reset your password.
            </p>

            <div style={{ position: 'relative', marginBottom: '18px' }}>
              <input
                type="text"
                placeholder="Email or Mobile Number"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  borderRadius: '12px',
                  padding: '13px 14px 13px 42px',
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#E5832D'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.14)'}
              />
              <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#8A786E' }}>
                <Mail size={17} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #FF7A1A 0%, #E55B00 100%)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '13px 20px',
                fontSize: '0.92rem',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 8px 24px rgba(229, 91, 0, 0.35)',
                transition: 'transform 0.15s ease'
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  <span>Sending OTP...</span>
                </>
              ) : (
                <span>Send OTP</span>
              )}
            </button>

            <div style={{ marginTop: '20px', fontSize: '0.82rem', color: '#A8988C' }}>
              Remember your password?{' '}
              <button
                type="button"
                onClick={onBackToLogin}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#E5832D',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'none'
                }}
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* ═════════════════════════════════════════════════════════════
            STEP 2: OTP VERIFICATION
        ═════════════════════════════════════════════════════════════ */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 6px', color: '#FFFFFF' }}>
              Enter OTP
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#A8988C', margin: '0 auto 20px', maxWidth: '300px', lineHeight: 1.45 }}>
              We&apos;ve sent a 6-digit OTP to <br />
              <strong style={{ color: '#FAF7F2' }}>{maskedEmail || identifier}</strong>
            </p>

            {/* 6 Digit Input Boxes */}
            <div 
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '18px'
              }}
            >
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => { otpInputRefs.current[idx] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  onPaste={idx === 0 ? handleOtpPaste : undefined}
                  style={{
                    width: '44px',
                    height: '52px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: digit ? '2px solid #E5832D' : '1px solid rgba(255, 255, 255, 0.16)',
                    borderRadius: '10px',
                    textAlign: 'center',
                    color: '#FFFFFF',
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    outline: 'none',
                    boxShadow: digit ? '0 0 12px rgba(229, 131, 45, 0.35)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#E5832D'}
                  onBlur={(e) => {
                    if (!digit) e.target.style.borderColor = 'rgba(255, 255, 255, 0.16)';
                  }}
                />
              ))}
            </div>

            {/* Countdown Timer / Resend Row */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: '0.82rem',
                color: '#A8988C',
                marginBottom: '22px'
              }}
            >
              <Clock size={14} color="#E5832D" />
              {resendTimer > 0 ? (
                <span>Resend OTP in <strong style={{ color: '#FAF7F2' }}>{formatTimer(resendTimer)}</strong></span>
              ) : (
                <span>
                  Didn&apos;t receive code?{' '}
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#E5832D',
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Resend OTP
                  </button>
                </span>
              )}
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading || otpDigits.join('').length < 6}
              style={{
                width: '100%',
                background: otpDigits.join('').length === 6 
                  ? 'linear-gradient(135deg, #FF7A1A 0%, #E55B00 100%)' 
                  : 'rgba(229, 131, 45, 0.4)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '13px 20px',
                fontSize: '0.92rem',
                fontWeight: 700,
                cursor: (loading || otpDigits.join('').length < 6) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: otpDigits.join('').length === 6 ? '0 8px 24px rgba(229, 91, 0, 0.35)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  <span>Verifying OTP...</span>
                </>
              ) : (
                <span>Verify OTP</span>
              )}
            </button>
          </form>
        )}

        {/* ═════════════════════════════════════════════════════════════
            STEP 3: NEW PASSWORD
        ═════════════════════════════════════════════════════════════ */}
        {step === 3 && (
          <form onSubmit={handleUpdatePassword} style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 6px', color: '#FFFFFF' }}>
              Create New Password
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#A8988C', margin: '0 auto 20px', maxWidth: '300px', lineHeight: 1.45 }}>
              Set a new secure password for your account.
            </p>

            {/* New Password Field */}
            <div style={{ position: 'relative', marginBottom: '14px' }}>
              <input
                type={showNewPassword ? 'text' : 'password'}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  borderRadius: '12px',
                  padding: '13px 42px 13px 42px',
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#E5832D'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.14)'}
              />
              <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#8A786E' }}>
                <Lock size={17} />
              </div>
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
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
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Confirm Password Field */}
            <div style={{ position: 'relative', marginBottom: '18px' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  borderRadius: '12px',
                  padding: '13px 42px 13px 42px',
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#E5832D'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.14)'}
              />
              <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#8A786E' }}>
                <Lock size={17} />
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Password Criteria Checklist (Matching screenshot) */}
            <div 
              style={{
                background: 'rgba(0, 0, 0, 0.25)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '12px 14px',
                marginBottom: '20px',
                textAlign: 'left'
              }}
            >
              {/* Criterion 1 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', marginBottom: '6px' }}>
                <div 
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: hasMinLength ? '#22C55E' : 'rgba(255,255,255,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    flexShrink: 0
                  }}
                >
                  <Check size={10} strokeWidth={3} />
                </div>
                <span style={{ color: hasMinLength ? '#86EFAC' : '#8A786E' }}>
                  Minimum 6 characters
                </span>
              </div>

              {/* Criterion 2 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', marginBottom: '6px' }}>
                <div 
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: hasLetter ? '#22C55E' : 'rgba(255,255,255,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    flexShrink: 0
                  }}
                >
                  <Check size={10} strokeWidth={3} />
                </div>
                <span style={{ color: hasLetter ? '#86EFAC' : '#8A786E' }}>
                  At least one letter (A–Z)
                </span>
              </div>

              {/* Criterion 3 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', marginBottom: confirmPassword ? '6px' : 0 }}>
                <div 
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: hasNumber ? '#22C55E' : 'rgba(255,255,255,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    flexShrink: 0
                  }}
                >
                  <Check size={10} strokeWidth={3} />
                </div>
                <span style={{ color: hasNumber ? '#86EFAC' : '#8A786E' }}>
                  At least one number (0–9)
                </span>
              </div>

              {/* Passwords Match */}
              {confirmPassword && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem' }}>
                  <div 
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      background: passwordsMatch ? '#22C55E' : 'rgba(239, 68, 68, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      flexShrink: 0
                    }}
                  >
                    <Check size={10} strokeWidth={3} />
                  </div>
                  <span style={{ color: passwordsMatch ? '#86EFAC' : '#FCA5A5' }}>
                    {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                  </span>
                </div>
              )}
            </div>

            {/* Update Password Button */}
            <button
              type="submit"
              disabled={loading || !isPasswordValid}
              style={{
                width: '100%',
                background: isPasswordValid 
                  ? 'linear-gradient(135deg, #FF7A1A 0%, #E55B00 100%)' 
                  : 'rgba(229, 131, 45, 0.4)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '13px 20px',
                fontSize: '0.92rem',
                fontWeight: 700,
                cursor: (loading || !isPasswordValid) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: isPasswordValid ? '0 8px 24px rgba(229, 91, 0, 0.35)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <span>Update Password</span>
              )}
            </button>
          </form>
        )}

        {/* ═════════════════════════════════════════════════════════════
            STEP 4: DONE (Success Screen)
        ═════════════════════════════════════════════════════════════ */}
        {step === 4 && (
          <div style={{ textAlign: 'center', padding: '10px 4px 14px' }}>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 8px', color: '#FFFFFF' }}>
              Password Reset Successful!
            </h2>
            <p style={{ fontSize: '0.86rem', color: '#A8988C', margin: '0 auto 28px', maxWidth: '300px', lineHeight: 1.5 }}>
              Your password has been updated successfully.
            </p>

            <button
              type="button"
              onClick={() => onSuccess(newPassword, identifier.trim())}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #FF7A1A 0%, #E55B00 100%)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '13px 20px',
                fontSize: '0.92rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(229, 91, 0, 0.35)'
              }}
            >
              Sign In to Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

