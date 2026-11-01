'use client';

import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, 
  GraduationCap, 
  Laptop, 
  Users, 
  Sparkles, 
  CheckCircle2,
  Heart,
  Zap,
  ShieldCheck,
  Award,
  Smile,
  Activity
} from 'lucide-react';

interface LifestylePillarItem {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  desc: string;
  perk: string;
  order?: number;
  isActive?: boolean;
}

const DEFAULT_PILLARS: LifestylePillarItem[] = [
  {
    id: 'lifestyle-1',
    icon: 'Dumbbell',
    title: 'Supports Fitness',
    subtitle: 'Gym & Athletes',
    desc: '30g plant protein per 100g supplies clean amino acids for muscle repair and endurance without bloating or hydrogenated oils.',
    perk: 'Ideal pre/post workout fuel',
    order: 1
  },
  {
    id: 'lifestyle-2',
    icon: 'GraduationCap',
    title: 'Fuels Students',
    subtitle: 'Late Nights & Exams',
    desc: 'Rich in vitamin E, magnesium and healthy fats that enhance cognitive focus, memory retention, and all-night study power.',
    perk: 'Sustained energy, zero crash',
    order: 2
  },
  {
    id: 'lifestyle-3',
    icon: 'Laptop',
    title: 'Working Professionals',
    subtitle: 'Busy Workdays',
    desc: 'No time for breakfast? Spread on brown bread or blend in a 60-second smoothie for 4+ hours of full productivity.',
    perk: 'Zero mid-afternoon slump',
    order: 3
  },
  {
    id: 'lifestyle-4',
    icon: 'Users',
    title: 'Healthier Families',
    subtitle: 'Kids & Parents',
    desc: 'Pure clean nutrition without chemical stabilizers or hidden cane sugars. Wholesome goodness every mom can trust completely.',
    perk: '100% kid-safe pure ingredients',
    order: 4
  }
];

export default function TickerStrip() {
  const [activeTab, setActiveTab] = useState(0);
  const [marqueeItems, setMarqueeItems] = useState<string[]>([
    '🔥 100% Slow Roasted Saurashtra Peanuts',
    '💪 30g Pure Plant Protein',
    '🚫 Zero Added Refined Sugar',
    '🌿 Zero Palm Oil or Trans Fats',
    '🌱 100% Pure Vegetarian Certified',
    '🚚 Free Express Shipping Over ₹499',
    '🎁 Free 50g Sample with Every Order',
    '🇮🇳 Made with Pride in India'
  ]);

  // Lifestyle Section State
  const [lifestyleBadge, setLifestyleBadge] = useState('Built For Every Lifestyle');
  const [lifestyleHeading, setLifestyleHeading] = useState('Who Is NUTTRYX Crafted For?');
  const [lifestyleDesc, setLifestyleDesc] = useState('From high-performance gym workouts to busy laptop desks and school lunchboxes, our pure peanut butter fuels your daily journey.');
  const [pillars, setPillars] = useState<LifestylePillarItem[]>(DEFAULT_PILLARS);

  useEffect(() => {
    const fetchTicker = async () => {
      try {
        const timestamp = Date.now();
        let res = await fetch(`/api/ticker?_t=${timestamp}`, { cache: 'no-store' });
        if (!res.ok) res = await fetch(`http://localhost:5000/api/ticker?_t=${timestamp}`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            setMarqueeItems(json.data);
          }
        }
      } catch {
        // Fallback to initial
      }
    };

    const fetchLifestyle = async () => {
      try {
        const timestamp = Date.now();
        let res = await fetch(`/api/lifestyle?_t=${timestamp}`, { cache: 'no-store' });
        if (!res.ok) res = await fetch(`http://localhost:5000/api/lifestyle?_t=${timestamp}`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            if (json.data.badge) setLifestyleBadge(json.data.badge);
            if (json.data.heading) setLifestyleHeading(json.data.heading);
            if (json.data.description) setLifestyleDesc(json.data.description);
            if (Array.isArray(json.data.pillars) && json.data.pillars.length > 0) {
              setPillars(json.data.pillars.filter((p: LifestylePillarItem) => p.isActive !== false));
            }
          }
        }
      } catch {
        // Fallback
      }
    };

    fetchTicker();
    fetchLifestyle();

    const interval = setInterval(() => {
      fetchTicker();
      fetchLifestyle();
    }, 10000);

    const onFocus = () => {
      fetchTicker();
      fetchLifestyle();
    };

    window.addEventListener('focus', onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  const renderIcon = (iconName?: string) => {
    switch (iconName?.toLowerCase()) {
      case 'dumbbell':
      case 'fitness':
        return <Dumbbell size={24} />;
      case 'graduationcap':
      case 'student':
        return <GraduationCap size={24} />;
      case 'laptop':
      case 'work':
        return <Laptop size={24} />;
      case 'users':
      case 'family':
        return <Users size={24} />;
      case 'heart':
        return <Heart size={24} />;
      case 'zap':
        return <Zap size={24} />;
      case 'shieldcheck':
        return <ShieldCheck size={24} />;
      case 'award':
        return <Award size={24} />;
      case 'smile':
        return <Smile size={24} />;
      case 'activity':
        return <Activity size={24} />;
      default:
        return <Sparkles size={24} />;
    }
  };

  const sortedPillars = [...pillars].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <section style={{ background: '#FAF7F2', borderTop: '1px solid #E8DDCE', borderBottom: '1px solid #E8DDCE' }}>
      
      {/* Infinite Marquee Ticker */}
      <div 
        style={{
          background: '#24140D',
          color: '#FAF7F2',
          padding: '12px 0',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          borderBottom: '1px solid rgba(217, 130, 43, 0.3)'
        }}
      >
        <div className="marquee-inner">
          {[...marqueeItems, ...marqueeItems].map((item, idx) => (
            <div 
              key={idx}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                marginRight: '36px',
                fontSize: '0.86rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                fontFamily: 'var(--font-heading)'
              }}
            >
              <span>{item}</span>
              <span style={{ color: '#D9822B' }}>•</span>
            </div>
          ))}
        </div>
      </div>

      {/* Brand Pillars (Interactive Audience Focus) */}
      <div className="container" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span className="section-tag">
            <Sparkles size={14} /> {lifestyleBadge || 'Built For Every Lifestyle'}
          </span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.3rem)', fontWeight: 800, color: '#20100A' }}>
            {lifestyleHeading || 'Who Is NUTTRYX Crafted For?'}
          </h2>
          <p style={{ color: '#736257', maxWidth: '560px', margin: '8px auto 0', fontSize: '0.96rem' }}>
            {lifestyleDesc || 'From high-performance gym workouts to busy laptop desks and school lunchboxes, our pure peanut butter fuels your daily journey.'}
          </p>
        </div>

        {/* Cards Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}
        >
          {sortedPillars.map((item, index) => {
            const isSelected = activeTab === index;
            return (
              <div
                key={item.id || index}
                onClick={() => setActiveTab(index)}
                style={{
                  background: isSelected ? '#FFFFFF' : '#FAF6F0',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px',
                  border: `2px solid ${isSelected ? '#D9822B' : '#E8DDCE'}`,
                  boxShadow: isSelected ? '0 12px 30px rgba(217, 130, 43, 0.15)' : '0 4px 12px rgba(51, 26, 17, 0.04)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  position: 'relative'
                }}
              >
                <div 
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    background: isSelected ? 'linear-gradient(135deg, #381C12 0%, #20100A 100%)' : '#FFFFFF',
                    color: isSelected ? '#FFD199' : '#D9822B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                    boxShadow: '0 4px 12px rgba(51, 26, 17, 0.06)'
                  }}
                >
                  {renderIcon(item.icon)}
                </div>

                <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#B87024', letterSpacing: '0.06em' }}>
                  {item.subtitle}
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#20100A', marginTop: '4px', marginBottom: '8px' }}>
                  {item.title}
                </h3>

                <p style={{ fontSize: '0.88rem', color: '#5C4A3E', lineHeight: 1.55, marginBottom: '16px' }}>
                  {item.desc}
                </p>

                <div 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#2D6A4F',
                    background: '#E8F5E9',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)'
                  }}
                >
                  <CheckCircle2 size={13} />
                  {item.perk}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
