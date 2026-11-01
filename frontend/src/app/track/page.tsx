'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShoppingBag, 
  Search, 
  RefreshCw, 
  ArrowLeft, 
  Copy, 
  Check, 
  HelpCircle,
  ExternalLink,
  Phone,
  AlertCircle
} from 'lucide-react';

interface OrderItem {
  product: {
    name: string;
    image?: string;
  };
  selectedSize: {
    weight: string;
    price: number;
  };
  quantity: number;
}

interface OrderData {
  _id: string;
  id: string;
  customer: {
    name: string;
    email?: string;
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
  createdAt: string;
  updatedAt?: string;
}

function TrackContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('id') || searchParams.get('q') || '';

  const [inputVal, setInputVal] = useState(queryParam);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const fetchTracking = useCallback(async (query: string) => {
    const clean = query.trim();
    if (!clean) {
      setErrorMsg('Please enter your Order ID (e.g. NUTX-458898) or Phone Number.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      let res = await fetch(`/api/orders/track/${encodeURIComponent(clean)}`, { cache: 'no-store' });
      if (!res.ok) {
        res = await fetch(`http://localhost:5000/api/orders/track/${encodeURIComponent(clean)}`, { cache: 'no-store' });
      }

      const json = await res.json();
      if (json.success && json.data) {
        setOrder(json.data);
        setLastRefreshed(new Date());
      } else {
        setOrder(null);
        setErrorMsg(json.message || `No order found for "${clean}". Please verify your Order ID or phone number.`);
      }
    } catch {
      setErrorMsg('Could not reach the tracking server. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-search if parameter provided in URL
  useEffect(() => {
    if (queryParam.trim()) {
      setInputVal(queryParam);
      fetchTracking(queryParam);
    }
  }, [queryParam, fetchTracking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      fetchTracking(inputVal);
    }
  };

  const copyOrderId = () => {
    if (!order) return;
    navigator.clipboard.writeText(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Tracking Stages Config
  const getStageIndex = (status: OrderData['status']) => {
    switch (status) {
      case 'pending': return 1;
      case 'processing': return 2;
      case 'shipped': return 3;
      case 'delivered': return 4;
      case 'cancelled': return -1;
      default: return 1;
    }
  };

  const stageIndex = order ? getStageIndex(order.status) : 0;

  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  const getEstimatedDelivery = (createdIso?: string) => {
    if (!createdIso) return 'Within 2-3 Business Days';
    try {
      const d = new Date(createdIso);
      d.setDate(d.getDate() + 3);
      return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });
    } catch {
      return 'Within 2-3 Business Days';
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2', fontFamily: 'var(--font-heading)', paddingBottom: '80px' }}>
      
      {/* ── Top Header Banner ── */}
      <section 
        style={{
          background: 'linear-gradient(135deg, #24120A 0%, #361B0E 60%, #1F0D06 100%)',
          color: '#FAF7F2',
          padding: '48px 0 60px',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '2px solid rgba(217, 130, 43, 0.3)'
        }}
      >
        {/* Glow */}
        <div 
          style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(217, 130, 43, 0.2) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          {/* Breadcrumb back */}
          <Link 
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#FFD199',
              fontSize: '0.84rem',
              fontWeight: 700,
              textDecoration: 'none',
              marginBottom: '18px',
              transition: 'transform 0.15s ease'
            }}
          >
            <ArrowLeft size={16} /> Back to Store
          </Link>

          <div style={{ maxWidth: '640px' }}>
            <span 
              style={{
                display: 'inline-block',
                background: 'rgba(217, 130, 43, 0.25)',
                color: '#FFD199',
                border: '1px solid rgba(217, 130, 43, 0.45)',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '0.76rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '10px'
              }}
            >
              🚚 Real-Time Logistics Center
            </span>

            <h1 
              style={{
                fontSize: 'clamp(2rem, 3.8vw, 2.8rem)',
                fontWeight: 900,
                lineHeight: 1.15,
                color: '#FAF7F2',
                marginBottom: '10px',
                letterSpacing: '-0.02em'
              }}
            >
              Track Your Nuttryx Order
            </h1>

            <p style={{ color: '#D5C4B8', fontSize: '0.98rem', lineHeight: 1.5, marginBottom: '24px' }}>
              Enter your Order ID (from confirmation email/SMS) or your registered 10-digit mobile number to check real-time dispatch and delivery progress.
            </p>

            {/* Search Input Box */}
            <form 
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                gap: '10px',
                background: '#FFFFFF',
                padding: '6px 8px 6px 18px',
                borderRadius: '9999px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                maxWidth: '540px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '10px' }}>
                <Search size={18} color="#8A7669" />
                <input 
                  type="text"
                  placeholder="e.g. NUTX-458898 or 9198430000"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.92rem',
                    color: '#20100A',
                    fontWeight: 600,
                    fontFamily: 'var(--font-heading)'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '12px 26px',
                  borderRadius: '9999px',
                  background: '#20100A',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(32, 16, 10, 0.3)',
                  transition: 'all 0.15s ease'
                }}
              >
                {loading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Locating...</span>
                  </>
                ) : (
                  <span>Track Order</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── Main Tracking Body ── */}
      <div className="container" style={{ marginTop: '40px' }}>
        
        {/* Error State */}
        {errorMsg && (
          <div 
            style={{
              background: '#FFF5F5',
              border: '1.5px solid #FEB2B2',
              borderRadius: '16px',
              padding: '20px 24px',
              maxWidth: '720px',
              margin: '0 auto 30px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px',
              color: '#C53030'
            }}
          >
            <AlertCircle size={22} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.96rem', marginBottom: '4px' }}>
                Order Not Found
              </div>
              <div style={{ fontSize: '0.86rem', color: '#742A2A', lineHeight: 1.5 }}>
                {errorMsg}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#9B2C2C', marginTop: '8px' }}>
                💡 Tip: Check the order ID received on your email or enter your 10-digit phone number.
              </div>
            </div>
          </div>
        )}

        {/* Live Order Details Card */}
        {order && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            
            {/* Top Status Header Card */}
            <div 
              style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: 'clamp(20px, 4vw, 32px)',
                border: '1.5px solid #ECE2D5',
                boxShadow: '0 8px 30px rgba(51, 26, 17, 0.06)',
                marginBottom: '28px'
              }}
            >
              {/* Row 1: Order ID & Live Status Pill */}
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px',
                  paddingBottom: '20px',
                  borderBottom: '1px solid #F3ECE2'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#736257', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Tracking Order
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2px' }}>
                    <span style={{ fontSize: '1.55rem', fontWeight: 900, color: '#20100A', letterSpacing: '0.02em' }}>
                      {order.id}
                    </span>
                    <button
                      type="button"
                      onClick={copyOrderId}
                      style={{
                        background: '#FAF6F0',
                        border: '1px solid #ECE2D5',
                        borderRadius: '6px',
                        padding: '4px 8px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: copied ? '#166534' : '#5C4A3E',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      title="Copy Order ID"
                    >
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Status Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div 
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      borderRadius: '9999px',
                      fontWeight: 800,
                      fontSize: '0.86rem',
                      background: 
                        order.status === 'delivered' ? '#E6F4EA' :
                        order.status === 'shipped' ? '#F3E8FF' :
                        order.status === 'processing' ? '#EBF8FF' :
                        order.status === 'cancelled' ? '#FEE2E2' : '#FFF3E0',
                      color:
                        order.status === 'delivered' ? '#137333' :
                        order.status === 'shipped' ? '#6B21A8' :
                        order.status === 'processing' ? '#2B6CB0' :
                        order.status === 'cancelled' ? '#991B1B' : '#B45309',
                      border: '1px solid currentColor'
                    }}
                  >
                    <span 
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: 'currentColor',
                        animation: order.status === 'delivered' ? 'none' : 'pulse 1.5s infinite'
                      }} 
                    />
                    <span>
                      {order.status === 'delivered' && 'Delivered Safely 🎉'}
                      {order.status === 'shipped' && 'In Transit & Dispatched 🚚'}
                      {order.status === 'processing' && 'Fresh Stone-Milling & Packed 🥜'}
                      {order.status === 'pending' && 'Order Confirmed & Received 📝'}
                      {order.status === 'cancelled' && 'Order Cancelled ✕'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => fetchTracking(order.id)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: '#FAF6F0',
                      border: '1px solid #ECE2D5',
                      color: '#20100A',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 700
                    }}
                    title="Refresh live status from database"
                  >
                    <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                    <span className="hide-mobile">Sync</span>
                  </button>
                </div>
              </div>

              {/* Row 2: Visual 4-Step Logistics Progress Stepper */}
              <div style={{ padding: '36px 10px 20px' }}>
                <div 
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    position: 'relative'
                  }}
                >
                  {/* Connecting Line Track */}
                  <div 
                    style={{
                      position: 'absolute',
                      top: '22px',
                      left: '12%',
                      right: '12%',
                      height: '4px',
                      background: '#ECE4D8',
                      zIndex: 1
                    }}
                  >
                    <div 
                      style={{
                        height: '100%',
                        background: '#2D6A4F',
                        width: 
                          stageIndex === 1 ? '0%' :
                          stageIndex === 2 ? '33%' :
                          stageIndex === 3 ? '66%' :
                          stageIndex >= 4 ? '100%' : '0%',
                        transition: 'width 0.5s ease'
                      }}
                    />
                  </div>

                  {/* 4 Stage Nodes */}
                  {[
                    { step: 1, label: 'Order Placed', sub: formatDate(order.createdAt), icon: ShoppingBag },
                    { step: 2, label: 'Quality Packing', sub: 'Stone-milled & sealed', icon: Package },
                    { step: 3, label: 'Dispatched', sub: 'In Transit via Express', icon: Truck },
                    { step: 4, label: 'Delivered', sub: getEstimatedDelivery(order.createdAt), icon: CheckCircle2 }
                  ].map((node) => {
                    const isCompleted = stageIndex >= node.step;
                    const isCurrent = stageIndex === node.step;
                    const IconComp = node.icon;

                    return (
                      <div 
                        key={node.step}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          textAlign: 'center',
                          position: 'relative',
                          zIndex: 2
                        }}
                      >
                        <div 
                          style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '50%',
                            background: isCompleted ? '#2D6A4F' : '#FFFFFF',
                            border: isCompleted ? '3px solid #2D6A4F' : '2px solid #D5C4B5',
                            color: isCompleted ? '#FFFFFF' : '#8A7669',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: isCurrent ? '0 0 0 5px rgba(45, 106, 79, 0.2)' : '0 2px 8px rgba(0,0,0,0.06)',
                            transition: 'all 0.3s ease',
                            marginBottom: '10px'
                          }}
                        >
                          <IconComp size={20} />
                        </div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 800, color: isCompleted ? '#20100A' : '#736257' }}>
                          {node.label}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#8A7669', marginTop: '2px', maxWidth: '120px' }}>
                          {node.sub}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery ETA Alert Box */}
              <div 
                style={{
                  background: order.status === 'delivered' ? '#E8F5E9' : '#FAF6EE',
                  border: order.status === 'delivered' ? '1px solid #C8E6C9' : '1px solid #FFE0B2',
                  borderRadius: '12px',
                  padding: '12px 18px',
                  marginTop: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: '#20100A' }}>
                  <Clock size={16} color="#D9822B" />
                  <span>
                    {order.status === 'delivered' ? (
                      <strong>Package was safely delivered to recipient. Enjoy pure nutrition!</strong>
                    ) : (
                      <>Estimated Delivery Date: <strong>{getEstimatedDelivery(order.createdAt)}</strong></>
                    )}
                  </span>
                </div>
                {lastRefreshed && (
                  <span style={{ fontSize: '0.72rem', color: '#736257' }}>
                    Synced live at {lastRefreshed.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>

            </div>

            {/* Bottom 2-Col Grid: Order Items & Delivery Information */}
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
                gap: '24px'
              }}
            >
              {/* Left Column: Items in Order */}
              <div 
                style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '24px',
                  border: '1.5px solid #ECE2D5',
                  boxShadow: '0 4px 18px rgba(51, 26, 17, 0.04)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#20100A' }}>
                    Items in Shipment ({order.items ? order.items.length : 0})
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#736257' }}>
                    Total: ₹{order.total}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {order.items && order.items.map((item, idx) => (
                    <div 
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        paddingBottom: idx < order.items.length - 1 ? '14px' : 0,
                        borderBottom: idx < order.items.length - 1 ? '1px solid #F3ECE2' : 'none'
                      }}
                    >
                      <div 
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          background: '#FAF6F0',
                          border: '1px solid #ECE2D5',
                          position: 'relative',
                          flexShrink: 0
                        }}
                      >
                        <Image 
                          src={item.product.image || '/images/creamy-peanut-butter.jpg'} 
                          alt={item.product.name} 
                          fill 
                          style={{ objectFit: 'contain' }} 
                        />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#20100A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.product.name}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#736257', marginTop: '2px' }}>
                          Pack: <strong style={{ color: '#D9822B' }}>{item.selectedSize?.weight || '500g'}</strong> • Qty: <strong>{item.quantity}</strong>
                        </div>
                      </div>

                      <div style={{ fontWeight: 900, fontSize: '0.95rem', color: '#20100A' }}>
                        ₹{(item.selectedSize?.price || 0) * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown Footer */}
                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1.5px dashed #ECE2D5', fontSize: '0.86rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#736257', marginBottom: '6px' }}>
                    <span>Subtotal:</span>
                    <span>₹{order.subtotal}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#736257', marginBottom: '8px' }}>
                    <span>Shipping Charges:</span>
                    <span style={{ color: '#2D6A4F', fontWeight: 700 }}>
                      {order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: '1.1rem', color: '#20100A', paddingTop: '6px', borderTop: '1px solid #ECE2D5' }}>
                    <span>Total Amount Paid:</span>
                    <span>₹{order.total}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Customer & Delivery Address + Support */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Address Card */}
                <div 
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '20px',
                    padding: '24px',
                    border: '1.5px solid #ECE2D5',
                    boxShadow: '0 4px 18px rgba(51, 26, 17, 0.04)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <MapPin size={18} color="#D9822B" />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#20100A' }}>
                      Delivery Address
                    </h3>
                  </div>

                  <div style={{ fontSize: '0.9rem', color: '#20100A', lineHeight: 1.6 }}>
                    <div style={{ fontWeight: 800 }}>{order.customer.name}</div>
                    <div style={{ color: '#5C4A3E', marginTop: '2px' }}>{order.customer.address}</div>
                    <div style={{ color: '#5C4A3E' }}>
                      {order.customer.city}{order.customer.state ? `, ${order.customer.state}` : ''} - <strong>{order.customer.pincode}</strong>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#736257', marginTop: '8px' }}>
                      Contact Phone: ••••••{order.customer.phone.slice(-4)}
                    </div>
                  </div>
                </div>

                {/* Support Assistance Card */}
                <div 
                  style={{
                    background: 'linear-gradient(135deg, #24120A 0%, #361B0E 100%)',
                    color: '#FFFFFF',
                    borderRadius: '20px',
                    padding: '22px 24px',
                    border: '1px solid rgba(217, 130, 43, 0.35)',
                    boxShadow: '0 8px 24px rgba(32, 16, 10, 0.15)'
                  }}
                >
                  <div style={{ fontSize: '0.78rem', color: '#FFD199', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                    Need Help With Shipment?
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '8px' }}>
                    Nuttryx Express Care
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#D5C4B8', lineHeight: 1.5, marginBottom: '16px' }}>
                    Questions about your delivery schedule or need address modification? Our Saurashtra dispatch desk is here to assist.
                  </p>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <a 
                      href="mailto:niteshgupta919843@gmail.com"
                      style={{
                        padding: '9px 16px',
                        borderRadius: '9999px',
                        background: '#D9822B',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>Email Support</span>
                    </a>

                    <Link 
                      href="/shop"
                      style={{
                        padding: '9px 16px',
                        borderRadius: '9999px',
                        background: 'rgba(255,255,255,0.12)',
                        color: '#FAF7F2',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        textDecoration: 'none',
                        border: '1px solid rgba(255,255,255,0.25)'
                      }}
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-heading)' }}>
        <RefreshCw size={24} className="animate-spin" color="#D9822B" />
        <span style={{ marginLeft: '10px', fontWeight: 700 }}>Loading Tracking System...</span>
      </div>
    }>
      <TrackContent />
    </Suspense>
  );
}

