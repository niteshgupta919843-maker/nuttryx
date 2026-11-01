'use client';

import React from 'react';
import { Flame, ShieldCheck, Cpu, PackageCheck, Sparkles } from 'lucide-react';

export default function ProcessStory() {
  const steps = [
    {
      num: '01',
      title: 'Ethical Sourcing',
      subtitle: 'Saurashtra, Gujarat',
      icon: <Sparkles size={22} />,
      desc: 'We procure only export-grade bold peanuts directly from certified Saurashtra farmers. Every single lot undergoes 14-parameter aflatoxin and purity screening.'
    },
    {
      num: '02',
      title: 'Slow Hot-Air Roasting',
      subtitle: 'Uniform Golden Crunch',
      icon: <Flame size={22} />,
      desc: 'Unlike mass-market factories that burn peanuts in 3 minutes, we gently hot-air roast in micro-batches for 22 minutes to unlock rich natural nutty aromatics.'
    },
    {
      num: '03',
      title: 'Granite Stone Grinding',
      subtitle: 'Zero Heat Shear',
      icon: <Cpu size={22} />,
      desc: 'Our stone mills gently crush the roasted kernels without overheating the natural oils, preserving 100% of the active antioxidants and plant protein.'
    },
    {
      num: '04',
      title: 'Fresh Clean Jarring',
      subtitle: 'Zero Palm Oil',
      icon: <PackageCheck size={22} />,
      desc: 'Immediately jarred and foil-induction sealed to lock in farm-fresh aroma. Dispatched directly to your doorstep with guaranteed freshness.'
    }
  ];

  return (
    <section id="story" style={{ padding: '80px 0', background: '#20100A', color: '#FAF7F2' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span 
            className="section-tag" 
            style={{ 
              background: 'rgba(217, 130, 43, 0.2)', 
              color: '#FFD199', 
              border: '1px solid rgba(217, 130, 43, 0.4)' 
            }}
          >
            <ShieldCheck size={14} /> The Pure Craft
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, color: '#FAF7F2', marginTop: '10px' }}>
            From Gujarat Soil to Your Spoon
          </h2>
          <p style={{ color: '#C8B5A7', maxWidth: '600px', margin: '12px auto 0', fontSize: '1rem', lineHeight: 1.6 }}>
            No chemical emulsifiers, no hydrogenated palm oils, no shortcuts. Just honest Indian peanuts transformed into pure nutrition.
          </p>
        </div>

        {/* Steps Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
            gap: 'clamp(16px, 3vw, 24px)'
          }}
        >
          {steps.map((step, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--radius-lg)',
                padding: '28px',
                position: 'relative',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#D9822B';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.07)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div 
                style={{
                  fontSize: '2rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 900,
                  color: 'rgba(217, 130, 43, 0.4)',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span>{step.num}</span>
                <div 
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(217, 130, 43, 0.15)',
                    color: '#FFD199',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {step.icon}
                </div>
              </div>

              <div style={{ fontSize: '0.78rem', color: '#D9822B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {step.subtitle}
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FAF7F2', marginTop: '4px', marginBottom: '10px' }}>
                {step.title}
              </h3>

              <p style={{ fontSize: '0.86rem', color: '#BBAAA0', lineHeight: 1.6 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
