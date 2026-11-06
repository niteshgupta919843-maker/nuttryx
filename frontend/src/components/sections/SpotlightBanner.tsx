'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { PRODUCTS } from '@/data/products';
import { 
  ShoppingBag, 
  Sparkles, 
  Check, 
  Dumbbell, 
  Leaf, 
  ShieldCheck,
  Star,
  Minus,
  Plus
} from 'lucide-react';

export default function SpotlightBanner() {
  const { addToCart, openSampleModal } = useCart();
  const darkChocolateProduct = PRODUCTS.find(p => p.id === 'dark-chocolate') || PRODUCTS[0];

  const sizes = darkChocolateProduct.sizes && darkChocolateProduct.sizes.length > 0
    ? darkChocolateProduct.sizes
    : [
        { weight: '500g', price: 329, originalPrice: 429, inStock: true },
        { weight: '1kg', price: 599, originalPrice: 799, inStock: true }
      ];

  const [selectedWeight, setSelectedWeight] = useState<string>(sizes[0].weight);
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const activeSize = sizes.find(s => s.weight === selectedWeight) || sizes[0];
  const discountPercent = activeSize.originalPrice
    ? Math.round(((activeSize.originalPrice - activeSize.price) / activeSize.originalPrice) * 100)
    : 0;

  const handleQuantity = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(20, prev + delta)));
  };

  const handleAddToCart = () => {
    addToCart(darkChocolateProduct, activeSize.weight, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  return (
    <section style={{ padding: 'clamp(40px, 6vw, 70px) 0', background: '#F8F6F2' }}>
      <div className="container">
        <div 
          className="spotlight-card"
          style={{
            position: 'relative',
            background: 'linear-gradient(135deg, #24120A 0%, #331A0F 50%, #1D0E07 100%)',
            borderRadius: '28px',
            overflow: 'hidden',
            boxShadow: '0 24px 60px rgba(32, 16, 10, 0.28), 0 0 35px rgba(217, 130, 43, 0.12)',
            border: '1.5px solid rgba(217, 130, 43, 0.35)',
            color: '#FFFFFF',
            padding: 'clamp(24px, 4.5vw, 48px)'
          }}
        >
          {/* Ambient lighting glows */}
          <div 
            style={{
              position: 'absolute',
              top: '-20%',
              right: '-10%',
              width: '420px',
              height: '420px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(217, 130, 43, 0.22) 0%, rgba(217, 130, 43, 0) 70%)',
              filter: 'blur(50px)',
              pointerEvents: 'none'
            }}
          />
          <div 
            style={{
              position: 'absolute',
              bottom: '-25%',
              left: '-10%',
              width: '380px',
              height: '380px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(217, 130, 43, 0.18) 0%, rgba(217, 130, 43, 0) 70%)',
              filter: 'blur(50px)',
              pointerEvents: 'none'
            }}
          />

          <div 
            className="spotlight-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
              gap: 'clamp(24px, 4vw, 44px)',
              alignItems: 'center',
              position: 'relative',
              zIndex: 2
            }}
          >
            {/* Left Image Showcase - Dedicated Jar Shot (Fully Framed, Uncropped) */}
            <div 
              className="spotlight-image-wrapper"
              style={{ 
                position: 'relative', 
                height: 'clamp(300px, 40vw, 420px)', 
                width: '100%', 
                borderRadius: '22px', 
                overflow: 'hidden',
                background: 'radial-gradient(circle at center, #3E2115 0%, #20100A 100%)',
                border: '1.5px solid rgba(255, 255, 255, 0.12)',
                boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5), 0 12px 30px rgba(0,0,0,0.35)'
              }}
            >
              <Image 
                src="/images/dark-chocolate-peanut-butter.jpg" 
                alt="NUTTRYX Dark Chocolate Peanut Butter" 
                fill
                style={{ 
                  objectFit: 'cover',
                  objectPosition: 'center',
                  transition: 'transform 0.4s ease'
                }}
                sizes="(max-width: 768px) 100vw, 500px"
                priority
              />

              {/* Floating Bestseller Tag */}
              <div 
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  background: 'rgba(32, 16, 10, 0.88)',
                  backdropFilter: 'blur(8px)',
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  color: '#FFD199',
                  border: '1px solid rgba(217, 130, 43, 0.4)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  zIndex: 2
                }}
              >
                <span>🔥</span>
                <span>Bestseller Flavour</span>
              </div>

              {/* Floating Bottom Pill */}
              <div 
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  right: '16px',
                  background: 'rgba(26, 13, 8, 0.9)',
                  backdropFilter: 'blur(8px)',
                  padding: '8px 14px',
                  borderRadius: '12px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#FAF7F2',
                  border: '1px solid rgba(217, 130, 43, 0.35)',
                  textAlign: 'center',
                  zIndex: 2
                }}
              >
                🍫 Rich Dutch Dark Cocoa • Roasted Gujarat Peanuts
              </div>
            </div>

            {/* Right Information & Action Content */}
            <div>
              {/* Badge + Veg Mark */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
                <span 
                  style={{
                    background: 'rgba(217, 130, 43, 0.25)',
                    color: '#FFD199',
                    border: '1px solid rgba(217, 130, 43, 0.45)',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Sparkles size={13} color="#D9822B" /> India&apos;s Favourite Healthy Treat
                </span>

                <span 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '18px',
                    height: '18px',
                    borderRadius: '3px',
                    border: '1.8px solid #2D6A4F',
                    background: '#FFFFFF',
                    flexShrink: 0
                  }}
                  title="100% Pure Vegetarian"
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2D6A4F' }} />
                </span>

                {/* Rating */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#FFD199', fontWeight: 700 }}>
                  <Star size={14} fill="#D9822B" color="#D9822B" />
                  <span>4.9</span>
                  <span style={{ opacity: 0.7, fontSize: '0.74rem' }}>(1,420+ reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h2 
                style={{
                  fontSize: 'clamp(1.8rem, 3.4vw, 2.7rem)',
                  fontWeight: 900,
                  color: '#FAF7F2',
                  marginBottom: '12px',
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em'
                }}
              >
                Dark Chocolate Peanut Butter
              </h2>

              {/* Paragraph */}
              <p style={{ color: '#D5C4B8', fontSize: 'clamp(0.9rem, 1.2vw, 1rem)', lineHeight: 1.6, marginBottom: '20px' }}>
                Experience the magic where 100% slow-roasted Gujarat peanuts unite with premium Dutch dark cacao. 
                Zero refined sugars, zero vegetable oil, and 100% natural chocolate richness.
              </p>

              {/* 3 Nutrition Micro Badges */}
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  flexWrap: 'wrap',
                  marginBottom: '22px'
                }}
              >
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    padding: '6px 12px',
                    borderRadius: '9999px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#FAF7F2'
                  }}
                >
                  <Dumbbell size={15} color="#D9822B" />
                  <span>High Protein 28g</span>
                </div>

                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    padding: '6px 12px',
                    borderRadius: '9999px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#FAF7F2'
                  }}
                >
                  <Leaf size={15} color="#38A169" />
                  <span>No Added Sugar</span>
                </div>

                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    padding: '6px 12px',
                    borderRadius: '9999px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#FAF7F2'
                  }}
                >
                  <ShieldCheck size={15} color="#FFD199" />
                  <span>Zero Palm Oil</span>
                </div>
              </div>

              {/* Pack Size Selector & Quantity Stepper */}
              <div 
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '16px',
                  padding: '12px 16px',
                  marginBottom: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                {/* Size toggle buttons */}
                <div>
                  <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#FFD199', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.04em' }}>
                    Select Pack Size
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {sizes.map((s) => {
                      const isActive = s.weight === selectedWeight;
                      return (
                        <button
                          key={s.weight}
                          type="button"
                          onClick={() => setSelectedWeight(s.weight)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '8px',
                            border: isActive ? '1.5px solid #D9822B' : '1px solid rgba(255, 255, 255, 0.2)',
                            background: isActive ? '#D9822B' : 'rgba(255, 255, 255, 0.08)',
                            color: '#FFFFFF',
                            fontWeight: 800,
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span>{s.weight}</span>
                          <span style={{ opacity: 0.9, fontSize: '0.76rem' }}>• ₹{s.price}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quantity Stepper */}
                <div>
                  <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#FFD199', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.04em' }}>
                    Quantity
                  </span>
                  <div 
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1.5px solid rgba(255, 255, 255, 0.25)',
                      borderRadius: '9999px',
                      padding: '3px 4px'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleQuantity(-1)}
                      disabled={quantity <= 1}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        border: 'none',
                        background: quantity <= 1 ? 'transparent' : 'rgba(255, 255, 255, 0.15)',
                        color: quantity <= 1 ? 'rgba(255,255,255,0.3)' : '#FFFFFF',
                        cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.15s'
                      }}
                      title="Decrease quantity"
                    >
                      <Minus size={13} strokeWidth={2.5} />
                    </button>

                    <span 
                      style={{
                        minWidth: '32px',
                        textAlign: 'center',
                        fontSize: '0.9rem',
                        fontWeight: 900,
                        color: '#FFFFFF'
                      }}
                    >
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleQuantity(1)}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        border: 'none',
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: '#FFFFFF',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.15s'
                      }}
                      title="Increase quantity"
                    >
                      <Plus size={13} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Pricing Display & Action Buttons */}
              <div 
                className="spotlight-actions"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '14px', 
                  flexWrap: 'wrap' 
                }}
              >
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="spotlight-primary-btn"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    backgroundColor: isAdded ? '#166534' : '#D9822B',
                    color: '#FFFFFF',
                    padding: '13px 28px',
                    borderRadius: '9999px',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    fontSize: '0.96rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 6px 20px rgba(217, 130, 43, 0.4)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isAdded) {
                      e.currentTarget.style.backgroundColor = '#BF6F1F';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isAdded) {
                      e.currentTarget.style.backgroundColor = '#D9822B';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {isAdded ? (
                    <>
                      <Check size={18} />
                      <span>Added {quantity} Jar{quantity > 1 ? 's' : ''}! ✓</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={17} />
                      <span>Add to Cart • ₹{activeSize.price * quantity}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={openSampleModal}
                  className="spotlight-sample-btn"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#FAF7F2',
                    border: '1.5px solid rgba(255, 255, 255, 0.35)',
                    padding: '13px 24px',
                    borderRadius: '9999px',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: '0.94rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.color = '#20100A';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.color = '#FAF7F2';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <span>Request 50g Sample Pack</span>
                </button>
              </div>

              {/* Delivery dispatch assurance */}
              <div style={{ marginTop: '16px', fontSize: '0.78rem', color: '#D5C4B8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Check size={14} color="#38A169" strokeWidth={2.5} />
                <span>Dispatches within 24 hours. Comes with fresh safety seal and batch lab report.</span>
              </div>

            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          .spotlight-actions {
            flex-direction: column !important;
            width: 100% !important;
          }
          .spotlight-primary-btn,
          .spotlight-sample-btn {
            width: 100% !important;
            justify-content: center !important;
          }
        }
      `}</style>
    </section>
  );
}
