'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Check, X, Sparkles, Award } from 'lucide-react';

export interface ComparisonRow {
  id: string;
  feature: string;
  nuttryx: string;
  regular: string;
  nuttryxWins?: boolean;
  order?: number;
  isActive?: boolean;
}

const DEFAULT_ROWS: ComparisonRow[] = [
  {
    id: 'benefit-1',
    feature: 'Peanut Quality & Sourcing',
    nuttryx: '100% Saurashtra Jumbo Bold Peanuts (Grade A)',
    regular: 'Unspecified split & low-grade bulk peanuts',
    nuttryxWins: true
  },
  {
    id: 'benefit-2',
    feature: 'Hydrogenated Palm Oil / Stabilizers',
    nuttryx: 'ZERO (Never Used - 100% Natural Oil)',
    regular: 'Used heavily to artificially stop oil separation',
    nuttryxWins: true
  },
  {
    id: 'benefit-3',
    feature: 'Added Refined White Sugar',
    nuttryx: '0g (Zero Added Sugar or Glucose Syrup)',
    regular: '15g - 22g hidden sugars & syrups',
    nuttryxWins: true
  },
  {
    id: 'benefit-4',
    feature: 'Pure Protein per 100g',
    nuttryx: '30g Authentic Natural Plant Protein',
    regular: 'Diluted to 18g - 22g due to fillers',
    nuttryxWins: true
  },
  {
    id: 'benefit-5',
    feature: 'Trans Fats & Preservatives',
    nuttryx: '0.0g Trans Fat • Zero Chemical Preservatives',
    regular: 'Often contains trace hydrogenated trans fats',
    nuttryxWins: true
  },
  {
    id: 'benefit-6',
    feature: 'Roasting & Grinding Process',
    nuttryx: 'Precision Hot-Air Slow Roasted & Stone Milled',
    regular: 'Industrial high-heat flash scorching',
    nuttryxWins: true
  }
];

interface ComparisonSectionProps {
  initialBenefit?: any;
}

export default function ComparisonSection({ initialBenefit }: ComparisonSectionProps) {
  const [badge, setBadge] = useState(() => initialBenefit?.badge || 'The Clean Label Revolution');
  const [heading, setHeading] = useState(() => initialBenefit?.heading || 'Why NUTTRYX Wins Hands Down');
  const [description, setDescription] = useState(() => initialBenefit?.description ||
    'We started NUTTRYX because Indian fitness enthusiasts and families deserve genuine, unadulterated peanut butter without toxic palm oil and excessive sugars.'
  );
  const [footerBanner, setFooterBanner] = useState(() => initialBenefit?.footerBanner ||
    'Certified under FSSAI regulations and tested in NABL accredited food testing laboratories.'
  );
  const [footerLinkText, setFooterLinkText] = useState(() => initialBenefit?.footerLinkText || 'Try Pure Taste →');
  const [footerLinkUrl, setFooterLinkUrl] = useState(() => initialBenefit?.footerLinkUrl || '#products');
  const [rows, setRows] = useState<ComparisonRow[]>(() => {
    if (initialBenefit && Array.isArray(initialBenefit.rows) && initialBenefit.rows.length > 0) {
      const active = initialBenefit.rows.filter((r: ComparisonRow) => r.isActive !== false);
      if (active.length > 0) return active;
    }
    return DEFAULT_ROWS;
  });

  useEffect(() => {
    if (initialBenefit) {
      if (initialBenefit.badge) setBadge(initialBenefit.badge);
      if (initialBenefit.heading) setHeading(initialBenefit.heading);
      if (initialBenefit.description) setDescription(initialBenefit.description);
      if (initialBenefit.footerBanner) setFooterBanner(initialBenefit.footerBanner);
      if (initialBenefit.footerLinkText) setFooterLinkText(initialBenefit.footerLinkText);
      if (initialBenefit.footerLinkUrl) setFooterLinkUrl(initialBenefit.footerLinkUrl);
      if (Array.isArray(initialBenefit.rows) && initialBenefit.rows.length > 0) {
        const active = initialBenefit.rows.filter((r: ComparisonRow) => r.isActive !== false);
        setRows(active.length > 0 ? active : initialBenefit.rows);
      }
    }
  }, [initialBenefit]);

  const fetchBenefitData = useCallback(async () => {
    try {
      let res = await fetch(`/api/benefit?_t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) {
        res = await fetch(`https://nuttryx.onrender.com/api/benefit?_t=${Date.now()}`, { cache: 'no-store' });
      }
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          if (json.data.badge) setBadge(json.data.badge);
          if (json.data.heading) setHeading(json.data.heading);
          if (json.data.description) setDescription(json.data.description);
          if (json.data.footerBanner) setFooterBanner(json.data.footerBanner);
          if (json.data.footerLinkText) setFooterLinkText(json.data.footerLinkText);
          if (json.data.footerLinkUrl) setFooterLinkUrl(json.data.footerLinkUrl);
          if (Array.isArray(json.data.rows) && json.data.rows.length > 0) {
            const activeRows = json.data.rows.filter((r: ComparisonRow) => r.isActive !== false);
            setRows(activeRows.length > 0 ? activeRows : json.data.rows);
          }
        }
      }
    } catch {
      // Offline fallback already pre-set
    }
  }, []);

  useEffect(() => {
    fetchBenefitData();

    const handleUpdate = () => {
      fetchBenefitData();
    };

    window.addEventListener('nuttryx_benefit_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    const interval = setInterval(fetchBenefitData, 10000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('nuttryx_benefit_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [fetchBenefitData]);

  return (
    <section id="why-nuttryx" style={{ padding: '80px 0', background: '#FAF7F2' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="section-tag">
            <Award size={14} /> {badge}
          </span>
          <h2 className="section-title">{heading}</h2>
          <p className="section-desc" style={{ margin: '0 auto' }}>
            {description}
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
              {rows.map((row, index) => (
                <div 
                  key={row.id || index}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1fr 1fr',
                    padding: '18px 24px',
                    borderBottom: index < rows.length - 1 ? '1px solid #F3ECE2' : 'none',
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
              <span>{footerBanner}</span>
            </div>
            {footerLinkText && (
              <a href={footerLinkUrl || '#products'} style={{ color: '#D9822B', fontWeight: 700, textDecoration: 'underline' }}>
                {footerLinkText}
              </a>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
