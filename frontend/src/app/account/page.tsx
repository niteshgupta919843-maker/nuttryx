'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { 
  PackageCheck, 
  User, 
  MapPin, 
  Truck, 
  Calendar, 
  CreditCard, 
  ChevronRight, 
  LogOut, 
  Sparkles, 
  ShoppingBag, 
  ArrowLeft,
  CheckCircle,
  Check,
  AlertCircle,
  Clock,
  Shield,
  Loader2,
  Printer,
  Lock,
  Eye,
  EyeOff,
  FileText,
  X,
  RotateCw
} from 'lucide-react';

interface OrderItem {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
  selectedSize: {
    weight: string;
    price: number;
  };
  quantity: number;
}

interface OrderRecord {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state?: string;
    pincode: string;
  };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod?: string;
  paymentStatus?: string;
  paymentId?: string;
  createdAt: string;
}

function AccountContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated, isAuthReady, logout, updateProfile } = useAuth();
  const { triggerToast } = useCart();

  const initialTab = searchParams.get('tab') === 'profile' ? 'profile' : 'orders';
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>(initialTab);

  // Orders state
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState('');

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Password change state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Invoice modal state
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<OrderRecord | null>(null);

  // Sync profile form when user updates
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || ''
      });
    }
  }, [user]);

  // Fetch orders from MongoDB backend
  const fetchOrders = async () => {
    if (!user) {
      setLoadingOrders(false);
      return;
    }
    setLoadingOrders(true);
    setOrdersError('');
    try {
      const queryParams = new URLSearchParams();
      if (user.email) queryParams.append('email', user.email.trim());
      if (user.phone) queryParams.append('phone', user.phone.trim());

      let res: Response | null = null;
      try {
        res = await fetch(`/api/auth/orders?${queryParams.toString()}`, { cache: 'no-store' });
        if (!res.ok) {
          res = await fetch(`https://nuttryx.onrender.com/api/auth/orders?${queryParams.toString()}`, { cache: 'no-store' });
        }
      } catch {
        res = await fetch(`https://nuttryx.onrender.com/api/auth/orders?${queryParams.toString()}`, { cache: 'no-store' });
      }

      if (res && res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setOrders(data.data);
          return;
        }
      }
      setOrders([]);
    } catch (err) {
      console.error('Failed to fetch user orders:', err);
      setOrdersError('Failed to load your orders. Click "Try Again" below to reload.');
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage(null);

    const result = await updateProfile({
      name: profileForm.name,
      address: profileForm.address,
      city: profileForm.city,
      state: profileForm.state,
      pincode: profileForm.pincode
    });

    setSavingProfile(false);
    if (result.success) {
      setProfileMessage({ text: 'Profile & delivery address updated successfully!', type: 'success' });
      triggerToast('Profile updated successfully.');
    } else {
      setProfileMessage({ text: result.message || 'Failed to update profile.', type: 'error' });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPass !== confirmPass) {
      setPasswordMessage({ text: 'New passwords do not match. Please re-type.', type: 'error' });
      return;
    }

    if (newPass.length < 6) {
      setPasswordMessage({ text: 'New password must be at least 6 characters.', type: 'error' });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          currentPassword: currentPass,
          newPassword: newPass
        })
      });

      const data = await res.json();
      if (data.success) {
        setPasswordMessage({ text: 'Password changed successfully!', type: 'success' });
        setCurrentPass('');
        setNewPass('');
        setConfirmPass('');
        triggerToast('Password updated in database.');
      } else {
        setPasswordMessage({ text: data.message || 'Failed to change password.', type: 'error' });
      }
    } catch {
      setPasswordMessage({ text: 'Server error. Please try again.', type: 'error' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const getStatusBadge = (status: OrderRecord['status']) => {
    switch (status) {
      case 'delivered':
        return { label: 'Delivered', bg: '#E6F4EA', color: '#137333', border: '#A8DAB5' };
      case 'shipped':
        return { label: 'In Transit / Shipped', bg: '#F3E8FF', color: '#6B21A8', border: '#D8B4FE' };
      case 'processing':
        return { label: 'Fresh Batch Packed', bg: '#EBF8FF', color: '#2B6CB0', border: '#90CDF4' };
      case 'cancelled':
        return { label: 'Cancelled', bg: '#FDE8E8', color: '#9B1C1C', border: '#F8B4B4' };
      case 'pending':
      default:
        return { label: 'Order Placed', bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' };
    }
  };

  const getOrderProgressStep = (status: OrderRecord['status']) => {
    switch (status) {
      case 'processing': return 2;
      case 'shipped': return 3;
      case 'delivered': return 4;
      case 'cancelled': return 0;
      case 'pending':
      default: return 1;
    }
  };

  // While auth session is restoring from storage, show a clean loader so it NEVER flashes the sign-in prompt!
  if (!isAuthReady) {
    return (
      <div style={{ minHeight: '80vh', background: '#FAF7F2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
        <Loader2 size={40} className="animate-spin" color="#D9822B" />
        <p style={{ color: '#20100A', fontSize: '0.96rem', fontWeight: 700, margin: 0 }}>
          Loading Your Nuttryx Account...
        </p>
        <span style={{ color: '#736257', fontSize: '0.82rem' }}>Verifying secure session</span>
      </div>
    );
  }

  // If user is truly not logged in, show auth prompt
  if (!isAuthenticated || !user) {
    return (
      <div style={{ minHeight: '80vh', background: '#FDFCFA', padding: '60px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div 
          style={{ 
            maxWidth: '480px', 
            width: '100%', 
            background: '#FFFFFF', 
            borderRadius: '24px', 
            padding: '40px 32px', 
            boxShadow: '0 20px 48px rgba(32, 16, 10, 0.08)',
            border: '1.5px solid #ECE4D8',
            textAlign: 'center'
          }}
        >
          <div 
            style={{ 
              width: '72px', 
              height: '72px', 
              borderRadius: '50%', 
              background: '#FFF3E8', 
              color: '#D9822B', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}
          >
            <User size={36} />
          </div>

          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 900, color: '#20100A', marginBottom: '8px' }}>
            Customer Account
          </h1>
          <p style={{ color: '#736257', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '28px' }}>
            Please sign in to view your real-time order history, track shipments live, and manage saved delivery addresses.
          </p>

          <Link
            href="/login?mode=login&redirect=/account"
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #20100A 0%, #381C12 100%)',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '1rem',
              display: 'block',
              textAlign: 'center',
              textDecoration: 'none',
              marginBottom: '14px',
              boxShadow: '0 4px 16px rgba(32, 16, 10, 0.2)',
              boxSizing: 'border-box'
            }}
          >
            Sign In with Email or Phone
          </Link>

          <Link
            href="/login?mode=register&redirect=/account"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              background: '#FAF7F2',
              color: '#20100A',
              fontWeight: 700,
              fontSize: '0.92rem',
              border: '1.5px solid #E8DDCE',
              display: 'block',
              textAlign: 'center',
              textDecoration: 'none',
              boxSizing: 'border-box'
            }}
          >
            Create New Account ✨
          </Link>

          <div style={{ marginTop: '24px' }}>
            <Link href="/" style={{ color: '#D9822B', fontSize: '0.88rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <ArrowLeft size={16} /> Return to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '90vh', background: '#FDFCFA', padding: '40px 20px 80px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Clean Navigation Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', fontSize: '0.86rem', color: '#736257', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link href="/" style={{ color: '#736257', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ArrowLeft size={15} /> Home
            </Link>
            <span>/</span>
            <span style={{ color: '#20100A', fontWeight: 700 }}>
              {activeTab === 'profile' ? 'Profile & Address' : 'My Orders'}
            </span>
          </div>

          {activeTab === 'profile' ? (
            <button
              onClick={() => setActiveTab('orders')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '9999px',
                background: '#FAF7F2',
                border: '1.5px solid #E8DDCE',
                color: '#20100A',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              <PackageCheck size={14} color="#D9822B" /> View My Orders
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('profile')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '9999px',
                background: '#FFFFFF',
                border: '1px solid #E8DDCE',
                color: '#736257',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              <User size={13} color="#736257" /> Delivery Address & Profile
            </button>
          )}
        </div>

        {/* TAB 1: MY ORDERS */}
        {activeTab === 'orders' && (
          <div>
            {/* Section Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.85rem', fontWeight: 800, color: '#20100A', margin: 0, letterSpacing: '-0.02em' }}>
                  My Orders
                </h2>
                <p style={{ color: '#736257', fontSize: '0.92rem', margin: '4px 0 0 0' }}>
                  Track, view details, and manage your peanut butter purchases
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => fetchOrders()}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    background: '#FFFFFF',
                    border: '1.5px solid #E8DDCE',
                    color: '#5C4A3E',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                  title="Refresh order history"
                >
                  <RotateCw size={13} /> Sync
                </button>
                <Link
                  href="/#products"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '9px 20px',
                    borderRadius: '9999px',
                    background: '#FFFFFF',
                    border: '1.5px solid #E8DDCE',
                    color: '#20100A',
                    fontWeight: 700,
                    fontSize: '0.86rem',
                    textDecoration: 'none',
                    boxShadow: '0 2px 8px rgba(32, 16, 10, 0.04)'
                  }}
                >
                  Browse More <ChevronRight size={15} />
                </Link>
              </div>
            </div>
            {loadingOrders ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#736257' }}>
                <Loader2 size={36} className="animate-spin" style={{ margin: '0 auto 12px', color: '#D9822B' }} />
                <p style={{ fontWeight: 700, color: '#20100A' }}>Fetching your orders from database...</p>
                <p style={{ fontSize: '0.84rem', color: '#736257' }}>Connecting to live order ledger...</p>
              </div>
            ) : ordersError ? (
              <div 
                style={{ 
                  padding: '36px 24px', 
                  background: '#FFF8F6', 
                  border: '1.5px solid #FCDAD7', 
                  borderRadius: '20px', 
                  textAlign: 'center',
                  boxShadow: '0 8px 24px rgba(229, 62, 62, 0.05)'
                }}
              >
                <div 
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: '#FEE2E2',
                    color: '#DC2626',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 14px'
                  }}
                >
                  <AlertCircle size={28} />
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#991B1B', margin: '0 0 6px 0' }}>
                  Unable to Load Orders
                </h4>
                <p style={{ color: '#7F1D1D', fontSize: '0.9rem', maxWidth: '450px', margin: '0 auto 18px auto', lineHeight: 1.5 }}>
                  {ordersError}
                </p>
                <button
                  type="button"
                  onClick={() => fetchOrders()}
                  style={{ 
                    padding: '10px 24px', 
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    borderRadius: '12px',
                    background: '#D9822B',
                    color: '#FFFFFF',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(217, 130, 43, 0.35)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#B86B11')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#D9822B')}
                >
                  <RotateCw size={15} /> Try Again / Refresh
                </button>
              </div>
            ) : orders.length === 0 ? (
              <div 
                style={{ 
                  background: '#FFFFFF', 
                  borderRadius: '24px', 
                  padding: '60px 30px', 
                  textAlign: 'center', 
                  border: '1.5px solid #ECE4D8',
                  boxShadow: '0 8px 24px rgba(32, 16, 10, 0.04)'
                }}
              >
                <div 
                  style={{ 
                    width: '64px', 
                    height: '64px', 
                    borderRadius: '50%', 
                    background: '#FFF3E8', 
                    color: '#D9822B', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}
                >
                  <ShoppingBag size={32} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: '#20100A', marginBottom: '8px' }}>
                  No Orders Placed Yet
                </h3>
                <p style={{ color: '#736257', fontSize: '0.92rem', maxWidth: '420px', margin: '0 auto 24px' }}>
                  Explore our premium, slow-roasted Gujarat peanut butter jars and place your first order today!
                </p>
                <Link 
                  href="/#products" 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 28px',
                    borderRadius: '12px',
                    background: '#20100A',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    textDecoration: 'none',
                    fontSize: '0.95rem'
                  }}
                >
                  Shop Pure Peanut Butter <ChevronRight size={16} />
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {orders.map((order) => {
                  const badge = getStatusBadge(order.status);
                  const currentStep = getOrderProgressStep(order.status);
                  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  });

                  const steps = [
                    { step: 1, label: 'Placed' },
                    { step: 2, label: 'Processing' },
                    { step: 3, label: 'Shipped' },
                    { step: 4, label: 'Delivered' }
                  ];

                  return (
                    <div 
                      key={order.id}
                      style={{ 
                        background: '#FFFFFF', 
                        borderRadius: '24px', 
                        border: '1.5px solid #EBE4DA',
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(32, 16, 10, 0.05)'
                      }}
                    >
                      {/* 1. Order Card Meta Header */}
                      <div 
                        style={{ 
                          padding: '22px 28px', 
                          background: '#FFFFFF', 
                          display: 'flex',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '16px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
                          <div>
                            <span style={{ fontSize: '0.72rem', color: '#8A7A70', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '4px' }}>
                              ORDER ID
                            </span>
                            <div style={{ fontWeight: 800, color: '#20100A', fontSize: '1rem', letterSpacing: '0.01em' }}>
                              #{order.id.replace('#', '')}
                            </div>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.72rem', color: '#8A7A70', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '4px' }}>
                              DATE PLACED
                            </span>
                            <div style={{ fontWeight: 700, color: '#20100A', fontSize: '0.92rem' }}>
                              {orderDate}
                            </div>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.72rem', color: '#8A7A70', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '4px' }}>
                              TOTAL AMOUNT
                            </span>
                            <div style={{ fontWeight: 900, color: '#20100A', fontSize: '1.05rem' }}>
                              ₹{order.total?.toLocaleString('en-IN') || order.total}
                            </div>
                          </div>
                        </div>

                        {/* Status Badge Pill */}
                        <div 
                          style={{ 
                            background: badge.bg, 
                            color: badge.color, 
                            border: `1.5px solid ${badge.border}`,
                            fontSize: '0.82rem', 
                            fontWeight: 800, 
                            padding: '7px 16px', 
                            borderRadius: '9999px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <Clock size={15} />
                          <span>{badge.label}</span>
                        </div>
                      </div>

                      {/* 2. Interactive 4-Step Timeline Progress Bar (matching reference screenshot) */}
                      {order.status !== 'cancelled' ? (
                        <div 
                          style={{ 
                            padding: '24px 28px',
                            background: '#FAF7F2',
                            borderTop: '1px solid #EFE8DE',
                            borderBottom: '1px solid #EFE8DE'
                          }}
                        >
                          <div style={{ maxWidth: '650px', margin: '0 auto', position: 'relative' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                              {/* Background Connecting Line */}
                              <div 
                                style={{ 
                                  position: 'absolute', 
                                  top: '16px', 
                                  left: '20px', 
                                  right: '20px', 
                                  height: '3px', 
                                  background: '#E5DFD5',
                                  zIndex: 1 
                                }} 
                              />
                              {/* Active Progress Line */}
                              <div 
                                style={{ 
                                  position: 'absolute', 
                                  top: '16px', 
                                  left: '20px', 
                                  width: `${Math.max(0, Math.min(100, ((currentStep - 1) / 3) * 100))}%`, 
                                  height: '3px', 
                                  background: '#854D0E',
                                  zIndex: 2,
                                  transition: 'width 0.3s ease'
                                }} 
                              />

                              {steps.map((s) => {
                                const isPassed = currentStep > s.step;
                                const isCurrent = currentStep === s.step;
                                const isActive = isPassed || isCurrent;

                                return (
                                  <div 
                                    key={s.step} 
                                    style={{ 
                                      display: 'flex', 
                                      flexDirection: 'column', 
                                      alignItems: 'center', 
                                      position: 'relative', 
                                      zIndex: 3 
                                    }}
                                  >
                                    <div 
                                      style={{ 
                                        width: '32px', 
                                        height: '32px', 
                                        borderRadius: '50%', 
                                        background: isActive ? '#854D0E' : '#E5DFD5', 
                                        color: isActive ? '#FFFFFF' : '#736257',
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        fontSize: '0.82rem',
                                        fontWeight: 800,
                                        boxShadow: isCurrent ? '0 0 0 4px rgba(133, 77, 14, 0.15)' : 'none',
                                        transition: 'all 0.2s ease'
                                      }}
                                    >
                                      {isPassed || isCurrent ? (
                                        <Check size={16} strokeWidth={3} />
                                      ) : (
                                        s.step
                                      )}
                                    </div>
                                    <span 
                                      style={{ 
                                        fontSize: '0.78rem', 
                                        fontWeight: isActive ? 800 : 600, 
                                        color: isActive ? '#20100A' : '#8A7A70', 
                                        marginTop: '8px',
                                        letterSpacing: '0.01em'
                                      }}
                                    >
                                      {s.label}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div style={{ padding: '14px 28px', background: '#FDF2F2', borderTop: '1px solid #FCDAD7', borderBottom: '1px solid #FCDAD7', color: '#991B1B', fontSize: '0.86rem', fontWeight: 700 }}>
                          ⚠️ This order was cancelled.
                        </div>
                      )}

                      {/* 3. Product Items List */}
                      <div style={{ padding: '24px 28px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {order.items?.map((item, idx) => (
                            <div 
                              key={idx}
                              style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                paddingBottom: idx !== order.items.length - 1 ? '16px' : '0',
                                borderBottom: idx !== order.items.length - 1 ? '1px dashed #EBE4DA' : 'none',
                                flexWrap: 'wrap',
                                gap: '12px'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div 
                                  style={{ 
                                    width: '64px', 
                                    height: '64px', 
                                    borderRadius: '14px', 
                                    background: '#FAF7F2', 
                                    border: '1.5px solid #E8DDCE',
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    overflow: 'hidden',
                                    flexShrink: 0
                                  }}
                                >
                                  {item.product?.image ? (
                                    <Image 
                                      src={item.product.image} 
                                      alt={item.product.name} 
                                      width={56} 
                                      height={56} 
                                      style={{ objectFit: 'contain' }}
                                    />
                                  ) : (
                                    <ShoppingBag size={28} color="#D9822B" />
                                  )}
                                </div>
                                <div>
                                  <div style={{ fontWeight: 800, fontSize: '1rem', color: '#20100A' }}>
                                    {item.product?.name}
                                  </div>
                                  <div style={{ fontSize: '0.84rem', color: '#736257', marginTop: '3px' }}>
                                    Size: <strong>{item.selectedSize?.weight || '500g'}</strong> • Qty: <strong>{item.quantity}</strong>
                                  </div>
                                </div>
                              </div>

                              <div style={{ fontWeight: 800, color: '#20100A', fontSize: '1.05rem' }}>
                                ₹{((item.selectedSize?.price || item.product?.price || 0) * item.quantity).toLocaleString('en-IN')}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Delivery Address Pill */}
                        <div 
                          style={{ 
                            background: '#FAF7F2', 
                            borderRadius: '12px', 
                            padding: '12px 18px', 
                            border: '1px solid #ECE4D8',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontSize: '0.85rem',
                            color: '#5C4A3E',
                            marginTop: '18px'
                          }}
                        >
                          <MapPin size={16} color="#D9822B" style={{ flexShrink: 0 }} />
                          <span>
                            <strong>Delivering To:</strong> {order.customer.address}, {order.customer.city} - {order.customer.pincode}
                          </span>
                        </div>
                      </div>

                      {/* 4. Order Card Footer matching reference design */}
                      <div 
                        style={{ 
                          padding: '16px 28px', 
                          background: '#FFFFFF', 
                          borderTop: '1px solid #EFE8DE',
                          display: 'flex',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '14px'
                        }}
                      >
                        <div style={{ fontSize: '0.88rem', color: '#736257' }}>
                          Payment: <strong style={{ color: '#20100A' }}>{order.paymentMethod === 'cod' ? 'Cash On Delivery' : 'Online Paid'}</strong> • Status: <strong style={{ color: order.paymentStatus === 'paid' ? '#15803D' : '#D97706' }}>{order.paymentStatus === 'paid' ? 'Completed' : 'Pending'}</strong>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            onClick={() => setSelectedOrderForInvoice(order)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '8px 18px',
                              borderRadius: '9999px',
                              background: '#FFFFFF',
                              color: '#20100A',
                              border: '1.5px solid #E5DFD5',
                              fontWeight: 700,
                              fontSize: '0.85rem',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <Printer size={15} color="#D9822B" /> Invoice
                          </button>
                          <Link
                            href={`/track?id=${encodeURIComponent(order.id)}`}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '8px 20px',
                              borderRadius: '9999px',
                              background: '#20100A',
                              color: '#FFFFFF',
                              fontWeight: 800,
                              fontSize: '0.85rem',
                              textDecoration: 'none',
                              transition: 'background 0.15s'
                            }}
                          >
                            <Truck size={15} /> Track Order 🚚
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PROFILE & DELIVERY ADDRESS */}
        {activeTab === 'profile' && (
          <div 
            style={{ 
              background: '#FFFFFF', 
              borderRadius: '24px', 
              border: '1.5px solid #ECE4D8',
              padding: '32px 36px',
              boxShadow: '0 8px 24px rgba(32, 16, 10, 0.04)',
              maxWidth: '720px'
            }}
          >
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 900, color: '#20100A', marginBottom: '8px' }}>
              Profile & Default Delivery Address
            </h2>
            <p style={{ color: '#736257', fontSize: '0.88rem', marginBottom: '24px' }}>
              Your address details are securely saved and automatically auto-filled during checkout.
            </p>

            {profileMessage && (
              <div 
                style={{ 
                  padding: '12px 16px', 
                  borderRadius: '12px', 
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  background: profileMessage.type === 'success' ? '#E6F4EA' : '#FDE8E8',
                  color: profileMessage.type === 'success' ? '#137333' : '#9B1C1C',
                  border: `1px solid ${profileMessage.type === 'success' ? '#A8DAB5' : '#F8B4B4'}`
                }}
              >
                {profileMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                <span>{profileMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#20100A', marginBottom: '6px' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid #E4DACD',
                      outline: 'none',
                      fontSize: '0.9rem',
                      background: '#FFFFFF'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#20100A', marginBottom: '6px' }}>
                    Registered Mobile Number
                  </label>
                  <input
                    type="tel"
                    disabled
                    value={profileForm.phone}
                    title="Mobile number linked to your account"
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid #E4DACD',
                      outline: 'none',
                      fontSize: '0.9rem',
                      background: '#FAF7F2',
                      color: '#736257',
                      cursor: 'not-allowed'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#20100A', marginBottom: '6px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={profileForm.email}
                  title="Registered Email linked to your account"
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #E4DACD',
                    outline: 'none',
                    fontSize: '0.9rem',
                    background: '#FAF7F2',
                    color: '#736257',
                    cursor: 'not-allowed'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#20100A', marginBottom: '6px' }}>
                  Street / Flat / House Address
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Flat 402, Green Meadows, 5th Main Road"
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #E4DACD',
                    outline: 'none',
                    fontSize: '0.9rem',
                    background: '#FFFFFF',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#20100A', marginBottom: '6px' }}>
                    City
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai"
                    value={profileForm.city}
                    onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid #E4DACD',
                      outline: 'none',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#20100A', marginBottom: '6px' }}>
                    State
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Maharashtra"
                    value={profileForm.state}
                    onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid #E4DACD',
                      outline: 'none',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#20100A', marginBottom: '6px' }}>
                    Pincode
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="400001"
                    value={profileForm.pincode}
                    onChange={(e) => setProfileForm({ ...profileForm, pincode: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid #E4DACD',
                      outline: 'none',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                style={{
                  padding: '12px 28px',
                  borderRadius: '12px',
                  background: '#20100A',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: savingProfile ? 'wait' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {savingProfile ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Saving Changes...
                  </>
                ) : (
                  'Save Delivery Address'
                )}
              </button>
            </form>

            {/* Change Password Card */}
            <div style={{ marginTop: '36px', paddingTop: '28px', borderTop: '1px solid #ECE4D8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Lock size={20} color="#D9822B" />
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 900, color: '#20100A', margin: 0 }}>
                  Change Account Password
                </h3>
              </div>
              <p style={{ color: '#736257', fontSize: '0.86rem', marginBottom: '20px' }}>
                Ensure your account uses a secure password of at least 6 characters.
              </p>

              {passwordMessage && (
                <div 
                  style={{ 
                    padding: '12px 16px', 
                    borderRadius: '12px', 
                    marginBottom: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    background: passwordMessage.type === 'success' ? '#E6F4EA' : '#FDE8E8',
                    color: passwordMessage.type === 'success' ? '#137333' : '#9B1C1C',
                    border: `1px solid ${passwordMessage.type === 'success' ? '#A8DAB5' : '#F8B4B4'}`
                  }}
                >
                  {passwordMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                  <span>{passwordMessage.text}</span>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#20100A', marginBottom: '6px' }}>
                    Current Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showCurrentPass ? 'text' : 'password'}
                      required
                      placeholder="Enter current password"
                      value={currentPass}
                      onChange={(e) => setCurrentPass(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 40px 11px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #E4DACD',
                        outline: 'none',
                        fontSize: '0.9rem'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#736257',
                        cursor: 'pointer'
                      }}
                    >
                      {showCurrentPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#20100A', marginBottom: '6px' }}>
                      New Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showNewPass ? 'text' : 'password'}
                        required
                        placeholder="At least 6 characters"
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '11px 40px 11px 14px',
                          borderRadius: '10px',
                          border: '1.5px solid #E4DACD',
                          outline: 'none',
                          fontSize: '0.9rem'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: '#736257',
                          cursor: 'pointer'
                        }}
                      >
                        {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#20100A', marginBottom: '6px' }}>
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Re-enter new password"
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #E4DACD',
                        outline: 'none',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={passwordLoading}
                  style={{
                    padding: '11px 24px',
                    borderRadius: '10px',
                    background: '#20100A',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    border: 'none',
                    cursor: passwordLoading ? 'wait' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {passwordLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Updating Password...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Printable Order Invoice Modal */}
        {selectedOrderForInvoice && (
          <div 
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1200,
              background: 'rgba(20, 10, 5, 0.75)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={() => setSelectedOrderForInvoice(null)}
          >
            <div 
              style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                width: '100%',
                maxWidth: '680px',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
                padding: '36px 32px',
                position: 'relative',
                border: '1.5px solid #E8DDCE'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedOrderForInvoice(null)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: '#F3ECE2',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>

              {/* Invoice Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #20100A', paddingBottom: '20px', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 900, color: '#20100A', margin: 0 }}>
                    NUTTRYX™ FOODS
                  </h2>
                  <p style={{ fontSize: '0.82rem', color: '#736257', margin: '4px 0 0' }}>
                    Tax Invoice / Order Receipt • Pure Peanut Butter
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.74rem', color: '#736257', textTransform: 'uppercase', fontWeight: 800 }}>Invoice ID</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#D9822B' }}>{selectedOrderForInvoice.id}</div>
                  <div style={{ fontSize: '0.8rem', color: '#736257', marginTop: '2px' }}>
                    {new Date(selectedOrderForInvoice.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>

              {/* Bill To & Ship To */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px', background: '#FAF7F2', padding: '16px 20px', borderRadius: '12px', border: '1px solid #ECE4D8', fontSize: '0.86rem' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#736257', marginBottom: '4px' }}>Billed & Shipped To</div>
                  <div style={{ fontWeight: 800, color: '#20100A' }}>{selectedOrderForInvoice.customer.name}</div>
                  <div style={{ color: '#5C4A3E' }}>{selectedOrderForInvoice.customer.address}</div>
                  <div style={{ color: '#5C4A3E' }}>{selectedOrderForInvoice.customer.city} - {selectedOrderForInvoice.customer.pincode}</div>
                  <div style={{ color: '#5C4A3E', marginTop: '4px' }}>Phone: {selectedOrderForInvoice.customer.phone}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#736257', marginBottom: '4px' }}>Order Details</div>
                  <div><strong>Payment Status:</strong> Paid (Secured)</div>
                  <div><strong>Fulfillment:</strong> {selectedOrderForInvoice.status.toUpperCase()}</div>
                  <div><strong>Bonus Sample:</strong> Included Inside 🎁</div>
                </div>
              </div>

              {/* Items Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem', marginBottom: '24px' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid #ECE4D8', color: '#736257', fontSize: '0.76rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '10px 0' }}>Item Description</th>
                    <th style={{ padding: '10px', textAlign: 'center' }}>Size</th>
                    <th style={{ padding: '10px', textAlign: 'center' }}>Qty</th>
                    <th style={{ padding: '10px 0', textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrderForInvoice.items?.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #F3ECE2' }}>
                      <td style={{ padding: '12px 0', fontWeight: 700, color: '#20100A' }}>
                        {item.product?.name}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center', color: '#5C4A3E' }}>
                        {item.selectedSize?.weight || '500g'}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center', fontWeight: 700, color: '#20100A' }}>
                        {item.quantity}
                      </td>
                      <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 800, color: '#20100A' }}>
                        ₹{(item.selectedSize?.price || item.product?.price || 0) * item.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Total Calculation */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '28px' }}>
                <div style={{ width: '240px', fontSize: '0.88rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#736257' }}>
                    <span>Subtotal:</span>
                    <span>₹{selectedOrderForInvoice.subtotal}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#736257' }}>
                    <span>Shipping:</span>
                    <span>{selectedOrderForInvoice.shipping > 0 ? `₹${selectedOrderForInvoice.shipping}` : 'FREE'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '1.5px solid #20100A', marginTop: '6px', fontWeight: 900, fontSize: '1.1rem', color: '#20100A' }}>
                    <span>Grand Total:</span>
                    <span style={{ color: '#2D6A4F' }}>₹{selectedOrderForInvoice.total}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  onClick={() => window.print()}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '11px 24px',
                    borderRadius: '10px',
                    background: '#20100A',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <Printer size={16} /> Print Official Receipt
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={32} className="animate-spin" color="#D9822B" />
      </div>
    }>
      <AccountContent />
    </Suspense>
  );
}

