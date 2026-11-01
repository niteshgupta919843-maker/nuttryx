'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { 
  ShieldCheck, 
  Sparkles, 
  Send, 
  PhoneCall, 
  Mail, 
  MapPin, 
  Heart
} from 'lucide-react';

export interface StoreSettings {
  companyName: string;
  factoryAddress: string;
  googleMapsUrl: string;
  supportPhone: string;
  supportHours: string;
  supportEmail: string;
  fssaiNumber: string;
  instagramUrl: string;
  facebookUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
  whatsappNumber: string;
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  companyName: 'NUTTRYX Foods Pvt Ltd',
  factoryAddress: 'NUTTRYX Foods Pvt Ltd, GIDC Agro Park, Rajkot - Saurashtra, Gujarat 360003',
  googleMapsUrl: 'https://maps.google.com/?q=GIDC+Agro+Park+Rajkot+Gujarat+360003',
  supportPhone: '+91 98765 43210',
  supportHours: '(Mon - Sat, 10am - 7pm)',
  supportEmail: 'care@nuttryx.com',
  fssaiNumber: '11524999000123',
  instagramUrl: 'https://instagram.com',
  facebookUrl: 'https://facebook.com',
  twitterUrl: 'https://twitter.com',
  youtubeUrl: 'https://youtube.com',
  whatsappNumber: '+91 98765 43210'
};

export default function Footer() {
  const { triggerToast } = useCart();
  const [email, setEmail] = useState('');
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const timestamp = Date.now();
        let res = await fetch(`/api/settings?_t=${timestamp}`, { cache: 'no-store' });
        if (!res.ok) {
          res = await fetch(`http://localhost:5000/api/settings?_t=${timestamp}`, { cache: 'no-store' });
        }
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setSettings(prev => ({
              ...prev,
              ...json.data
            }));
          }
        }
      } catch {
        // fallback to default
      }
    };

    fetchSettings();
    const interval = setInterval(fetchSettings, 10000);
    const onFocus = () => fetchSettings();
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'nuttryx_settings_updated') fetchSettings();
    };
    const onCustom = () => fetchSettings();

    window.addEventListener('focus', onFocus);
    window.addEventListener('storage', onStorage);
    window.addEventListener('nuttryx_settings_updated', onCustom);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('nuttryx_settings_updated', onCustom);
    };
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    triggerToast('🎉 Welcome to the NUTTRYX Club! Your 15% discount coupon has been sent.');
    setEmail('');
  };

  return (
    <footer id="contact" style={{ background: '#1A0D07', color: '#D5C4B8', borderTop: '2px solid rgba(217, 130, 43, 0.25)', paddingTop: '64px', paddingBottom: '32px' }}>
      <div className="container">
        
        {/* Top Newsletter & Club Bar */}
        <div 
          style={{
            background: 'linear-gradient(135deg, #2D180F 0%, #20100A 100%)',
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(24px, 4vw, 36px) clamp(18px, 4vw, 40px)',
            border: '1px solid rgba(217, 130, 43, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px',
            marginBottom: '60px'
          }}
        >
          <div style={{ maxWidth: '480px' }}>
            <span 
              style={{
                background: 'rgba(217, 130, 43, 0.2)',
                color: '#FFD199',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '8px'
              }}
            >
              <Sparkles size={12} color="#D9822B" /> Join the Clean Nutrition Club
            </span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FAF7F2' }}>
              Get 15% Off Your First Order
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#BBAAA0', marginTop: '4px' }}>
              Subscribe to get secret VIP drops, high-protein recipes, and fitness nutritional advice.
            </p>
          </div>

          <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '8px', width: '100%', maxWidth: '420px', flexWrap: 'wrap' }}>
            <input 
              type="email" 
              required
              placeholder="Enter your email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                flex: '1 1 200px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(232, 221, 206, 0.3)',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#FFFFFF',
                outline: 'none',
                fontSize: '0.9rem'
              }}
            />
            <button 
              type="submit" 
              className="btn btn-accent"
              style={{ padding: '12px 24px', whiteSpace: 'nowrap', flexShrink: 0 }}
            >
              <Send size={15} /> Claim 15%
            </button>
          </form>
        </div>

        {/* Main Footer Links Columns */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '40px',
            marginBottom: '48px'
          }}
        >
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div 
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid #D9822B'
                }}
              >
                <Image 
                  src="/images/nuttryx-logo-badge.jpg" 
                  alt="NUTTRYX Logo" 
                  width={44} 
                  height={44} 
                  style={{ objectFit: 'cover' }} 
                />
              </div>
              <div>
                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FAF7F2', letterSpacing: '0.04em' }}>
                  NUTTRYX
                </span>
                <div style={{ fontSize: '0.66rem', color: '#D9822B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Pure Peanut Butter
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.86rem', lineHeight: 1.6, color: '#A89689', marginBottom: '16px' }}>
              Crafted in small batches from 100% slow-roasted Saurashtra bold peanuts. 
              Zero hydrogenated palm oil, zero added refined sugars, pure plant protein.
            </p>

            {/* Social links */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {[
                { 
                  name: 'Instagram', 
                  href: settings.instagramUrl || 'https://instagram.com', 
                  svg: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                  ) 
                },
                { 
                  name: 'Facebook', 
                  href: settings.facebookUrl || 'https://facebook.com', 
                  svg: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                  ) 
                },
                { 
                  name: 'Twitter', 
                  href: settings.twitterUrl || 'https://twitter.com', 
                  svg: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                    </svg>
                  ) 
                },
                { 
                  name: 'YouTube', 
                  href: settings.youtubeUrl || 'https://youtube.com', 
                  svg: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
                      <polygon points="10 15 15 12 10 9 10 15"/>
                    </svg>
                  ) 
                }
              ].map((s, idx) => (
                <a
                  key={idx}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.06)',
                    color: '#FFD199',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#D9822B';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                    e.currentTarget.style.color = '#FFD199';
                  }}
                >
                  {s.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FAF7F2', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
              Our Flavours
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', padding: 0, margin: 0 }}>
              <li>
                <Link href="/track" style={{ transition: 'color 0.2s', color: '#FFD199', fontWeight: 700, textDecoration: 'none' }}>
                  🚚 Live Order Tracking
                </Link>
              </li>
              <li>
                <Link href="/#products" style={{ transition: 'color 0.2s', color: '#D5C4B8', textDecoration: 'none' }}>
                  🍫 Dark Chocolate Peanut Butter
                </Link>
              </li>
              <li>
                <Link href="/#products" style={{ transition: 'color 0.2s', color: '#D5C4B8', textDecoration: 'none' }}>
                  🥜 Crunchy Roasted Peanut Butter
                </Link>
              </li>
              <li>
                <Link href="/#products" style={{ transition: 'color 0.2s', color: '#D5C4B8', textDecoration: 'none' }}>
                  ✨ Natural Creamy Peanut Butter
                </Link>
              </li>
              <li>
                <Link href="/#products" style={{ transition: 'color 0.2s', color: '#D5C4B8', textDecoration: 'none' }}>
                  🎁 Discovery Trio Bundle Box
                </Link>
              </li>
              <li>
                <Link href="/#nutrition" style={{ transition: 'color 0.2s', color: '#D5C4B8', textDecoration: 'none' }}>
                  📊 Daily Protein Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Sourcing & Transparency */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FAF7F2', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
              Purity & Standards
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', padding: 0, margin: 0 }}>
              <li>
                <Link href="/#why-nuttryx" style={{ transition: 'color 0.2s', color: '#D5C4B8', textDecoration: 'none' }}>
                  Zero Palm Oil Certification
                </Link>
              </li>
              <li>
                <Link href="/#why-nuttryx" style={{ transition: 'color 0.2s', color: '#D5C4B8', textDecoration: 'none' }}>
                  NABL Accredited Lab Reports
                </Link>
              </li>
              <li>
                <Link href="/#why-nuttryx" style={{ transition: 'color 0.2s', color: '#D5C4B8', textDecoration: 'none' }}>
                  Aflatoxin Testing Standards
                </Link>
              </li>
              <li>
                <Link href="/#story" style={{ transition: 'color 0.2s', color: '#D5C4B8', textDecoration: 'none' }}>
                  Direct Farmer Fair Trade
                </Link>
              </li>
              <li>
                <Link href="/#faq" style={{ transition: 'color 0.2s', color: '#D5C4B8', textDecoration: 'none' }}>
                  Natural Oil Separation Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details (Dynamic from MongoDB Admin Settings) */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FAF7F2', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
              Factory & Support
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.86rem' }}>
              {/* Factory Address link to Google Maps */}
              <a 
                href={settings.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(settings.factoryAddress)}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Open factory location on Google Maps"
                style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '10px', 
                  color: '#D5C4B8', 
                  textDecoration: 'none', 
                  transition: 'all 0.2s ease',
                  lineHeight: 1.45
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#FFD199';
                  e.currentTarget.style.transform = 'translateX(2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#D5C4B8';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <MapPin size={17} color="#D9822B" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{settings.factoryAddress}</span>
              </a>

              {/* Phone call link */}
              <a 
                href={`tel:${settings.supportPhone.replace(/[^\d+]/g, '')}`}
                title="Call Nuttryx Customer Support"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  color: '#D5C4B8', 
                  textDecoration: 'none', 
                  transition: 'all 0.2s ease' 
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#FFD199';
                  e.currentTarget.style.transform = 'translateX(2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#D5C4B8';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <PhoneCall size={16} color="#D9822B" style={{ flexShrink: 0 }} />
                <span>{settings.supportPhone} <span style={{ color: '#9E8B7F', fontSize: '0.78rem' }}>{settings.supportHours}</span></span>
              </a>

              {/* Support Email link */}
              <a 
                href={`mailto:${settings.supportEmail}`}
                title="Email Nuttryx Support Team"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  color: '#D5C4B8', 
                  textDecoration: 'none', 
                  transition: 'all 0.2s ease' 
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#FFD199';
                  e.currentTarget.style.transform = 'translateX(2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#D5C4B8';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <Mail size={16} color="#D9822B" style={{ flexShrink: 0 }} />
                <span>{settings.supportEmail}</span>
              </a>

              {/* FSSAI Registration badge */}
              <div 
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  color: '#10B981', 
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  background: 'rgba(16, 185, 129, 0.08)',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  width: 'fit-content'
                }}
              >
                <ShieldCheck size={16} color="#10B981" />
                <span>FSSAI Lic. No: {settings.fssaiNumber}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Verified Badges */}
        <div 
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '0.78rem',
            color: '#8A7A70'
          }}
        >
          <div>
            © {new Date().getFullYear()} {settings.companyName || 'NUTTRYX™ Foods Private Limited'}. All Rights Reserved. Made with <Heart size={12} color="#E53E3E" style={{ display: 'inline' }} /> in India.
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <span>⚡ UPI Accepted</span>
            <span>🔒 256-Bit SSL Encrypted</span>
            <span>🌱 100% Pure Veg</span>
            <span>🚚 India-wide Express Delivery</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
