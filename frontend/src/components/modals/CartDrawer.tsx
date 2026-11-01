'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Truck, 
  Sparkles, 
  Gift, 
  ArrowRight,
  Tag
} from 'lucide-react';

export default function CartDrawer() {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    items, 
    removeFromCart, 
    updateQuantity, 
    subtotal, 
    discount, 
    shipping, 
    total, 
    appliedCoupon, 
    applyCoupon, 
    removeCoupon,
    openCheckout,
    openSampleModal
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const freeShippingThreshold = 499;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponInput('');
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1300,
        display: 'flex',
        justifyContent: 'flex-end',
        background: 'rgba(20, 10, 5, 0.65)',
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.2s ease'
      }}
      onClick={() => setIsCartOpen(false)}
    >
      {/* Drawer Window */}
      <div 
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          background: '#FAF7F2',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 40px rgba(0,0,0,0.2)',
          position: 'relative',
          animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #E8DDCE',
            background: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} color="#D9822B" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#20100A' }}>
              Your Nutrition Cart
            </h3>
            <span 
              style={{
                background: '#FAF6F0',
                color: '#381C12',
                border: '1px solid #E8DDCE',
                borderRadius: 'var(--radius-full)',
                padding: '2px 8px',
                fontSize: '0.75rem',
                fontWeight: 800
              }}
            >
              {items.length} items
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#FAF7F2',
              color: '#381C12',
              border: '1px solid #E8DDCE'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div 
          style={{
            padding: '12px 24px',
            background: remainingForFreeShipping === 0 ? '#E8F5E9' : '#FFF8E1',
            borderBottom: '1px solid #E8DDCE',
            fontSize: '0.82rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontWeight: 700, color: remainingForFreeShipping === 0 ? '#2D6A4F' : '#8A531C' }}>
              {remainingForFreeShipping === 0 
                ? '🎉 You unlocked FREE Express Shipping!' 
                : `Add ₹${remainingForFreeShipping} more to unlock FREE Shipping!`}
            </span>
            <Truck size={16} color={remainingForFreeShipping === 0 ? '#2D6A4F' : '#D9822B'} />
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
            <div 
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: remainingForFreeShipping === 0 ? '#2D6A4F' : '#D9822B',
                borderRadius: '99px',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#736257' }}>
              <div 
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  margin: '0 auto 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
                  color: '#D9822B'
                }}
              >
                <ShoppingBag size={32} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#20100A', marginBottom: '6px' }}>
                Your cart is empty
              </h4>
              <p style={{ fontSize: '0.88rem', marginBottom: '20px' }}>
                Add your favourite roasted peanut butter jar and experience clean Indian nutrition!
              </p>
              <a 
                href="#products" 
                onClick={() => setIsCartOpen(false)}
                className="btn btn-primary"
                style={{ padding: '10px 22px', fontSize: '0.9rem' }}
              >
                Browse Flavours
              </a>
            </div>
          ) : (
            items.map((item) => (
              <div 
                key={item.id}
                style={{
                  display: 'flex',
                  gap: '14px',
                  background: '#FFFFFF',
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #E8DDCE',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}
              >
                {/* Product Thumbnail */}
                <div 
                  style={{
                    width: '70px',
                    height: '70px',
                    position: 'relative',
                    borderRadius: '8px',
                    background: '#FAF7F2',
                    flexShrink: 0,
                    overflow: 'hidden'
                  }}
                >
                  <Image 
                    src={item.product.image} 
                    alt={item.product.name} 
                    fill 
                    style={{ objectFit: 'contain', padding: '4px' }} 
                  />
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#20100A', lineHeight: 1.25 }}>
                        {item.product.name.replace('NUTTRYX ', '')}
                      </h4>
                      <span style={{ fontSize: '0.74rem', color: '#736257', fontWeight: 600 }}>
                        Size: {item.weight}
                      </span>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{ color: '#9E8C80', padding: '4px', transition: 'color 0.2s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#E53E3E')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#9E8C80')}
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Quantity and Price */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                    <div 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: '#FAF7F2',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid #E8DDCE',
                        padding: '2px 6px'
                      }}
                    >
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        style={{ padding: '4px 6px', color: '#381C12' }}
                      >
                        <Minus size={13} />
                      </button>
                      <span style={{ fontSize: '0.82rem', fontWeight: 800, padding: '0 8px', minWidth: '18px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        style={{ padding: '4px 6px', color: '#381C12' }}
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 900, color: '#20100A' }}>
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {items.length > 0 && (
          <div 
            style={{
              padding: '20px 24px',
              background: '#FFFFFF',
              borderTop: '1px solid #E8DDCE',
              boxShadow: '0 -4px 16px rgba(0,0,0,0.04)'
            }}
          >
            {/* Coupon Code Section */}
            <div style={{ marginBottom: '16px' }}>
              {appliedCoupon ? (
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#E8F5E9',
                    border: '1px solid #A5D6A7',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.82rem'
                  }}
                >
                  <span style={{ fontWeight: 700, color: '#2D6A4F', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Tag size={14} /> Coupon {appliedCoupon} Applied!
                  </span>
                  <button 
                    onClick={removeCoupon}
                    style={{ color: '#C62828', fontSize: '0.76rem', fontWeight: 700, textDecoration: 'underline' }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    placeholder="Coupon code (e.g. NUTTRYX10)" 
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #E8DDCE',
                      fontSize: '0.82rem',
                      outline: 'none',
                      textTransform: 'uppercase'
                    }}
                  />
                  <button 
                    type="submit" 
                    className="btn btn-secondary"
                    style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && (
                <div style={{ fontSize: '0.74rem', color: '#C62828', marginTop: '4px' }}>
                  {couponError}
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.86rem', color: '#5C4A3E', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: 700, color: '#20100A' }}>₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2D6A4F' }}>
                  <span>Discount</span>
                  <span style={{ fontWeight: 700 }}>-₹{discount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Shipping</span>
                <span>{shipping === 0 ? <strong style={{ color: '#2D6A4F' }}>FREE</strong> : `₹${shipping}`}</span>
              </div>
              <div 
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '8px',
                  borderTop: '1px solid #F3ECE2',
                  fontSize: '1.15rem',
                  fontWeight: 900,
                  color: '#20100A'
                }}
              >
                <span>Total Amount</span>
                <span>₹{total}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <Link
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="btn btn-accent"
              style={{ 
                width: '100%', 
                padding: '14px', 
                fontSize: '1rem', 
                fontWeight: 800,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>Proceed to Checkout (₹{total})</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
