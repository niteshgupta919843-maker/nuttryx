'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { 
  ArrowRight, 
  Dumbbell, 
  Leaf, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight,
  GraduationCap,
  Laptop,
  Users
} from 'lucide-react';

interface HeroSlide {
  id: string;
  name: string;
  subtitle: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  bannerImage: string;
  buttonText?: string;
  buttonLink?: string;
  sampleButtonText?: string;
  badges: {
    icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
    label: string;
  }[];
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-dark-chocolate',
    name: 'NUTTRYX Dark Chocolate Peanut Butter',
    subtitle: 'PURE PEANUT BUTTER',
    titleLine1: 'Creamy. Roasted.',
    titleLine2: 'Protein Rich.',
    description: 'Fuel your fitness, work, and daily life with the natural power of real peanuts.',
    bannerImage: '/images/hero-bg-dark-chocolate.jpg',
    buttonText: 'Shop Now',
    buttonLink: '/shop',
    sampleButtonText: 'Book 50g Sample',
    badges: [
      { icon: Dumbbell, label: 'HIGH\nPROTEIN' },
      { icon: Leaf, label: 'NO ADDED\nSUGAR' },
      { icon: ShieldCheck, label: '100%\nNATURAL' }
    ]
  },
  {
    id: 'slide-creamy',
    name: 'NUTTRYX Natural Creamy Peanut Butter',
    subtitle: '100% PURE & NATURAL',
    titleLine1: 'Silky Smooth.',
    titleLine2: 'Zero Added Sugar.',
    description: 'Handcrafted from slow-roasted Saurashtra peanuts for an ultra-smooth, creamy texture.',
    bannerImage: '/images/hero-bg-creamy.jpg',
    buttonText: 'Shop Now',
    buttonLink: '/shop',
    sampleButtonText: 'Book 50g Sample',
    badges: [
      { icon: Dumbbell, label: 'HIGH\nPROTEIN' },
      { icon: Leaf, label: 'NO ADDED\nSUGAR' },
      { icon: ShieldCheck, label: '100%\nNATURAL' }
    ]
  },
  {
    id: 'slide-crunchy',
    name: 'NUTTRYX Roasted Crunchy Peanut Butter',
    subtitle: 'EXTRA CRUNCH & FIBER',
    titleLine1: 'Bold Crunch.',
    titleLine2: 'Power Packed.',
    description: 'Loaded with real crispy roasted peanut bits in every spoonful for high-protein workouts.',
    bannerImage: '/images/hero-bg-crunchy.jpg',
    buttonText: 'Shop Now',
    buttonLink: '/shop',
    sampleButtonText: 'Book 50g Sample',
    badges: [
      { icon: Dumbbell, label: 'HIGH\nPROTEIN' },
      { icon: Leaf, label: 'NO ADDED\nSUGAR' },
      { icon: ShieldCheck, label: '100%\nNATURAL' }
    ]
  }
];

const FEATURE_RIBBON = [
  { icon: Leaf, title: 'Made from', subtitle: 'Roasted Peanuts' },
  { icon: Dumbbell, title: 'Supports', subtitle: 'Fitness Goals' },
  { icon: GraduationCap, title: 'Great for', subtitle: 'Students' },
  { icon: Laptop, title: 'Perfect for', subtitle: 'Working Professionals' },
  { icon: Users, title: 'Healthy Choice', subtitle: 'for Families' }
];

export default function Hero() {
  const { openSampleModal } = useCart();
  const [slides, setSlides] = useState<HeroSlide[]>(HERO_SLIDES);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync slides with MongoDB backend in real-time
  useEffect(() => {
    const fetchLiveSlides = async () => {
      try {
        const timestamp = Date.now();
        let res = await fetch(`/api/slides?_t=${timestamp}`, { cache: 'no-store' });
        if (!res.ok) res = await fetch(`http://localhost:5000/api/slides?_t=${timestamp}`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            const mapped: HeroSlide[] = json.data
              .filter((s: any) => s.isActive !== false)
              .map((s: any) => ({
                id: s.id,
                name: s.name,
                subtitle: s.subtitle || 'PURE PEANUT BUTTER',
                titleLine1: s.titleLine1 || 'Creamy. Roasted.',
                titleLine2: s.titleLine2 || 'Protein Rich.',
                description: s.description || 'Fuel your fitness, work, and daily life with the natural power of real peanuts.',
                bannerImage: s.bannerImage || '/images/hero-bg-dark-chocolate.jpg',
                buttonText: s.buttonText || 'Shop Now',
                buttonLink: s.buttonLink || '/shop',
                sampleButtonText: s.sampleButtonText || 'Book 50g Sample',
                badges: [
                  { icon: Dumbbell, label: s.badge1 || 'HIGH\nPROTEIN' },
                  { icon: Leaf, label: s.badge2 || 'NO ADDED\nSUGAR' },
                  { icon: ShieldCheck, label: s.badge3 || '100%\nNATURAL' }
                ]
              }));
            if (mapped.length > 0) {
              setSlides(mapped);
            }
          }
        }
      } catch {
        // Fallback to initial
      }
    };

    fetchLiveSlides();
    const interval = setInterval(fetchLiveSlides, 5000); // 5s real-time live sync
    const onFocus = () => fetchLiveSlides();
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'nuttryx_slides_updated') {
        fetchLiveSlides();
      }
    };
    const onCustomUpdate = () => fetchLiveSlides();

    window.addEventListener('focus', onFocus);
    window.addEventListener('storage', onStorage);
    window.addEventListener('nuttryx_slides_updated', onCustomUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('nuttryx_slides_updated', onCustomUpdate);
    };
  }, []);

  const totalSlides = slides.length || 1;
  const currentSlide = slides[currentSlideIndex % totalSlides] || HERO_SLIDES[0];

  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % totalSlides);
    }, 6000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, currentSlideIndex, totalSlides]);

  const goToPrev = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % totalSlides);
  };

  return (
    <section 
      id="home"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#F5ECE1',
        overflow: 'hidden'
      }}
    >
      {/* ═══ Main Full-Bleed 100vw Banner Canvas ═══ */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          minHeight: 'clamp(420px, 46vw, 540px)',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden'
        }}
        className="hero-viewport"
      >
        {/* Full-width 100% Edge-to-Edge Background Image */}
        {slides.map((slide, index) => {
          const isActive = index === currentSlideIndex;
          if (!isActive) return null;
          return (
            <div
              key={slide.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 1,
                pointerEvents: 'none',
                animation: 'fadeIn 0.5s ease-out'
              }}
            >
              <Image
                src={slide.bannerImage}
                alt={slide.name}
                fill
                priority={index === 0}
                sizes="100vw"
                quality={85}
                unoptimized={slide.bannerImage.startsWith('data:') || slide.bannerImage.startsWith('http')}
                style={{
                  objectFit: 'cover',
                  objectPosition: 'right center'
                }}
              />
            </div>
          );
        })}

        {/* Soft Warm Studio Gradient Scrim on Left: perfectly balanced, never cuts off */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to right, rgba(247, 241, 233, 0.98) 0%, rgba(247, 241, 233, 0.92) 35%, rgba(247, 241, 233, 0.45) 55%, transparent 80%)',
            zIndex: 2,
            pointerEvents: 'none'
          }}
          className="hero-scrim"
        />

        {/* Typography & CTA Content (Left Padded, Fully Responsive) */}
        <div 
          className="hero-content-padding"
          style={{ 
            position: 'relative', 
            zIndex: 3,
            width: '100%',
            maxWidth: '1380px',
            margin: '0 auto',
            padding: '48px clamp(16px, 5vw, 64px)'
          }}
        >
          <div 
            key={currentSlide.id}
            style={{ 
              maxWidth: '560px',
              animation: 'fadeIn 0.35s ease-out'
            }}
          >
            {/* Subtitle */}
            <p
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(0.75rem, 1.2vw, 0.95rem)',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#2B140A',
                marginBottom: '12px',
                opacity: 0.9
              }}
            >
              {currentSlide.subtitle}
            </p>

            {/* Main Headline */}
            <h1 
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 5.5vw, 4.2rem)',
                fontWeight: 900,
                color: '#20100A',
                lineHeight: 1.1,
                marginBottom: '16px',
                letterSpacing: '-0.03em'
              }}
            >
              {currentSlide.titleLine1}
              <br />
              {currentSlide.titleLine2}
            </h1>

            {/* Description */}
            <p 
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.9rem, 2vw, 1.05rem)',
                color: '#4B382D',
                lineHeight: 1.55,
                maxWidth: '440px',
                marginBottom: '24px',
                fontWeight: 500
              }}
            >
              {currentSlide.description}
            </p>

            {/* 3 Circular Badges in Horizontal Row */}
            <div 
              className="hero-badges-row"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(10px, 2.5vw, 24px)',
                marginBottom: '30px',
                flexWrap: 'wrap'
              }}
            >
              {currentSlide.badges.map((badge, i) => {
                const IconComponent = badge.icon;
                return (
                  <div 
                    key={i} 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <div 
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        border: '1.8px solid #20100A',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#FFFFFF',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                        flexShrink: 0
                      }}
                    >
                      <IconComponent size={18} color="#20100A" strokeWidth={1.8} />
                    </div>
                    <span 
                      style={{ 
                        fontFamily: 'var(--font-heading)',
                        fontSize: '0.74rem', 
                        fontWeight: 800, 
                        color: '#20100A',
                        lineHeight: 1.25,
                        whiteSpace: 'pre-line',
                        textTransform: 'uppercase',
                        letterSpacing: '0.02em'
                      }}
                    >
                      {badge.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* CTAs */}
            <div className="hero-cta-group" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <a 
                href={currentSlide.buttonLink || '/shop'} 
                className="hero-cta-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: '#20100A',
                  color: '#FFFFFF',
                  padding: '13px 30px',
                  borderRadius: '9999px',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '0.94rem',
                  boxShadow: '0 4px 16px rgba(32, 16, 10, 0.28)',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#381C12';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#20100A';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>{currentSlide.buttonText || 'Shop Now'}</span>
                <ArrowRight size={17} />
              </a>

              <button 
                onClick={openSampleModal}
                className="hero-cta-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#FFFFFF',
                  color: '#20100A',
                  border: '1.6px solid #20100A',
                  padding: '13px 26px',
                  borderRadius: '9999px',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '0.94rem',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FAF7F2';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>{currentSlide.sampleButtonText || 'Book 50g Sample'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Minimal Subtle Slider Arrow Navigation */}
        <button
          onClick={goToPrev}
          aria-label="Previous slide"
          className="hero-arrow hero-arrow-prev"
          style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 4,
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.94)',
            color: '#20100A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
            border: '1px solid rgba(255,255,255,0.9)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.94)')}
        >
          <ChevronLeft size={22} />
        </button>

        <button
          onClick={goToNext}
          aria-label="Next slide"
          className="hero-arrow hero-arrow-next"
          style={{
            position: 'absolute',
            right: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 4,
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.94)',
            color: '#20100A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
            border: '1px solid rgba(255,255,255,0.9)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.94)')}
        >
          <ChevronRight size={22} />
        </button>

        {/* Dots */}
        <div 
          style={{ 
            position: 'absolute',
            bottom: '22px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            zIndex: 4
          }}
        >
          {slides.map((_, idx) => {
            const isActive = currentSlideIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                aria-label={`Slide ${idx + 1}`}
                style={{
                  width: isActive ? '32px' : '9px',
                  height: '9px',
                  borderRadius: '9999px',
                  background: isActive ? '#20100A' : 'rgba(32, 16, 10, 0.35)',
                  transition: 'all 0.3s ease',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer'
                }}
              />
            );
          })}
        </div>
      </div>

      {/* ═══ 5-Column Feature Ribbon Strip ═══ */}
      <div 
        style={{
          background: '#FFFFFF',
          borderTop: '1px solid #ECE4D8',
          borderBottom: '1px solid #ECE4D8',
          padding: '16px 0',
          position: 'relative',
          zIndex: 3,
          boxShadow: '0 2px 10px rgba(32, 16, 10, 0.03)'
        }}
      >
        <div className="container">
          <div 
            className="hero-ribbon-grid"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
            {FEATURE_RIBBON.map((item, i) => {
              const IconComp = item.icon;
              return (
                <div 
                  key={i}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    padding: '4px 8px'
                  }}
                >
                  <div 
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: '#F5ECE1',
                      color: '#20100A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <IconComp size={18} strokeWidth={1.8} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#736257', lineHeight: 1.2 }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#20100A', lineHeight: 1.25 }}>
                      {item.subtitle}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .hero-viewport {
            min-height: 560px !important;
          }
          .hero-scrim {
            background: linear-gradient(to top, rgba(247, 241, 233, 0.98) 0%, rgba(247, 241, 233, 0.94) 65%, rgba(247, 241, 233, 0.5) 100%) !important;
          }
          .hero-ribbon-grid {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 16px !important;
          }
        }

        @media (max-width: 640px) {
          .hero-viewport {
            min-height: 520px !important;
          }
          .hero-content-padding {
            padding: 28px 16px 40px !important;
          }
          .hero-arrow {
            display: none !important;
          }
          .hero-cta-group {
            flex-direction: column !important;
            width: 100% !important;
            gap: 10px !important;
          }
          .hero-cta-btn {
            width: 100% !important;
            justify-content: center !important;
            text-align: center !important;
          }
          .hero-ribbon-grid {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
          .hero-badges-row {
            gap: 12px !important;
          }
        }

        @media (max-width: 420px) {
          .hero-ribbon-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
