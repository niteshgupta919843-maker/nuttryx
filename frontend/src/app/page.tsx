import React from 'react';
import nextDynamic from 'next/dynamic';
import Hero from '@/components/sections/Hero';
import ProductSection from '@/components/sections/ProductSection';
import SpotlightBanner from '@/components/sections/SpotlightBanner';
import ComparisonSection from '@/components/sections/ComparisonSection';
import TickerStrip from '@/components/ui/TickerStrip';
import ProcessStory from '@/components/sections/ProcessStory';
import ReviewsSection from '@/components/sections/ReviewsSection';
import FaqSection from '@/components/sections/FaqSection';
import {
  fetchServerProducts,
  fetchServerSlides,
  fetchServerFaqs,
  fetchServerReviews,
  fetchServerCraft,
  fetchServerBenefit,
  fetchServerTicker,
  fetchServerLifestyle
} from '@/lib/server-api';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Dynamically import below-the-fold interactive calculator to optimize TTI / initial hydration
const ProteinCalculator = nextDynamic(() => import('@/components/sections/ProteinCalculator'), {
  loading: () => <div style={{ minHeight: '400px' }} />
});

export default async function Home() {
  const [products, slides, faqs, reviews, craft, benefit, ticker, lifestyle] = await Promise.all([
    fetchServerProducts(),
    fetchServerSlides(),
    fetchServerFaqs(),
    fetchServerReviews(),
    fetchServerCraft(),
    fetchServerBenefit(),
    fetchServerTicker(),
    fetchServerLifestyle()
  ]);

  const darkChocolate = products.find(p => p.id === 'dark-chocolate');

  return (
    <>
      <Hero initialSlides={slides} />
      <ProductSection initialProducts={products} />
      <SpotlightBanner initialProduct={darkChocolate} />
      <ComparisonSection initialBenefit={benefit} />
      <TickerStrip initialTicker={ticker} initialLifestyle={lifestyle} />
      <ProteinCalculator />
      <ProcessStory initialCraft={craft} />
      <ReviewsSection initialReviews={reviews} />
      <FaqSection initialFaqs={faqs} />
    </>
  );
}
