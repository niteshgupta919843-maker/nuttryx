'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { 
  ShoppingCart, 
  Search, 
  User as UserIcon, 
  Menu, 
  X,
  LogOut,
  PackageCheck,
  Shield,
  BookOpen,
  Truck,
  CheckCircle,
  Clock,
  Sparkles,
  LogIn,
  UserPlus
} from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const { cartCount, setIsCartOpen, openSampleModal, triggerToast } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('home');

  // Utility Modals
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [trackInput, setTrackInput] = useState('');
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackResult, setTrackResult] = useState<any | null>(null);
  const [trackError, setTrackError] = useState('');

  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);

  const accountRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { label: 'Home', href: '/', id: 'home' },
    { label: 'Shop', href: '/shop', id: 'shop' },
    { label: 'Our Story', href: '/#story', id: 'story' },
    { label: 'Benefits', href: '/#why-nuttryx', id: 'why-nuttryx' },
    { label: 'Nutrition', href: '/#nutrition', id: 'nutrition' },
    { label: 'Reviews', href: '/#reviews', id: 'reviews' },
    { label: 'FAQ', href: '/#faq', id: 'faq' },
  ];

  // Active section scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (let i = navLinks.length - 1; i >= 0; i--) {
        const el = document.getElementById(navLinks[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(navLinks[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close account dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = trackInput.trim();
    if (!clean) {
      setTrackError('Please enter your Order ID (e.g. NUTX-458898) or Phone Number.');
      return;
    }
    setTrackError('');
    setTrackLoading(true);
    try {
      let res = await fetch(`/api/orders/track/${encodeURIComponent(clean)}`, { cache: 'no-store' });
      if (!res.ok) {
        res = await fetch(`http://localhost:5000/api/orders/track/${encodeURIComponent(clean)}`, { cache: 'no-store' });
      }
      const json = await res.json();
      if (json.success && json.data) {
        setTrackResult(json.data);
      } else {
        setTrackResult(null);
        setTrackError(json.message || `No order found for "${clean}". Please verify your Order ID or phone number.`);
      }
    } catch {
      setTrackError('Could not reach tracking server. Please check your internet connection.');
    } finally {
      setTrackLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    window.location.href = `/shop?q=${encodeURIComponent(searchQuery.trim())}`;
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, width: '100%', background: '#FFFFFF' }}>
      
      {/* ── Top Utility Announcement Bar ── */}
      <div 
        style={{
          background: '#20100A',
          color: '#FAF7F2',
          fontSize: '0.78rem',
          padding: '7px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          {/* Left Offers */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span>🚚</span>
              <span>Free Shipping on Orders Above <strong>₹499</strong></span>
            </span>
            <span style={{ opacity: 0.35 }}>|</span>
            <button
              onClick={openSampleModal}
              style={{
                background: 'none',
                border: 'none',
                color: '#FAF7F2',
                cursor: 'pointer',
                fontSize: '0.78rem',
                padding: 0,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>🎁</span>
              <span>Want to Taste First? <strong style={{ textDecoration: 'underline', color: '#FFD199' }}>Book Free Sample</strong></span>
            </button>
          </div>

          {/* Right Help Links */}
          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '18px', opacity: 0.85, fontSize: '0.76rem' }}>
            <button 
              onClick={openSampleModal}
              style={{ background: 'none', border: 'none', color: '#FFD199', cursor: 'pointer', fontSize: '0.76rem', padding: 0, fontWeight: 700 }}
            >
              🎁 Book Sample
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Navigation Bar ── */}
      <nav
        style={{
          background: '#FAF7F2',
          borderBottom: '1px solid #ECE4D8',
          padding: '12px 0'
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          
          {/* Brand Logo */}
          <a href="#home" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div 
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                overflow: 'hidden',
                flexShrink: 0
              }}
            >
              <Image 
                src="/images/nuttryx-logo-badge.jpg" 
                alt="NUTTRYX Pure Peanut Butter" 
                width={46} 
                height={46} 
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                priority
              />
            </div>
            <div>
              <div style={{ 
                fontFamily: 'var(--font-heading)', 
                fontWeight: 900, 
                fontSize: '1.45rem', 
                letterSpacing: '0.04em',
                color: '#20100A',
                lineHeight: 1
              }}>
                NUTTRYX<span style={{ fontSize: '0.6rem', verticalAlign: 'super', marginLeft: '2px' }}>TM</span>
              </div>
              <span style={{ 
                display: 'block', 
                fontSize: '0.62rem', 
                fontWeight: 700, 
                letterSpacing: '0.12em', 
                color: '#736257',
                textTransform: 'uppercase',
                marginTop: '1px'
              }}>
                — Pure Peanut Butter —
              </span>
            </div>
          </a>

          {/* Center Navigation Links */}
          <div className="hide-tablet" style={{ display: 'flex', alignItems: 'center', gap: '26px' }}>
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setActiveSection(link.id)}
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.92rem',
                    fontWeight: isActive ? 800 : 600,
                    color: isActive ? '#20100A' : '#5C4A3E',
                    textDecoration: 'none',
                    paddingBottom: '3px',
                    borderBottom: isActive ? '2px solid #20100A' : '2px solid transparent',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          {/* Right Action Icons (Search, User, Cart) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="hide-mobile" style={{ position: 'relative', width: '210px' }}>
              <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9E8C80' }} />
              <input 
                type="text" 
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 34px 7px 32px',
                  borderRadius: '9999px',
                  border: '1px solid #E4DACD',
                  backgroundColor: '#FFFFFF',
                  fontSize: '0.82rem',
                  outline: 'none',
                  color: '#20100A'
                }}
              />
              <button 
                type="submit"
                style={{
                  position: 'absolute',
                  right: '3px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#20100A',
                  color: '#FFFFFF',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <Search size={11} />
              </button>
            </form>

            {/* Account Icon / Dropdown */}
            <div ref={accountRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                style={{
                  background: isAuthenticated ? '#EFE6DC' : accountMenuOpen ? '#F3ECE2' : 'transparent',
                  color: '#20100A',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  padding: isAuthenticated ? '5px 12px' : '6px',
                  borderRadius: '9999px',
                  border: isAuthenticated ? '1px solid #DFD2C4' : accountMenuOpen ? '1px solid #E0D5C7' : 'none',
                  transition: 'all 0.15s ease'
                }}
                title={isAuthenticated ? `Logged in as ${user?.name}` : 'Sign In / Sign Up'}
              >
                <UserIcon size={19} strokeWidth={1.8} />
                {isAuthenticated && (
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.name.split(' ')[0]}
                  </span>
                )}
              </button>

              {/* Account Dropdown Menu (both Authenticated & Guest Sign In / Sign Up) */}
              {accountMenuOpen && (
                <div 
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: isAuthenticated ? '240px' : '260px',
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    boxShadow: '0 14px 40px rgba(32,16,10,0.18)',
                    border: '1.5px solid #ECE4D8',
                    padding: '12px',
                    zIndex: 200,
                    animation: 'fadeIn 0.15s ease'
                  }}
                >
                  {isAuthenticated ? (
                    <>
                      <div style={{ paddingBottom: '10px', marginBottom: '8px', borderBottom: '1px solid #F0E8DE' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#20100A' }}>{user?.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#736257' }}>{user?.email || user?.phone}</div>
                        <span 
                          style={{
                            display: 'inline-block',
                            background: '#E6F4EA',
                            color: '#137333',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            marginTop: '6px'
                          }}
                        >
                          Nuttryx Member ⭐
                        </span>
                      </div>

                      <a
                        href="/account?tab=orders"
                        onClick={() => setAccountMenuOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          color: '#20100A',
                          textDecoration: 'none',
                          fontSize: '0.84rem',
                          fontWeight: 600,
                          transition: 'background 0.15s'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#FAF7F2')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <PackageCheck size={16} color="#D9822B" />
                        <span>My Orders 📦</span>
                      </a>

                      <a
                        href="/account?tab=profile"
                        onClick={() => setAccountMenuOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          color: '#20100A',
                          textDecoration: 'none',
                          fontSize: '0.84rem',
                          fontWeight: 600,
                          transition: 'background 0.15s'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#FAF7F2')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <UserIcon size={16} color="#3182CE" />
                        <span>Profile & Address 👤</span>
                      </a>

                      <a
                        href="/admin"
                        onClick={() => setAccountMenuOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          color: '#20100A',
                          textDecoration: 'none',
                          fontSize: '0.84rem',
                          fontWeight: 600,
                          transition: 'background 0.15s'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#FAF7F2')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <Shield size={16} color="#2D6A4F" />
                        <span>Admin Dashboard</span>
                      </a>

                      <button
                        onClick={() => {
                          setAccountMenuOpen(false);
                          setIsTrackModalOpen(true);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          width: '100%',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          background: 'transparent',
                          border: 'none',
                          color: '#20100A',
                          fontSize: '0.84rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#FAF7F2')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <Truck size={16} color="#736257" />
                        <span>Track Any Order</span>
                      </button>

                      <div style={{ borderTop: '1px solid #F0E8DE', marginTop: '6px', paddingTop: '6px' }}>
                        <button
                          onClick={() => {
                            logout();
                            setAccountMenuOpen(false);
                            triggerToast('Logged out successfully.');
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            width: '100%',
                            padding: '8px 10px',
                            borderRadius: '8px',
                            background: 'transparent',
                            border: 'none',
                            color: '#E53E3E',
                            fontSize: '0.84rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            textAlign: 'left'
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#FFF5F5')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          <LogOut size={15} />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    /* Guest User: Sign In & Sign Up Options */
                    <div>
                      <div style={{ padding: '6px 8px 10px', borderBottom: '1px solid #F0E8DE', marginBottom: '10px' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#20100A' }}>
                          Welcome to NUTTRYX
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#736257', marginTop: '2px', lineHeight: 1.4 }}>
                          Login to manage orders & claim your free peanut butter sample
                        </div>
                      </div>

                      {/* Sign In Link */}
                      <a
                        href="/login?mode=login"
                        onClick={() => setAccountMenuOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          background: 'linear-gradient(135deg, #20100A 0%, #381C12 100%)',
                          color: '#FFFFFF',
                          textDecoration: 'none',
                          fontSize: '0.86rem',
                          fontWeight: 700,
                          marginBottom: '8px',
                          transition: 'all 0.15s ease',
                          boxShadow: '0 2px 8px rgba(32,16,10,0.18)'
                        }}
                      >
                        <LogIn size={16} color="#D9822B" />
                        <span>Sign In</span>
                        <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: '#D9822B', fontWeight: 800 }}>→</span>
                      </a>

                      {/* Sign Up Link */}
                      <a
                        href="/login?mode=register"
                        onClick={() => setAccountMenuOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          background: '#FAF5EE',
                          color: '#20100A',
                          border: '1.5px solid #E8DDCE',
                          textDecoration: 'none',
                          fontSize: '0.86rem',
                          fontWeight: 700,
                          marginBottom: '10px',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#F3ECE2';
                          e.currentTarget.style.borderColor = '#D9822B';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#FAF5EE';
                          e.currentTarget.style.borderColor = '#E8DDCE';
                        }}
                      >
                        <UserPlus size={16} color="#D9822B" />
                        <span>Sign Up / Register</span>
                        <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: '#736257' }}>New</span>
                      </a>

                      {/* Track Order option */}
                      <div style={{ borderTop: '1px solid #F0E8DE', paddingTop: '8px' }}>
                        <button
                          onClick={() => {
                            setAccountMenuOpen(false);
                            setIsTrackModalOpen(true);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            width: '100%',
                            padding: '8px 10px',
                            borderRadius: '8px',
                            background: 'transparent',
                            border: 'none',
                            color: '#5C4A3E',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            textAlign: 'left'
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#FAF7F2')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          <Truck size={15} color="#D9822B" />
                          <span>Track Your Order</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Shopping Cart Icon with Badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              style={{
                position: 'relative',
                background: 'transparent',
                border: 'none',
                color: '#3D2B20',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: '4px 6px'
              }}
              title="View Cart"
            >
              <ShoppingCart size={21} strokeWidth={2.1} color="#3D2B20" />
              <span 
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-6px',
                  background: '#947528',
                  color: '#FFFFFF',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.18)'
                }}
              >
                {cartCount}
              </span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="show-tablet"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#20100A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div 
            style={{
              background: '#FFFFFF',
              borderTop: '1px solid #ECE4D8',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => {
                  setActiveSection(link.id);
                  setMobileMenuOpen(false);
                }}
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#20100A',
                  padding: '6px 0',
                  textDecoration: 'none'
                }}
              >
                {link.label}
              </a>
            ))}
            
            <div style={{ borderTop: '1px solid #EFE6DC', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {isAuthenticated ? (
                <>
                  <a
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ textDecoration: 'none', padding: '6px 0', color: '#20100A', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <span>👤 My Account & Orders ({user?.name.split(' ')[0]})</span>
                  </a>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                      triggerToast('Logged out successfully.');
                    }}
                    style={{ background: 'none', border: 'none', textAlign: 'left', padding: '6px 0', color: '#E53E3E', fontWeight: 700 }}
                  >
                    🚪 Log Out
                  </button>
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <button
                    onClick={() => {
                      router.push('/login?mode=login');
                      setMobileMenuOpen(false);
                    }}
                    style={{ background: 'none', border: 'none', textAlign: 'left', padding: '6px 0', color: '#20100A', fontWeight: 800, fontSize: '0.92rem' }}
                  >
                    🔐 Sign In
                  </button>
                  <button
                    onClick={() => {
                      router.push('/login?mode=register');
                      setMobileMenuOpen(false);
                    }}
                    style={{ background: 'none', border: 'none', textAlign: 'left', padding: '6px 0', color: '#D9822B', fontWeight: 800, fontSize: '0.92rem' }}
                  >
                    ✨ Sign Up / Create Account
                  </button>
                </div>
              )}
              <button 
                onClick={() => { setIsTrackModalOpen(true); setMobileMenuOpen(false); }}
                style={{ background: 'none', border: 'none', textAlign: 'left', padding: '6px 0', color: '#5C4A3E', fontWeight: 600 }}
              >
                📦 Track Any Order
              </button>
              <button 
                onClick={() => { setIsBlogModalOpen(true); setMobileMenuOpen(false); }}
                style={{ background: 'none', border: 'none', textAlign: 'left', padding: '6px 0', color: '#5C4A3E', fontWeight: 600 }}
              >
                📖 Fitness & Nutrition Blog
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ── Order Tracking Modal ── */}
      {isTrackModalOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(20, 10, 5, 0.75)',
            backdropFilter: 'blur(5px)',
            padding: '20px'
          }}
          onClick={() => setIsTrackModalOpen(false)}
        >
          <div 
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '460px',
              padding: '28px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              position: 'relative',
              border: '1.5px solid #E8DDCE'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsTrackModalOpen(false)}
              style={{ position: 'absolute', right: '16px', top: '16px', background: '#ECE4D8', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Truck size={22} color="#D9822B" />
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.3rem', color: '#20100A', margin: 0 }}>
                Track Your Order
              </h3>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#736257', marginBottom: '20px' }}>
              Enter your NUTTRYX Order ID (e.g. NUTX-458898) or registered mobile number to check real-time shipment progress.
            </p>

            <form onSubmit={handleTrackSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <input 
                type="text"
                placeholder="Order ID or Mobile Number"
                value={trackInput}
                onChange={(e) => setTrackInput(e.target.value)}
                style={{
                  flex: 1,
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid #E4DACD',
                  outline: 'none',
                  fontSize: '0.9rem'
                }}
              />
              <button 
                type="submit"
                disabled={trackLoading}
                style={{
                  padding: '11px 22px',
                  borderRadius: '10px',
                  background: '#20100A',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  border: 'none',
                  cursor: trackLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {trackLoading ? 'Searching...' : 'Track Live'}
              </button>
            </form>

            {trackError && (
              <div style={{ color: '#E53E3E', fontSize: '0.82rem', marginBottom: '12px', background: '#FFF5F5', padding: '10px 12px', borderRadius: '8px', border: '1px solid #FEB2B2' }}>
                {trackError}
              </div>
            )}

            {trackResult && (
              <div style={{ background: '#FAF7F2', borderRadius: '16px', padding: '18px', border: '1px solid #EFE6DC' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#736257', fontWeight: 700, textTransform: 'uppercase' }}>Order ID</span>
                    <div style={{ fontWeight: 900, color: '#20100A', fontSize: '1.1rem' }}>{trackResult.id}</div>
                  </div>
                  <span 
                    style={{ 
                      background: 
                        trackResult.status === 'delivered' ? '#E6F4EA' : 
                        trackResult.status === 'shipped' ? '#F3E8FF' : 
                        trackResult.status === 'processing' ? '#EBF8FF' : '#FFF3E0',
                      color: 
                        trackResult.status === 'delivered' ? '#137333' : 
                        trackResult.status === 'shipped' ? '#6B21A8' : 
                        trackResult.status === 'processing' ? '#2B6CB0' : '#B45309',
                      fontSize: '0.78rem', 
                      fontWeight: 800, 
                      padding: '4px 10px', 
                      borderRadius: '9999px',
                      border: '1px solid currentColor'
                    }}
                  >
                    {trackResult.status === 'delivered' && 'Delivered Safely 🎉'}
                    {trackResult.status === 'shipped' && 'In Transit 🚚'}
                    {trackResult.status === 'processing' && 'Packing Fresh 🥜'}
                    {trackResult.status === 'pending' && 'Order Placed 📝'}
                    {trackResult.status === 'cancelled' && 'Cancelled ✕'}
                  </span>
                </div>

                <div style={{ fontSize: '0.84rem', color: '#5C4A3E', marginBottom: '6px' }}>
                  📍 Destination: <strong>{trackResult.customer?.city || 'India'}</strong> ({trackResult.customer?.pincode})
                </div>
                <div style={{ fontSize: '0.84rem', color: '#5C4A3E', marginBottom: '14px' }}>
                  📦 Items: <strong>{trackResult.items?.length || 1} Jar(s)</strong> • Total: <strong>₹{trackResult.total}</strong>
                </div>

                <a
                  href={`/track?id=${encodeURIComponent(trackResult.id)}`}
                  onClick={() => setIsTrackModalOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    width: '100%',
                    padding: '11px',
                    borderRadius: '8px',
                    background: '#20100A',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.86rem',
                    textDecoration: 'none'
                  }}
                >
                  <span>Open Full Interactive Tracking Timeline →</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Blog & Nutrition Guide Modal ── */}
      {isBlogModalOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(20, 10, 5, 0.75)',
            backdropFilter: 'blur(5px)',
            padding: '20px'
          }}
          onClick={() => setIsBlogModalOpen(false)}
        >
          <div 
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '620px',
              maxHeight: '85vh',
              overflowY: 'auto',
              padding: '30px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              position: 'relative',
              border: '1.5px solid #E8DDCE'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsBlogModalOpen(false)}
              style={{ position: 'absolute', right: '18px', top: '18px', background: '#ECE4D8', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <BookOpen size={22} color="#D9822B" />
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.4rem', color: '#20100A', margin: 0 }}>
                NUTTRYX Fitness & Nutrition Journal
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#736257', marginBottom: '22px' }}>
              Science-backed articles and delicious high-protein recipes crafted with 100% pure peanut butter.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#FAF7F2', borderRadius: '14px', padding: '18px', border: '1px solid #ECE4D8' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#D9822B', textTransform: 'uppercase' }}>Workout Fuel</span>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.05rem', color: '#20100A', margin: '4px 0 6px' }}>
                  Why Palm-Oil-Free Peanut Butter is Better for Muscle Recovery
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#5C4A3E', margin: 0, lineHeight: 1.5 }}>
                  Commercial peanut butters add hydrogenated vegetable fats that slow digestion. Pure peanut butter offers bioavailable MUFAs and 30g protein that digest cleanly before heavy gym sessions.
                </p>
              </div>

              <div style={{ background: '#FAF7F2', borderRadius: '14px', padding: '18px', border: '1px solid #ECE4D8' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#D9822B', textTransform: 'uppercase' }}>Quick Recipes</span>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.05rem', color: '#20100A', margin: '4px 0 6px' }}>
                  The 3-Minute Dark Chocolate Protein Smoothie Bowl
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#5C4A3E', margin: 0, lineHeight: 1.5 }}>
                  Blend 2 scoops of NUTTRYX Dark Chocolate with frozen banana and rolled oats for a guilt-free 28g protein breakfast packed with antioxidants and sustained energy.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 900px) {
          .hide-tablet {
            display: none !important;
          }
          .show-tablet {
            display: flex !important;
          }
        }
        @media (min-width: 901px) {
          .show-tablet {
            display: none !important;
          }
        }
        @media (max-width: 640px) {
          .hide-mobile {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
