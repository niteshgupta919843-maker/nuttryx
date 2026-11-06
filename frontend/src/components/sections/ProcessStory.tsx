'use client';

import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  ShieldCheck, 
  Cpu, 
  PackageCheck, 
  Sparkles, 
  Award, 
  Zap, 
  Heart, 
  CheckCircle,
  Truck,
  Leaf
} from 'lucide-react';

interface CraftStepItem {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  icon?: string;
  desc: string;
  order?: number;
  isActive?: boolean;
}

interface CraftStoryData {
  badge: string;
  heading: string;
  description: string;
  steps: CraftStepItem[];
  isActive?: boolean;
}

const DEFAULT_STORY: CraftStoryData = {
  badge: 'The Pure Craft',
  heading: 'From Gujarat Soil to Your Spoon',
  description: 'No chemical emulsifiers, no hydrogenated palm oils, no shortcuts. Just honest Indian peanuts transformed into pure nutrition.',
  steps: [
    {
      id: 'step-1',
      num: '01',
      title: 'Ethical Sourcing',
      subtitle: 'Saurashtra, Gujarat',
      icon: 'Sparkles',
      desc: 'We procure only export-grade bold peanuts directly from certified Saurashtra farmers. Every single lot undergoes 14-parameter aflatoxin and purity screening.',
      order: 1
    },
    {
      id: 'step-2',
      num: '02',
      title: 'Slow Hot-Air Roasting',
      subtitle: 'Uniform Golden Crunch',
      icon: 'Flame',
      desc: 'Unlike mass-market factories that burn peanuts in 3 minutes, we gently hot-air roast in micro-batches for 22 minutes to unlock rich natural nutty aromatics.',
      order: 2
    },
    {
      id: 'step-3',
      num: '03',
      title: 'Granite Stone Grinding',
      subtitle: 'Zero Heat Shear',
      icon: 'Cpu',
      desc: 'Our stone mills gently crush the roasted kernels without overheating the natural oils, preserving 100% of the active antioxidants and plant protein.',
      order: 3
    },
    {
      id: 'step-4',
      num: '04',
      title: 'Fresh Clean Jarring',
      subtitle: 'Zero Palm Oil',
      icon: 'PackageCheck',
      desc: 'Immediately jarred and foil-induction sealed to lock in farm-fresh aroma. Dispatched directly to your doorstep with guaranteed freshness.',
      order: 4
    }
  ]
};

export default function ProcessStory() {
  const [story, setStory] = useState<CraftStoryData>(DEFAULT_STORY);

  const fetchLiveCraft = async () => {
    try {
      const res = await fetch(`/api/craft?_t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setStory({
            badge: json.data.badge || DEFAULT_STORY.badge,
            heading: json.data.heading || DEFAULT_STORY.heading,
            description: json.data.description || DEFAULT_STORY.description,
            steps: Array.isArray(json.data.steps) && json.data.steps.length > 0 
              ? json.data.steps.filter((s: CraftStepItem) => s.isActive !== false)
              : DEFAULT_STORY.steps,
            isActive: json.data.isActive !== false
          });
        }
      }
    } catch {
      // Keep fallback data
    }
  };

  useEffect(() => {
    fetchLiveCraft();

    const onUpdate = () => fetchLiveCraft();
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'nuttryx_craft_updated') fetchLiveCraft();
    };

    window.addEventListener('focus', onUpdate);
    window.addEventListener('storage', onStorage);
    window.addEventListener('nuttryx_craft_updated', onUpdate);

    const interval = setInterval(fetchLiveCraft, 10000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onUpdate);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('nuttryx_craft_updated', onUpdate);
    };
  }, []);

  if (story.isActive === false) return null;

  const renderIcon = (iconName?: string) => {
    switch (iconName?.toLowerCase()) {
      case 'flame':
        return <Flame size={22} />;
      case 'cpu':
        return <Cpu size={22} />;
      case 'packagecheck':
      case 'package':
        return <PackageCheck size={22} />;
      case 'shieldcheck':
      case 'shield':
        return <ShieldCheck size={22} />;
      case 'award':
        return <Award size={22} />;
      case 'zap':
        return <Zap size={22} />;
      case 'heart':
        return <Heart size={22} />;
      case 'checkcircle':
      case 'check':
        return <CheckCircle size={22} />;
      case 'truck':
        return <Truck size={22} />;
      case 'leaf':
        return <Leaf size={22} />;
      case 'sparkles':
      default:
        return <Sparkles size={22} />;
    }
  };

  const sortedSteps = [...story.steps].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <section id="story" style={{ padding: '80px 0', background: '#20100A', color: '#FAF7F2' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span 
            className="section-tag" 
            style={{ 
              background: 'rgba(217, 130, 43, 0.2)', 
              color: '#FFD199', 
              border: '1px solid rgba(217, 130, 43, 0.4)' 
            }}
          >
            <ShieldCheck size={14} /> {story.badge || 'The Pure Craft'}
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, color: '#FAF7F2', marginTop: '10px' }}>
            {story.heading || 'From Gujarat Soil to Your Spoon'}
          </h2>
          <p style={{ color: '#C8B5A7', maxWidth: '600px', margin: '12px auto 0', fontSize: '1rem', lineHeight: 1.6 }}>
            {story.description || 'No chemical emulsifiers, no hydrogenated palm oils, no shortcuts. Just honest Indian peanuts transformed into pure nutrition.'}
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
          {sortedSteps.map((step, idx) => (
            <div
              key={step.id || idx}
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
                <span>{step.num || `0${idx + 1}`}</span>
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
                  {renderIcon(step.icon)}
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
