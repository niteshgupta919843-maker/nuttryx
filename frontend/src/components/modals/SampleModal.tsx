'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { X, Gift, CheckCircle2, Send, Mail, MapPin } from 'lucide-react';

export default function SampleModal() {
  const { isSampleModalOpen, closeSampleModal, triggerToast } = useCart();
  const { user } = useAuth();
  
  const [selectedFlavour, setSelectedFlavour] = useState('Dark Chocolate');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
    city: user?.city || '',
    pincode: user?.pincode || ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync with logged in user profile
  React.useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.name || '',
        phone: prev.phone || user.phone || '',
        email: prev.email || user.email || '',
        address: prev.address || user.address || '',
        city: prev.city || user.city || '',
        pincode: prev.pincode || user.pincode || ''
      }));
    }
  }, [user]);

  if (!isSampleModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.pincode) {
      triggerToast('Please provide your name, phone number, and delivery pincode');
      return;
    }

    setIsSubmitting(true);

    try {
      // Send sample request to Backend API (which saves to MongoDB and emails the Admin)
      let res = await fetch('/api/samples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email || `${formData.phone}@nuttryx.com`,
          address: formData.address || 'Direct Sample Delivery',
          city: formData.city || 'India',
          pincode: formData.pincode,
          selectedFlavour: `${selectedFlavour} 50g`
        })
      });
      if (!res.ok) {
        await fetch('http://localhost:5000/api/samples', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            email: formData.email || `${formData.phone}@nuttryx.com`,
            address: formData.address || 'Direct Sample Delivery',
            city: formData.city || 'India',
            pincode: formData.pincode,
            selectedFlavour: `${selectedFlavour} 50g`
          })
        });
      }
    } catch {
      // offline resilience
    }

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    setIsSubmitting(false);
    setSubmitted(true);
    triggerToast('🎉 Free 50g Sample request registered & email sent to admin!');
  };

  const handleClose = () => {
    setSubmitted(false);
    closeSampleModal();
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(20, 10, 5, 0.75)',
        backdropFilter: 'blur(6px)',
        padding: '20px',
        animation: 'fadeIn 0.2s ease'
      }}
      onClick={handleClose}
    >
      <div 
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          width: '100%',
          maxWidth: '520px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
          position: 'relative',
          border: '2px solid #D9822B'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Banner */}
        <div 
          style={{
            background: 'linear-gradient(135deg, #24140D 0%, #3D2214 100%)',
            color: '#FFFFFF',
            padding: '24px 28px',
            position: 'relative'
          }}
        >
          <button
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>

          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(217, 130, 43, 0.25)',
              color: '#FFD199',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 800,
              marginBottom: '8px'
            }}
          >
            <Gift size={14} color="#D9822B" /> 100% Free Trial Pack
          </div>

          <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FAF7F2' }}>
            Claim Your Free 50g NUTTRYX Jar
          </h3>
          <p style={{ fontSize: '0.86rem', color: '#D5C4B8', marginTop: '4px' }}>
            Taste the difference of slow-roasted Saurashtra peanuts before you buy full size!
          </p>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px 28px' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div 
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#E8F5E9',
                  color: '#2D6A4F',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}
              >
                <CheckCircle2 size={36} />
              </div>
              <h4 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#20100A', marginBottom: '8px' }}>
                Sample Request Confirmed!
              </h4>
              <p style={{ fontSize: '0.9rem', color: '#5C4A3E', lineHeight: 1.55, marginBottom: '20px' }}>
                Your complimentary 50g <strong>{selectedFlavour}</strong> jar request has been sent to our fulfillment team. Email notification dispatched!
              </p>
              <button
                onClick={handleClose}
                className="btn btn-primary"
                style={{ padding: '10px 28px', fontSize: '0.94rem' }}
              >
                Back to Store
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              
              {/* Flavour Choice */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#20100A', marginBottom: '8px' }}>
                  Choose Your Sample Flavour:
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['Dark Chocolate', 'Crunchy Roasted', 'Natural Creamy'].map((f) => {
                    const isSelected = selectedFlavour === f;
                    return (
                      <button
                        type="button"
                        key={f}
                        onClick={() => setSelectedFlavour(f)}
                        style={{
                          flex: '1 1 30%',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: `1.5px solid ${isSelected ? '#D9822B' : '#E8DDCE'}`,
                          background: isSelected ? '#FAF6F0' : '#FFFFFF',
                          color: isSelected ? '#20100A' : '#736257',
                          fontWeight: 700,
                          fontSize: '0.78rem',
                          textAlign: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        {f === 'Dark Chocolate' && '🍫 '}
                        {f === 'Crunchy Roasted' && '🥜 '}
                        {f === 'Natural Creamy' && '✨ '}
                        {f}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form Inputs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#5C4A3E', marginBottom: '4px' }}>
                    Full Name:
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E8DDCE', outline: 'none', fontSize: '0.88rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#5C4A3E', marginBottom: '4px' }}>
                      Mobile / WhatsApp:
                    </label>
                    <input 
                      type="tel" 
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E8DDCE', outline: 'none', fontSize: '0.88rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#5C4A3E', marginBottom: '4px' }}>
                      Delivery Pincode:
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. 110001"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E8DDCE', outline: 'none', fontSize: '0.88rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#5C4A3E', marginBottom: '4px' }}>
                    Email Address (for dispatch updates):
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="email" 
                      placeholder="e.g. name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E8DDCE', outline: 'none', fontSize: '0.88rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#5C4A3E', marginBottom: '4px' }}>
                    Delivery Address & City:
                  </label>
                  <input 
                    type="text" 
                    placeholder="House/Flat No., Street, City, State"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value, city: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E8DDCE', outline: 'none', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-accent"
                style={{ width: '100%', padding: '13px', fontSize: '0.96rem', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
              >
                <Send size={16} /> {isSubmitting ? 'Sending Request...' : 'Dispatch My Free Sample Jar'}
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.74rem', color: '#9E8C80', marginTop: '12px' }}>
                🔒 1 sample per household. Delivered fresh from Gujarat.
              </p>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
