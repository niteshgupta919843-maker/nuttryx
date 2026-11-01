'use client';

import React from 'react';
import { Check, X, Sparkles, ShieldAlert, Award } from 'lucide-react';

export default function ComparisonSection() {
  const comparisonRows = [
    {
      feature: 'Peanut Quality & Sourcing',
      nuttryx: '100% Saurashtra Jumbo Bold Peanuts (Grade A)',
      regular: 'Unspecified split & low-grade bulk peanuts',
      nuttryxWins: true
    },
    {
      feature: 'Hydrogenated Palm Oil / Stabilizers',
      nuttryx: 'ZERO (Never Used - 100% Natural Oil)',
      regular: 'Used heavily to artificially stop oil separation',
      nuttryxWins: true
    },
    {
      feature: 'Added Refined White Sugar',
      nuttryx: '0g (Zero Added Sugar or Glucose Syrup)',
      regular: '15g - 22g hidden sugars & syrups',
      nuttryxWins: true
    },
    {
      feature: 'Pure Protein per 100g',
      nuttryx: '30g Authentic Natural Plant Protein',
      regular: 'Diluted to 18g - 22g due to fillers',
      nuttryxWins: true
    },
    {
      feature: 'Trans Fats & Preservatives',
      nuttryx: '0.0g Trans Fat • Zero Chemical Preservatives',
      regular: 'Often contains trace hydrogenated trans fats',
      nuttryxWins: true
    },
    {
      feature: 'Roasting & Grinding Process',
      nuttryx: 'Precision Hot-Air Slow Roasted & Stone Milled',
      regular: 'Industrial high-heat flash scorching',
      nuttryxWins: true
    }
  ];

  return (
    <section id="why-nuttryx" style={{ padding: '80px 0', background: '#FAF7F2' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="section-tag">
            <Award size={14} /> The Clean Label Revolution
          </span>
          <h2 className="section-title">Why NUTTRYX Wins Hands Down</h2>
          <p className="section-desc" style={{ margin: '0 auto' }}>
            We started NUTTRYX because Indian fitness enthusiasts and families deserve genuine, unadulterated peanut butter without toxic palm oil and excessive sugars.
          </p>
        </div>

        {/* Comparison Table */}
        <div 
          style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            border: '1.5px solid #E8DDCE',
            boxShadow: '0 12px 36px rgba(51, 26, 17, 0.06)',
            overflow: 'hidden'
          }}
        >
          {/* Scrollable table track for mobile & tablet */}
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <div style={{ minWidth: '640px' }}>
              {/* Table Header */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr 1fr',
              background: '#24140D',
              color: '#FFFFFF',
              padding: '20px 24px',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              fontSize: '1rem',
              alignItems: 'center'
            }}
          >
            <div>Nutritional Standard</div>
            <div style={{ color: '#FFD199', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ 
                background: '#D9822B', 
                color: '#FFF', 
                padding: '2px 8px', 
                borderRadius: '4px', 
                fontSize: '0.75rem', 
                fontWeight: 800 
              }}>
                NUTTRYX
              </span>
              <span>Pure Peanut Butter</span>
            </div>
            <div style={{ color: '#BBAAA0', fontSize: '0.9rem' }}>
              Ordinary Commercial Brands
            </div>
          </div>

          {/* Rows */}
          {comparisonRows.map((row, index) => (
            <div 
              key={index}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr 1fr',
                padding: '18px 24px',
                borderBottom: index < comparisonRows.length - 1 ? '1px solid #F3ECE2' : 'none',
                background: index % 2 === 0 ? '#FFFFFF' : '#FDFBF7',
                alignItems: 'center',
                gap: '16px',
                fontSize: '0.92rem'
              }}
            >
              <div style={{ fontWeight: 700, color: '#20100A' }}>
                {row.feature}
              </div>

              {/* Nuttryx Column */}
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  color: '#2D6A4F',
                  fontWeight: 600
                }}
              >
                <div 
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: '#E8F5E9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}
                >
                  <Check size={14} color="#2D6A4F" strokeWidth={3} />
                </div>
                <span>{row.nuttryx}</span>
              </div>

              {/* Competitor Column */}
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  color: '#8A5044'
                }}
              >
                <div 
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: '#FFEBEE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}
                >
                  <X size={14} color="#C62828" strokeWidth={2.5} />
                </div>
                <span>{row.regular}</span>
              </div>
            </div>
          ))}
            </div>
          </div>

          {/* Table Footer Banner */}
          <div 
            style={{
              padding: '16px 24px',
              background: '#FAF6F0',
              borderTop: '1px solid #E8DDCE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              fontSize: '0.85rem',
              color: '#5C4A3E'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} color="#D9822B" />
              <span>Certified under <strong>FSSAI regulations</strong> and tested in NABL accredited food testing laboratories.</span>
            </div>
            <a href="#products" style={{ color: '#D9822B', fontWeight: 700, textDecoration: 'underline' }}>
              Try Pure Taste →
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
