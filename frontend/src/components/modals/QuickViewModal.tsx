'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { 
  X, 
  ShoppingBag, 
  Star, 
  Check, 
  Dumbbell, 
  Leaf, 
  ShieldCheck, 
  Plus, 
  Minus 
} from 'lucide-react';

export default function QuickViewModal() {
  const { isQuickViewOpen, quickViewProduct, closeQuickView, addToCart } = useCart();
  const [selectedWeight, setSelectedWeight] = useState<string>('500g');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (quickViewProduct) {
      const defaultWeight = quickViewProduct.sizes?.[0]?.weight || '500g';
      setSelectedWeight(defaultWeight);
      setQuantity(1);
    }
  }, [quickViewProduct]);

  if (!isQuickViewOpen || !quickViewProduct) return null;

  const currentSize = quickViewProduct.sizes.find(s => s.weight === selectedWeight) || quickViewProduct.sizes[0];

  const handleAddToCart = () => {
    addToCart(quickViewProduct, currentSize.weight, quantity);
    closeQuickView();
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(20, 10, 5, 0.7)',
        backdropFilter: 'blur(6px)',
        padding: '20px',
        animation: 'fadeIn 0.2s ease'
      }}
      onClick={closeQuickView}
    >
      <div 
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          width: '100%',
          maxWidth: '780px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
          position: 'relative',
          border: '1.5px solid #E8DDCE',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeQuickView}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: '#FAF7F2',
            color: '#381C12',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #E8DDCE',
            zIndex: 10
          }}
        >
          <X size={18} />
        </button>

        {/* Left Image Showcase */}
        <div 
          style={{
            background: 'radial-gradient(circle, #FAF6F0 0%, #F5EFEB 100%)',
            padding: '30px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          <div style={{ width: '100%', height: '320px', position: 'relative' }}>
            <Image 
              src={quickViewProduct.image} 
              alt={quickViewProduct.name}
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <span className="badge-tag badge-green">
              <span className="veg-symbol" style={{ width: '12px', height: '12px' }}></span> 100% Veg
            </span>
            <span className="badge-tag badge-amber">
              <Dumbbell size={12} /> {quickViewProduct.nutrition.proteinPer100g} Protein
            </span>
          </div>
        </div>

        {/* Right Details Column */}
        <div style={{ padding: '32px' }}>
          
          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', color: '#F59E0B' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} fill="#F59E0B" />
              ))}
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#20100A' }}>
              {quickViewProduct.rating} ({quickViewProduct.reviewsCount} reviews)
            </span>
          </div>

          <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#20100A', marginBottom: '6px' }}>
            {quickViewProduct.name}
          </h3>

          <p style={{ fontSize: '0.86rem', color: '#736257', lineHeight: 1.55, marginBottom: '16px' }}>
            {quickViewProduct.description}
          </p>

          {/* Key Nutritional Specs Table */}
          <div 
            style={{
              background: '#FAF7F2',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              border: '1px solid #E8DDCE',
              marginBottom: '20px',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              textAlign: 'center',
              gap: '8px'
            }}
          >
            <div>
              <div style={{ fontSize: '0.7rem', color: '#736257', textTransform: 'uppercase', fontWeight: 700 }}>Protein / 100g</div>
              <div style={{ fontSize: '1rem', fontWeight: 900, color: '#D9822B' }}>{quickViewProduct.nutrition.proteinPer100g}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#736257', textTransform: 'uppercase', fontWeight: 700 }}>Added Sugar</div>
              <div style={{ fontSize: '1rem', fontWeight: 900, color: '#2D6A4F' }}>{quickViewProduct.nutrition.sugarAdded}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#736257', textTransform: 'uppercase', fontWeight: 700 }}>Calories</div>
              <div style={{ fontSize: '1rem', fontWeight: 900, color: '#381C12' }}>{quickViewProduct.nutrition.caloriesPerServing}</div>
            </div>
          </div>

          {/* Ingredients list */}
          <div style={{ fontSize: '0.8rem', color: '#5C4A3E', marginBottom: '18px' }}>
            <strong>Ingredients:</strong> {quickViewProduct.ingredients}
          </div>

          {/* Size Selection */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#20100A', marginBottom: '6px' }}>
              Select Pack Size:
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {quickViewProduct.sizes.map((s) => {
                const isSelected = (currentSize.weight === s.weight);
                return (
                  <button
                    key={s.weight}
                    onClick={() => setSelectedWeight(s.weight)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: `1.5px solid ${isSelected ? '#381C12' : '#E8DDCE'}`,
                      background: isSelected ? '#381C12' : '#FAF7F2',
                      color: isSelected ? '#FFFFFF' : '#381C12',
                      fontWeight: 700,
                      fontSize: '0.84rem'
                    }}
                  >
                    {s.weight}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity & Add to Cart button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#FAF7F2',
                borderRadius: 'var(--radius-full)',
                border: '1px solid #E8DDCE',
                padding: '4px 8px'
              }}
            >
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ padding: '6px 8px', color: '#381C12' }}
              >
                <Minus size={14} />
              </button>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, padding: '0 10px' }}>
                {quantity}
              </span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                style={{ padding: '6px 8px', color: '#381C12' }}
              >
                <Plus size={14} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="btn btn-accent"
              style={{ flex: 1, padding: '12px 20px', fontSize: '0.96rem' }}
            >
              <ShoppingBag size={16} /> Add to Cart • ₹{currentSize.price * quantity}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
