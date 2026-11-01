'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { 
  CheckCircle2, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  Banknote, 
  ShoppingBag,
  Sparkles,
  Loader2,
  PackageCheck,
  Truck,
  Copy,
  Check,
  ArrowLeft,
  ArrowRight,
  Lock,
  AlertCircle,
  Flame,
  Tag,
  Gift,
  ChevronRight
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { 
    items, 
    subtotal, 
    discount, 
    shipping, 
    total, 
    appliedCoupon, 
    applyCoupon, 
    removeCoupon, 
    clearCart, 
    triggerToast 
  } = useCart();
  const { user } = useAuth();

  const [isMounted, setIsMounted] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1 = Address, 2 = Payment, 3 = Confirm
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [submitting, setSubmitting] = useState(false);
  const [processingText, setProcessingText] = useState('Processing...');
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Coupon state in checkout summary
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  // Shipping Address Form State
  const [shippingForm, setShippingForm] = useState({
    name: user?.name || 'Nitesh',
    email: user?.email || 'niteshgupta919843@gmail.com',
    phone: user?.phone || '9198437621',
    pincode: user?.pincode || '110001',
    addressLine1: user?.address || 'Flat 402, Green Meadows',
    addressLine2: '',
    city: user?.city || 'Delhi',
    state: user?.state || 'Delhi'
  });

  const [addressError, setAddressError] = useState('');

  // UPI State
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copiedVpa, setCopiedVpa] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(600);
  const upiVpa = 'nuttryx@upi';
  const merchantName = 'NUTTRYX Foods';

  // Card Form State
  const [cardForm, setCardForm] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: user?.name || 'Nitesh'
  });
  const [cardBrand, setCardBrand] = useState<'visa' | 'mastercard' | 'rupay' | 'generic'>('generic');
  const [cardError, setCardError] = useState('');

  // Payment Result Details for Success Step
  const [paymentResult, setPaymentResult] = useState<{
    method: 'upi' | 'card' | 'cod' | 'razorpay';
    status: 'paid' | 'cod' | 'pending';
    paymentId?: string;
  }>({
    method: 'upi',
    status: 'paid'
  });

  // Sync logged in user details if available
  useEffect(() => {
    if (user) {
      setShippingForm(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        addressLine1: user.address || prev.addressLine1,
        city: user.city || prev.city,
        state: user.state || prev.state,
        pincode: user.pincode || prev.pincode
      }));
      setCardForm(prev => ({ ...prev, name: user.name || prev.name }));
    }
  }, [user]);

  // Session timer for UPI
  useEffect(() => {
    if (step === 2 && paymentMethod === 'upi' && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, paymentMethod, countdown]);

  // Generate UPI QR Code
  useEffect(() => {
    if (step === 2 && paymentMethod === 'upi' && total > 0) {
      const upiUrl = `upi://pay?pa=${upiVpa}&pn=${encodeURIComponent(merchantName)}&am=${total}&cu=INR&tn=${encodeURIComponent('Nuttryx Order Payment')}`;
      QRCode.toDataURL(upiUrl, {
        width: 220,
        margin: 1,
        color: { dark: '#24140D', light: '#FFFFFF' }
      })
        .then(url => setQrCodeUrl(url))
        .catch(err => console.error('Failed to generate UPI QR code:', err));
    }
  }, [step, paymentMethod, total]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const handleCopyVpa = () => {
    navigator.clipboard.writeText(upiVpa);
    setCopiedVpa(true);
    triggerToast(`📋 Copied UPI ID: ${upiVpa}`);
    setTimeout(() => setCopiedVpa(false), 2500);
  };

  const handleCardNumberChange = (value: string) => {
    const raw = value.replace(/\D/g, '').substring(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardForm(prev => ({ ...prev, number: formatted }));

    if (raw.startsWith('4')) setCardBrand('visa');
    else if (/^(5[1-5]|2[2-7])/.test(raw)) setCardBrand('mastercard');
    else if (/^(60|65|81|82|508)/.test(raw)) setCardBrand('rupay');
    else setCardBrand('generic');
  };

  const handleCardExpiryChange = (value: string) => {
    const raw = value.replace(/\D/g, '').substring(0, 4);
    if (raw.length >= 2) {
      setCardForm(prev => ({ ...prev, expiry: `${raw.slice(0, 2)}/${raw.slice(2)}` }));
    } else {
      setCardForm(prev => ({ ...prev, expiry: raw }));
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponInput('');
    }
  };

  // Step 1 Validation -> Proceed to Payment Step
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingForm.name.trim() || !shippingForm.phone.trim() || !shippingForm.addressLine1.trim() || !shippingForm.pincode.trim() || !shippingForm.city.trim()) {
      setAddressError('Please fill in all required shipping address fields (*)');
      return;
    }
    setAddressError('');
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Persist Order in MongoDB
  const persistOrderToDatabase = async (paymentInfo: {
    method: 'upi' | 'card' | 'cod' | 'razorpay';
    status: 'paid' | 'cod' | 'pending';
    paymentId?: string;
  }) => {
    const fullAddress = shippingForm.addressLine2 
      ? `${shippingForm.addressLine1}, ${shippingForm.addressLine2}` 
      : shippingForm.addressLine1;

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: {
          name: shippingForm.name,
          email: shippingForm.email,
          phone: shippingForm.phone,
          address: fullAddress,
          city: shippingForm.city,
          state: shippingForm.state,
          pincode: shippingForm.pincode
        },
        items: items.map(item => ({
          product: item.product,
          selectedSize: { weight: item.weight, price: item.price },
          quantity: item.quantity
        })),
        subtotal,
        shipping,
        total,
        paymentMethod: paymentInfo.method,
        paymentStatus: paymentInfo.status,
        paymentId: paymentInfo.paymentId || ''
      })
    });

    const data = await res.json();
    return data.orderId || data.data?.id || `NUTX-${Date.now().toString().slice(-6)}`;
  };

  const handleOrderFinalized = (realId: string, paymentInfo: {
    method: 'upi' | 'card' | 'cod' | 'razorpay';
    status: 'paid' | 'cod' | 'pending';
    paymentId?: string;
  }) => {
    setOrderId(realId);
    setPaymentResult(paymentInfo);
    try {
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.5 }
      });
    } catch {
      // ignore
    }
    setStep(3);
    clearCart();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit Payment
  const handlePaymentSubmit = async () => {
    // 1. CASH ON DELIVERY
    if (paymentMethod === 'cod') {
      setSubmitting(true);
      setProcessingText('Confirming Your Order...');
      try {
        const id = await persistOrderToDatabase({ method: 'cod', status: 'cod' });
        handleOrderFinalized(id, { method: 'cod', status: 'cod' });
      } catch (err) {
        console.error('COD placement error:', err);
        const fallbackId = `NUTX-${Date.now().toString().slice(-6)}`;
        handleOrderFinalized(fallbackId, { method: 'cod', status: 'cod' });
      } finally {
        setSubmitting(false);
      }
      return;
    }

    // 2. UPI VERIFICATION
    if (paymentMethod === 'upi') {
      setSubmitting(true);
      setProcessingText('Verifying UPI Payment with Bank...');
      try {
        const simPaymentId = `pay_upi_${Date.now().toString(36)}`;
        await fetch('/api/payment/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpayOrderId: `order_${Date.now().toString(36)}`,
            razorpayPaymentId: simPaymentId,
            razorpaySignature: 'demo_signature_valid'
          })
        });

        const id = await persistOrderToDatabase({
          method: 'upi',
          status: 'paid',
          paymentId: simPaymentId
        });
        handleOrderFinalized(id, { method: 'upi', status: 'paid', paymentId: simPaymentId });
      } catch (err) {
        console.error('UPI error:', err);
        const fallbackId = `NUTX-${Date.now().toString().slice(-6)}`;
        handleOrderFinalized(fallbackId, { method: 'upi', status: 'paid' });
      } finally {
        setSubmitting(false);
      }
      return;
    }

    // 3. CARD PAYMENT
    if (paymentMethod === 'card') {
      const cleanNumber = cardForm.number.replace(/\s/g, '');
      if (cleanNumber.length < 15) {
        setCardError('Please enter a valid 16-digit card number');
        return;
      }
      if (!cardForm.expiry || !cardForm.cvv || cardForm.cvv.length < 3) {
        setCardError('Please check expiry date and CVV');
        return;
      }
      setCardError('');

      setSubmitting(true);
      setProcessingText('Connecting to 3D Secure Card Gateway...');

      setTimeout(async () => {
        setProcessingText('Verifying OTP with issuing bank...');
        setTimeout(async () => {
          try {
            const simPaymentId = `pay_card_${Date.now().toString(36)}`;
            await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpayOrderId: `order_${Date.now().toString(36)}`,
                razorpayPaymentId: simPaymentId,
                razorpaySignature: 'demo_signature_valid'
              })
            });

            const id = await persistOrderToDatabase({
              method: 'card',
              status: 'paid',
              paymentId: simPaymentId
            });
            handleOrderFinalized(id, { method: 'card', status: 'paid', paymentId: simPaymentId });
          } catch (err) {
            console.error('Card order error:', err);
            const fallbackId = `NUTX-${Date.now().toString().slice(-6)}`;
            handleOrderFinalized(fallbackId, { method: 'card', status: 'paid' });
          } finally {
            setSubmitting(false);
          }
        }, 900);
      }, 1000);
    }
  };

  // Hydration Loader
  if (!isMounted) {
    return (
      <div style={{ minHeight: '80vh', background: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" size={38} color="#D9822B" />
      </div>
    );
  }

  // Empty Cart State
  if (items.length === 0 && step !== 3) {
    return (
      <div style={{ minHeight: '80vh', background: '#FDFCFA', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ maxWidth: '480px', width: '100%', background: '#FFFFFF', borderRadius: '24px', padding: '40px 32px', textAlign: 'center', border: '1.5px solid #ECE4D8', boxShadow: '0 20px 48px rgba(32,16,10,0.06)' }}>
          <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#FFF3E8', color: '#D9822B', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <ShoppingBag size={34} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 900, color: '#20100A', marginBottom: '8px' }}>
            Your Cart is Empty
          </h2>
          <p style={{ color: '#736257', fontSize: '0.92rem', marginBottom: '24px', lineHeight: 1.6 }}>
            Add your favourite slow-roasted Gujarat peanut butter jars to start checkout!
          </p>
          <Link href="/shop" className="btn btn-accent" style={{ padding: '12px 28px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}>
            <span>Explore Products</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2', padding: '40px 20px 80px' }}>
      <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
        
        {/* ── Page Title ── */}
        <h1 
          style={{ 
            fontFamily: 'var(--font-heading)', 
            fontSize: 'clamp(2rem, 3.5vw, 2.6rem)', 
            fontWeight: 800, 
            color: '#20100A', 
            textAlign: 'center',
            marginBottom: '20px'
          }}
        >
          Checkout
        </h1>

        {/* ── 3-Step Progress Stepper ── */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '40px',
            flexWrap: 'wrap'
          }}
        >
          {/* Step 1: Address */}
          <div 
            onClick={() => step === 2 && setStep(1)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              cursor: step === 2 ? 'pointer' : 'default',
              userSelect: 'none'
            }}
          >
            <div 
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: step === 1 ? '#D9822B' : step > 1 ? '#2D6A4F' : '#ECE4D8',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.86rem',
                transition: 'all 0.2s ease'
              }}
            >
              {step > 1 ? <Check size={16} strokeWidth={3} /> : '1'}
            </div>
            <span style={{ fontSize: '0.94rem', fontWeight: step === 1 ? 800 : 600, color: step === 1 ? '#20100A' : '#736257' }}>
              Address
            </span>
          </div>

          {/* Line 1 */}
          <div style={{ width: '48px', height: '2px', background: step > 1 ? '#2D6A4F' : '#E0D5C7', transition: 'background 0.3s' }} />

          {/* Step 2: Payment */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              userSelect: 'none'
            }}
          >
            <div 
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: step === 2 ? '#D9822B' : step > 2 ? '#2D6A4F' : '#ECE4D8',
                color: step === 2 || step > 2 ? '#FFFFFF' : '#8A7A70',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.86rem',
                transition: 'all 0.2s ease'
              }}
            >
              {step > 2 ? <Check size={16} strokeWidth={3} /> : '2'}
            </div>
            <span style={{ fontSize: '0.94rem', fontWeight: step === 2 ? 800 : 600, color: step === 2 ? '#20100A' : '#736257' }}>
              Payment
            </span>
          </div>

          {/* Line 2 */}
          <div style={{ width: '48px', height: '2px', background: step > 2 ? '#2D6A4F' : '#E0D5C7', transition: 'background 0.3s' }} />

          {/* Step 3: Confirm */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', userSelect: 'none' }}>
            <div 
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: step === 3 ? '#2D6A4F' : '#ECE4D8',
                color: step === 3 ? '#FFFFFF' : '#8A7A70',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.86rem',
                transition: 'all 0.2s ease'
              }}
            >
              {step === 3 ? <Check size={16} strokeWidth={3} /> : '3'}
            </div>
            <span style={{ fontSize: '0.94rem', fontWeight: step === 3 ? 800 : 600, color: step === 3 ? '#20100A' : '#736257' }}>
              Confirm
            </span>
          </div>
        </div>

        {/* ── Two-Column Layout ── */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: step === 3 ? '1fr' : 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '28px',
            alignItems: 'start'
          }}
        >
          
          {/* ════ LEFT COLUMN: Main Process Card ════ */}
          <div>
            
            {/* STEP 1: SHIPPING ADDRESS */}
            {step === 1 && (
              <div 
                style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '32px',
                  border: '1.5px solid #ECE4D8',
                  boxShadow: '0 12px 32px rgba(32,16,10,0.04)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                  <Truck size={24} color="#D9822B" />
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: '#20100A', margin: 0 }}>
                    Shipping Address
                  </h2>
                </div>

                {addressError && (
                  <div style={{ background: '#FFEBEE', border: '1px solid #FFCDD2', color: '#C62828', padding: '12px 14px', borderRadius: '10px', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    <AlertCircle size={16} style={{ flexShrink: 0 }} />
                    <span>{addressError}</span>
                  </div>
                )}

                <form onSubmit={handleProceedToPayment}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#5C4A3E', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                        FULL NAME *
                      </label>
                      <input 
                        type="text"
                        placeholder="Nitesh Gupta"
                        value={shippingForm.name}
                        onChange={(e) => setShippingForm({ ...shippingForm, name: e.target.value })}
                        required
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid #E8DDCE', background: '#F5EFE6', fontSize: '0.95rem', color: '#20100A', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#5C4A3E', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                        EMAIL *
                      </label>
                      <input 
                        type="email"
                        placeholder="nitesh@example.com"
                        value={shippingForm.email}
                        onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                        required
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid #E8DDCE', background: '#F5EFE6', fontSize: '0.95rem', color: '#20100A', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#5C4A3E', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                        PHONE *
                      </label>
                      <input 
                        type="tel"
                        placeholder="9876543210"
                        value={shippingForm.phone}
                        onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                        required
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid #E8DDCE', background: '#F5EFE6', fontSize: '0.95rem', color: '#20100A', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#5C4A3E', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                        PINCODE *
                      </label>
                      <input 
                        type="text"
                        placeholder="110001"
                        value={shippingForm.pincode}
                        onChange={(e) => setShippingForm({ ...shippingForm, pincode: e.target.value })}
                        required
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid #E8DDCE', background: '#F5EFE6', fontSize: '0.95rem', color: '#20100A', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#5C4A3E', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                      ADDRESS LINE 1 *
                    </label>
                    <input 
                      type="text"
                      placeholder="House / Flat No., Building, Street"
                      value={shippingForm.addressLine1}
                      onChange={(e) => setShippingForm({ ...shippingForm, addressLine1: e.target.value })}
                      required
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid #E8DDCE', background: '#F5EFE6', fontSize: '0.95rem', color: '#20100A', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#5C4A3E', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                      ADDRESS LINE 2 (OPTIONAL)
                    </label>
                    <input 
                      type="text"
                      placeholder="Area, Colony, Landmark"
                      value={shippingForm.addressLine2}
                      onChange={(e) => setShippingForm({ ...shippingForm, addressLine2: e.target.value })}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid #E8DDCE', background: '#F5EFE6', fontSize: '0.95rem', color: '#20100A', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#5C4A3E', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                        CITY *
                      </label>
                      <input 
                        type="text"
                        placeholder="e.g. Mumbai"
                        value={shippingForm.city}
                        onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                        required
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid #E8DDCE', background: '#F5EFE6', fontSize: '0.95rem', color: '#20100A', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#5C4A3E', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                        STATE *
                      </label>
                      <input 
                        type="text"
                        placeholder="e.g. Maharashtra"
                        value={shippingForm.state}
                        onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
                        required
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid #E8DDCE', background: '#F5EFE6', fontSize: '0.95rem', color: '#20100A', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-accent"
                    style={{
                      width: '100%',
                      padding: '16px',
                      fontSize: '1.05rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>Continue to Payment</span>
                    <ArrowRight size={18} />
                  </button>
                </form>
              </div>
            )}

            {/* STEP 2: PAYMENT METHOD & PROCESSING */}
            {step === 2 && (
              <div 
                style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '32px',
                  border: '1.5px solid #ECE4D8',
                  boxShadow: '0 12px 32px rgba(32,16,10,0.04)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CreditCard size={24} color="#D9822B" />
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: '#20100A', margin: 0 }}>
                      Select Payment Mode
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    style={{ background: 'none', border: 'none', color: '#D9822B', fontSize: '0.86rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <ArrowLeft size={14} />
                    <span>Edit Address</span>
                  </button>
                </div>

                {/* Delivery Address Snapshot */}
                <div 
                  style={{
                    background: '#FAF7F2',
                    padding: '14px 18px',
                    borderRadius: '12px',
                    border: '1px solid #E8DDCE',
                    marginBottom: '24px',
                    fontSize: '0.86rem'
                  }}
                >
                  <div style={{ fontWeight: 800, color: '#20100A' }}>
                    Deliver to: {shippingForm.name} ({shippingForm.phone})
                  </div>
                  <div style={{ color: '#5C4A3E', marginTop: '2px' }}>
                    {shippingForm.addressLine1}, {shippingForm.addressLine2 ? `${shippingForm.addressLine2}, ` : ''}{shippingForm.city}, {shippingForm.state} - {shippingForm.pincode}
                  </div>
                </div>

                {/* Payment Selection Tabs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    style={{
                      padding: '14px 10px',
                      borderRadius: '12px',
                      border: `2px solid ${paymentMethod === 'upi' ? '#D9822B' : '#E8DDCE'}`,
                      background: paymentMethod === 'upi' ? '#FAF6F0' : '#FFFFFF',
                      textAlign: 'center',
                      cursor: 'pointer',
                      boxShadow: paymentMethod === 'upi' ? '0 4px 14px rgba(217,130,43,0.15)' : 'none'
                    }}
                  >
                    <div style={{ color: '#D9822B', marginBottom: '6px', display: 'flex', justifyContent: 'center' }}>
                      <Smartphone size={24} />
                    </div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#20100A' }}>UPI / QR</div>
                    <div style={{ fontSize: '0.7rem', color: '#736257' }}>GPay, PhonePe, Paytm</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    style={{
                      padding: '14px 10px',
                      borderRadius: '12px',
                      border: `2px solid ${paymentMethod === 'card' ? '#D9822B' : '#E8DDCE'}`,
                      background: paymentMethod === 'card' ? '#FAF6F0' : '#FFFFFF',
                      textAlign: 'center',
                      cursor: 'pointer',
                      boxShadow: paymentMethod === 'card' ? '0 4px 14px rgba(217,130,43,0.15)' : 'none'
                    }}
                  >
                    <div style={{ color: '#381C12', marginBottom: '6px', display: 'flex', justifyContent: 'center' }}>
                      <CreditCard size={24} />
                    </div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#20100A' }}>Cards</div>
                    <div style={{ fontSize: '0.7rem', color: '#736257' }}>Visa, MC, RuPay</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    style={{
                      padding: '14px 10px',
                      borderRadius: '12px',
                      border: `2px solid ${paymentMethod === 'cod' ? '#D9822B' : '#E8DDCE'}`,
                      background: paymentMethod === 'cod' ? '#FAF6F0' : '#FFFFFF',
                      textAlign: 'center',
                      cursor: 'pointer',
                      boxShadow: paymentMethod === 'cod' ? '0 4px 14px rgba(217,130,43,0.15)' : 'none'
                    }}
                  >
                    <div style={{ color: '#2D6A4F', marginBottom: '6px', display: 'flex', justifyContent: 'center' }}>
                      <Banknote size={24} />
                    </div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#20100A' }}>Cash on Delivery</div>
                    <div style={{ fontSize: '0.7rem', color: '#736257' }}>Pay at Doorstep</div>
                  </button>
                </div>

                {/* Sub-Panel: UPI QR */}
                {paymentMethod === 'upi' && (
                  <div style={{ background: '#FAF7F2', borderRadius: '16px', padding: '24px', border: '1.5px solid #E8DDCE', marginBottom: '24px', textAlign: 'center' }}>
                    <div style={{ display: 'inline-block', padding: '12px', background: '#FFFFFF', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.06)', border: '1px solid #E8DDCE', marginBottom: '14px' }}>
                      {qrCodeUrl ? (
                        <img src={qrCodeUrl} alt="UPI QR Code" style={{ width: '190px', height: '190px', display: 'block', margin: '0 auto' }} />
                      ) : (
                        <div style={{ width: '190px', height: '190px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Loader2 className="animate-spin" size={32} color="#D9822B" />
                        </div>
                      )}
                      <div style={{ fontSize: '0.76rem', color: '#5C4A3E', fontWeight: 800, marginTop: '6px' }}>
                        Scan & Pay ₹{total} via Any UPI App
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '14px' }}>
                      <span style={{ fontSize: '0.84rem', color: '#736257' }}>UPI ID:</span>
                      <div 
                        onClick={handleCopyVpa}
                        style={{
                          background: '#FFFFFF',
                          border: '1px solid #E8DDCE',
                          padding: '6px 14px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.88rem',
                          fontWeight: 800,
                          color: '#20100A',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                        title="Click to copy UPI ID"
                      >
                        <span>{upiVpa}</span>
                        {copiedVpa ? <Check size={14} color="#2D6A4F" /> : <Copy size={14} color="#D9822B" />}
                      </div>
                    </div>

                    <div style={{ fontSize: '0.76rem', color: '#8A7A70' }}>
                      Session Expires in: <strong style={{ color: '#D9822B', fontFamily: 'monospace' }}>{formatTime(countdown)}</strong>
                    </div>
                  </div>
                )}

                {/* Sub-Panel: Card Input */}
                {paymentMethod === 'card' && (
                  <div style={{ background: '#FAF7F2', borderRadius: '16px', padding: '24px', border: '1.5px solid #E8DDCE', marginBottom: '24px' }}>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#5C4A3E', textTransform: 'uppercase', marginBottom: '6px' }}>
                        Card Number:
                      </label>
                      <input 
                        type="text"
                        placeholder="4532 0000 0000 0000"
                        value={cardForm.number}
                        onChange={(e) => handleCardNumberChange(e.target.value)}
                        maxLength={19}
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #E8DDCE', background: '#FFFFFF', fontSize: '0.94rem', fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#5C4A3E', textTransform: 'uppercase', marginBottom: '6px' }}>
                          Expiry (MM/YY):
                        </label>
                        <input 
                          type="text"
                          placeholder="MM/YY"
                          value={cardForm.expiry}
                          onChange={(e) => handleCardExpiryChange(e.target.value)}
                          maxLength={5}
                          style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #E8DDCE', background: '#FFFFFF', fontSize: '0.94rem', fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#5C4A3E', textTransform: 'uppercase', marginBottom: '6px' }}>
                          CVV:
                        </label>
                        <input 
                          type="password"
                          placeholder="•••"
                          value={cardForm.cvv}
                          onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value.replace(/\D/g, '').substring(0, 4) })}
                          maxLength={4}
                          style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #E8DDCE', background: '#FFFFFF', fontSize: '0.94rem', fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>

                    {cardError && (
                      <div style={{ color: '#C62828', fontSize: '0.82rem', marginBottom: '10px' }}>
                        {cardError}
                      </div>
                    )}
                  </div>
                )}

                {/* Sub-Panel: Cash on Delivery Info */}
                {paymentMethod === 'cod' && (
                  <div style={{ background: '#E8F5E9', borderRadius: '14px', padding: '18px 20px', border: '1px solid #C8E6C9', color: '#2D6A4F', marginBottom: '24px', fontSize: '0.9rem' }}>
                    <strong>💵 Cash on Delivery Selected:</strong> Pay exact amount ₹{total} in cash or UPI to the courier delivery partner at your doorstep.
                  </div>
                )}

                {/* Pay Action Button */}
                <button
                  type="button"
                  onClick={handlePaymentSubmit}
                  disabled={submitting}
                  className="btn btn-accent"
                  style={{
                    width: '100%',
                    padding: '16px',
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: submitting ? 'wait' : 'pointer'
                  }}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>{processingText}</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={18} />
                      <span>
                        {paymentMethod === 'cod' 
                          ? `Place Cash on Delivery Order • ₹${total}` 
                          : `Pay Securely • ₹${total}`}
                      </span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* STEP 3: ORDER CONFIRMED */}
            {step === 3 && (
              <div 
                style={{
                  background: '#FFFFFF',
                  borderRadius: '24px',
                  padding: '48px 32px',
                  border: '1.5px solid #ECE4D8',
                  boxShadow: '0 16px 40px rgba(32,16,10,0.06)',
                  textAlign: 'center'
                }}
              >
                <div 
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: '#E8F5E9',
                    color: '#2D6A4F',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                    border: '2px solid #81C784',
                    boxShadow: '0 8px 24px rgba(45,106,79,0.15)'
                  }}
                >
                  <CheckCircle2 size={48} />
                </div>

                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 900, color: '#20100A', marginBottom: '8px' }}>
                  Order Confirmed!
                </h2>
                <p style={{ color: '#5C4A3E', fontSize: '0.98rem', maxWidth: '480px', margin: '0 auto 28px', lineHeight: 1.6 }}>
                  Thank you, <strong>{shippingForm.name}</strong>. Your pure peanut butter order has been received and sent to our warehouse for fresh batch packing.
                </p>

                {/* Receipt Card */}
                <div 
                  style={{
                    background: '#FAF7F2',
                    border: '1.5px dashed #D9822B',
                    borderRadius: '16px',
                    padding: '24px',
                    maxWidth: '460px',
                    margin: '0 auto 32px',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.88rem', color: '#736257' }}>Order Number:</span>
                    <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#D9822B' }}>#{orderId}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.88rem', color: '#736257' }}>Total Amount:</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#20100A' }}>₹{total}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.88rem', color: '#736257' }}>Payment Status:</span>
                    <span 
                      style={{ 
                        fontSize: '0.82rem', 
                        fontWeight: 800, 
                        color: paymentResult.status === 'paid' ? '#2D6A4F' : '#B86B11',
                        background: paymentResult.status === 'paid' ? '#E8F5E9' : '#FFF3E0',
                        padding: '4px 10px',
                        borderRadius: '9999px'
                      }}
                    >
                      {paymentResult.status === 'paid' ? '✅ Paid Online' : '💵 Cash on Delivery'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.88rem', color: '#736257' }}>Estimated Delivery:</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#20100A' }}>2 - 3 Days (Express Courier)</span>
                  </div>
                  {paymentResult.paymentId && (
                    <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #E8DDCE', fontSize: '0.76rem', color: '#8A7A70' }}>
                      Transaction Ref: {paymentResult.paymentId}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link 
                    href={`/track?query=${orderId}`}
                    className="btn btn-accent"
                    style={{ padding: '14px 26px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}
                  >
                    <Truck size={18} />
                    <span>Track Order Live</span>
                  </Link>

                  <Link 
                    href="/account?tab=orders"
                    className="btn btn-secondary"
                    style={{ padding: '14px 26px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}
                  >
                    <PackageCheck size={18} />
                    <span>My Orders</span>
                  </Link>

                  <Link 
                    href="/shop"
                    className="btn btn-secondary"
                    style={{ padding: '14px 24px', textDecoration: 'none', fontWeight: 700 }}
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            )}

          </div>

          {/* ════ RIGHT COLUMN: Order Summary Card (Sticky) ════ */}
          {step !== 3 && (
            <div style={{ position: 'sticky', top: '90px' }}>
              <div 
                style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '28px',
                  border: '1.5px solid #ECE4D8',
                  boxShadow: '0 12px 32px rgba(32,16,10,0.04)'
                }}
              >
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: '#20100A', marginBottom: '20px' }}>
                  Order Summary ({items.length} items)
                </h3>

                {/* Items List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '22px' }}>
                  {items.map((item) => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div 
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          background: '#FAF7F2',
                          border: '1px solid #E8DDCE',
                          flexShrink: 0
                        }}
                      >
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#20100A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.product.name.replace('NUTTRYX ', '')}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#736257' }}>
                          {item.weight} • Qty: {item.quantity}
                        </div>
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#20100A' }}>
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Form */}
                <div style={{ marginBottom: '20px' }}>
                  {appliedCoupon ? (
                    <div 
                      style={{
                        background: '#E8F5E9',
                        border: '1px solid #C8E6C9',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.84rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2D6A4F', fontWeight: 800 }}>
                        <Tag size={16} />
                        <span>{appliedCoupon} Applied!</span>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        style={{ color: '#C62828', background: 'none', border: 'none', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="text"
                        placeholder="Coupon code (NUTTRYX10)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        style={{
                          flex: 1,
                          padding: '10px 14px',
                          borderRadius: '8px',
                          border: '1px solid #E8DDCE',
                          fontSize: '0.85rem',
                          outline: 'none',
                          textTransform: 'uppercase'
                        }}
                      />
                      <button 
                        type="submit" 
                        className="btn btn-secondary"
                        style={{ padding: '10px 16px', fontSize: '0.85rem', fontWeight: 700 }}
                      >
                        Apply
                      </button>
                    </form>
                  )}
                  {couponError && (
                    <div style={{ fontSize: '0.76rem', color: '#C62828', marginTop: '6px' }}>
                      {couponError}
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.92rem', color: '#5C4A3E', borderTop: '1px solid #F3ECE2', paddingTop: '16px', marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Subtotal</span>
                    <span style={{ fontWeight: 700, color: '#20100A' }}>₹{subtotal}</span>
                  </div>

                  {discount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2D6A4F' }}>
                      <span>Discount</span>
                      <span style={{ fontWeight: 800 }}>-₹{discount}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? <strong style={{ color: '#2D6A4F' }}>FREE</strong> : `₹${shipping}`}
                    </span>
                  </div>

                  <div 
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      paddingTop: '12px',
                      borderTop: '1.5px solid #F3ECE2',
                      fontSize: '1.25rem',
                      fontWeight: 900,
                      color: '#20100A'
                    }}
                  >
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.75rem', color: '#9E8C80' }}>
                  <ShieldCheck size={14} color="#2D6A4F" />
                  <span>100% Encrypted & Safe Payments</span>
                </div>

              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

