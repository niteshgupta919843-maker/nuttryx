'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { PRODUCTS } from '@/data/products';
import { Calculator, Dumbbell, Sparkles, Plus, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ProteinCalculator() {
  const { addToCart } = useCart();
  const [weightKg, setWeightKg] = useState<number>(68);
  const [goal, setGoal] = useState<'muscle' | 'active' | 'wellness'>('muscle');

  const goalMultipliers = {
    muscle: { factor: 1.8, label: 'Muscle Gain & Gym', icon: '🏋️‍♂️', flavourId: 'crunchy-peanut-butter' },
    active: { factor: 1.4, label: 'Active Lifestyle & Sports', icon: '🏃‍♂️', flavourId: 'dark-chocolate' },
    wellness: { factor: 1.0, label: 'Daily Wellness & Energy', icon: '🧘‍♀️', flavourId: 'creamy-peanut-butter' }
  };

  const dailyProteinTarget = Math.round(weightKg * goalMultipliers[goal].factor);
  const nuttryxServingProtein = 10; // 10g in 32g (2 tbsp)
  const spoonsNeeded = Math.ceil(dailyProteinTarget * 0.25 / 5); // 25% protein contributed by Nuttryx
  const percentageMet = Math.min(100, Math.round((nuttryxServingProtein * 2 / dailyProteinTarget) * 100));

  const recommendedProduct = PRODUCTS.find(p => p.id === goalMultipliers[goal].flavourId) || PRODUCTS[0];

  return (
    <section id="nutrition" style={{ padding: '80px 0', background: '#FFFFFF' }}>
      <div id="calculator" style={{ position: 'relative', top: '-70px' }} />
      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="section-tag">
            <Calculator size={14} /> Smart Nutrition Tool
          </span>
          <h2 className="section-title">Daily Protein Goal Calculator</h2>
          <p className="section-desc" style={{ margin: '0 auto' }}>
            Calculate your exact daily protein requirement and see how easy it is to hit your targets with NUTTRYX.
          </p>
        </div>

        <div 
          style={{
            maxWidth: '920px',
            margin: '0 auto',
            background: 'linear-gradient(135deg, #FAF7F2 0%, #F5EFEB 100%)',
            borderRadius: 'var(--radius-xl)',
            border: '2px solid #E8DDCE',
            boxShadow: '0 16px 40px rgba(51, 26, 17, 0.07)',
            padding: 'clamp(18px, 4vw, 40px)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: 'clamp(24px, 4vw, 40px)',
            alignItems: 'center'
          }}
        >
          {/* Controls Column */}
          <div>
            {/* Weight Slider */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
                <label style={{ fontSize: '0.95rem', fontWeight: 800, color: '#20100A' }}>
                  Your Body Weight:
                </label>
                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#D9822B' }}>
                  {weightKg} kg
                </span>
              </div>
              <input 
                type="range" 
                min={40} 
                max={120} 
                value={weightKg} 
                onChange={(e) => setWeightKg(Number(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: '#D9822B',
                  height: '8px',
                  borderRadius: '99px',
                  cursor: 'pointer'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#736257', marginTop: '6px' }}>
                <span>40 kg</span>
                <span>80 kg</span>
                <span>120 kg</span>
              </div>
            </div>

            {/* Goal Selector */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 800, color: '#20100A', marginBottom: '10px' }}>
                Your Primary Fitness Goal:
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(Object.keys(goalMultipliers) as Array<keyof typeof goalMultipliers>).map((g) => {
                  const item = goalMultipliers[g];
                  const isSelected = goal === g;
                  return (
                    <button
                      key={g}
                      onClick={() => setGoal(g)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-md)',
                        border: `1.5px solid ${isSelected ? '#D9822B' : '#E8DDCE'}`,
                        background: isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)',
                        color: '#20100A',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textAlign: 'left',
                        transition: 'all 0.2s ease',
                        boxShadow: isSelected ? '0 4px 14px rgba(217, 130, 43, 0.12)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '1.3rem' }}>{item.icon}</span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{item.label}</div>
                          <div style={{ fontSize: '0.74rem', color: '#736257' }}>
                            {item.factor}g protein / kg body weight
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#D9822B' }}></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Results & Recommendation Card */}
          <div 
            style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              padding: '28px',
              border: '1.5px solid #E8DDCE',
              boxShadow: '0 8px 24px rgba(51, 26, 17, 0.06)',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: '#B87024', letterSpacing: '0.08em' }}>
              Your Recommended Daily Target
            </div>
            
            <div style={{ fontSize: '3rem', fontWeight: 900, color: '#20100A', margin: '4px 0', lineHeight: 1 }}>
              {dailyProteinTarget}g
            </div>
            <div style={{ fontSize: '0.86rem', color: '#5C4A3E', marginBottom: '20px' }}>
              Total clean protein required daily
            </div>

            {/* Nuttryx Fuel Contribution box */}
            <div 
              style={{
                background: '#FAF7F2',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                border: '1px solid #E8DDCE',
                marginBottom: '20px',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Sparkles size={16} color="#D9822B" />
                <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#20100A' }}>
                  The 2-Spoon NUTTRYX Solution
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#736257', lineHeight: 1.5 }}>
                Just <strong>2 tablespoons (32g)</strong> of NUTTRYX gives you <strong>10g clean protein</strong> (over {percentageMet}% of your daily intake) with zero crash and zero insulin spikes!
              </p>
            </div>

            {/* Recommended Product Box */}
            <div style={{ textAlign: 'left', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.76rem', color: '#736257', fontWeight: 700, textTransform: 'uppercase' }}>
                Suggested Flavour For Your Routine:
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                <span style={{ fontWeight: 800, color: '#20100A', fontSize: '0.96rem' }}>
                  {recommendedProduct.name.replace('NUTTRYX ', '')}
                </span>
                <span style={{ fontWeight: 800, color: '#D9822B' }}>
                  ₹{recommendedProduct.sizes[0].price}
                </span>
              </div>
            </div>

            <button
              onClick={() => addToCart(recommendedProduct, '500g', 1)}
              className="btn btn-accent"
              style={{ width: '100%', padding: '12px' }}
            >
              <Plus size={16} /> Add Recommended Jar (500g)
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}
