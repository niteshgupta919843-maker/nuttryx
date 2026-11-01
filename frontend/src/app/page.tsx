import React from 'react';
import dynamic from 'next/dynamic';
import Hero from '@/components/sections/Hero';
import ProductSection from '@/components/sections/ProductSection';
import SpotlightBanner from '@/components/sections/SpotlightBanner';
import ComparisonSection from '@/components/sections/ComparisonSection';
import TickerStrip from '@/components/ui/TickerStrip';
import ProcessStory from '@/components/sections/ProcessStory';
import ReviewsSection from '@/components/sections/ReviewsSection';
import FaqSection from '@/components/sections/FaqSection';

// Dynamically import below-the-fold interactive calculator to optimize TTI / initial hydration
const ProteinCalculator = dynamic(() => import('@/components/sections/ProteinCalculator'), {
  loading: () => <div style={{ minHeight: '400px' }} />
});

export default function Home() {
  return (
    <>
      <Hero />
      <ProductSection />
      <SpotlightBanner />
      <ComparisonSection />
      <TickerStrip />
      <ProteinCalculator />
      <ProcessStory />
      <ReviewsSection />
      <FaqSection />
    </>
  );
}
