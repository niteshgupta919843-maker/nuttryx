'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import { Star, CheckCircle2, MessageSquareHeart, Loader2, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { INITIAL_50_REVIEWS, ReviewItem } from '@/data/reviews';

export default function ReviewsSection() {
  const { triggerToast } = useCart();
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>(INITIAL_50_REVIEWS);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const sliderRef = useRef<HTMLDivElement>(null);

  const [newReview, setNewReview] = useState({
    name: '',
    role: '',
    flavour: 'Dark Chocolate Peanut Butter',
    comment: '',
    rating: 5
  });

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/reviews?_t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setReviewsList(json.data);
        }
      }
    } catch {
      // Fallback already pre-set to INITIAL_50_REVIEWS
    }
  }, []);

  useEffect(() => {
    fetchReviews();

    const handleUpdate = () => {
      fetchReviews();
    };

    window.addEventListener('nuttryx_reviews_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('nuttryx_reviews_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [fetchReviews]);

  // Handle scroll checks for arrows & progress bar
  const handleScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
    setScrollProgress(Math.min(100, Math.max(0, progress)));
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    handleScroll();
    el.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      el.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [reviewsList]);

  const scrollSlider = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    const cardWidth = 350; // approximate width of one card + gap
    const scrollAmount = direction === 'left' ? -cardWidth * 2 : cardWidth * 2;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.comment.trim()) {
      triggerToast('Please fill in your name and review comment');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: newReview.name.trim(),
        role: newReview.role.trim() || 'Verified Buyer',
        rating: newReview.rating,
        flavour: newReview.flavour,
        comment: newReview.comment.trim()
      };

      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (json.success && json.data) {
        setReviewsList((prev) => [json.data, ...prev]);
        triggerToast('✓ Thank you! Your review is now live on the store! ❤️');
        setShowReviewForm(false);
        setNewReview({
          name: '',
          role: '',
          flavour: 'Dark Chocolate Peanut Butter',
          comment: '',
          rating: 5
        });

        // Scroll slider to start so user sees their new review
        if (sliderRef.current) {
          sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        }

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('nuttryx_reviews_updated'));
          localStorage.setItem('nuttryx_reviews_updated', String(Date.now()));
        }
      } else {
        triggerToast(`❌ ${json.message || 'Could not submit review'}`);
      }
    } catch {
      triggerToast('❌ Network error while submitting review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reviews" style={{ padding: '80px 0', background: '#FAF7F2', overflow: 'hidden' }}>
      <div className="container">
        
        {/* Section Header with Slider Navigation Controls */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
            marginBottom: '32px'
          }}
        >
          <div>
            <span className="section-tag">
              <MessageSquareHeart size={14} /> Real Community Love
            </span>
            <h2 className="section-title">
              {reviewsList.length}+ Verified 5-Star Reviews
            </h2>
            <p className="section-desc">
              From powerlifters hitting PRs to parents feeding their children clean breakfast, see what people say about NUTTRYX.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Slider Arrow Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => scrollSlider('left')}
                disabled={!canScrollLeft}
                aria-label="Previous Reviews"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: '1.5px solid #E8DDCE',
                  background: canScrollLeft ? '#FFFFFF' : '#F3ECE2',
                  color: canScrollLeft ? '#20100A' : '#A8998C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: canScrollLeft ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                  boxShadow: canScrollLeft ? '0 2px 8px rgba(32, 16, 10, 0.08)' : 'none',
                  opacity: canScrollLeft ? 1 : 0.6
                }}
              >
                <ChevronLeft size={20} />
              </button>

              <button
                type="button"
                onClick={() => scrollSlider('right')}
                disabled={!canScrollRight}
                aria-label="Next Reviews"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: '1.5px solid #E8DDCE',
                  background: canScrollRight ? '#FFFFFF' : '#F3ECE2',
                  color: canScrollRight ? '#20100A' : '#A8998C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: canScrollRight ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                  boxShadow: canScrollRight ? '0 2px 8px rgba(32, 16, 10, 0.08)' : 'none',
                  opacity: canScrollRight ? 1 : 0.6
                }}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Write a Review Toggle Button */}
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="btn btn-secondary"
              style={{
                backgroundColor: '#FFFFFF',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {showReviewForm ? 'Close Form ✕' : 'Write a Review ✍️'}
            </button>
          </div>
        </div>

        {/* Submit Review Form (if toggled) */}
        {showReviewForm && (
          <form 
            onSubmit={handleReviewSubmit}
            style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              padding: '28px',
              border: '2px solid #D9822B',
              marginBottom: '36px',
              boxShadow: '0 8px 30px rgba(217, 130, 43, 0.12)'
            }}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '6px', color: '#20100A' }}>
              Share Your NUTTRYX Experience
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#736257', marginBottom: '18px' }}>
              Your honest feedback helps the community choose genuine nutrition.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: '#5C4A3E' }}>
                  Your Full Name *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Vikram Malhotra" 
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #E8DDCE', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: '#5C4A3E' }}>
                  Your Lifestyle / City
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Marathoner, Delhi" 
                  value={newReview.role}
                  onChange={(e) => setNewReview({ ...newReview, role: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #E8DDCE', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: '#5C4A3E' }}>
                  Flavour Purchased
                </label>
                <select
                  value={newReview.flavour}
                  onChange={(e) => setNewReview({ ...newReview, flavour: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #E8DDCE', outline: 'none', background: '#FFFFFF' }}
                >
                  <option value="Dark Chocolate Peanut Butter">Dark Chocolate Peanut Butter</option>
                  <option value="Natural Creamy Peanut Butter">Natural Creamy Peanut Butter</option>
                  <option value="Roasted Crunchy Peanut Butter">Roasted Crunchy Peanut Butter</option>
                  <option value="Trio Discovery Bundle">Trio Discovery Bundle</option>
                  <option value="High-Protein Workout Combo">High-Protein Workout Combo</option>
                </select>
              </div>
            </div>

            {/* Star Rating Selector */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px', color: '#5C4A3E' }}>
                Rating Score *
              </label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '2px',
                      transform: star <= newReview.rating ? 'scale(1.15)' : 'scale(1)',
                      transition: 'transform 0.15s ease'
                    }}
                  >
                    <Star
                      size={24}
                      fill={star <= newReview.rating ? '#F59E0B' : '#E0D6C8'}
                      color={star <= newReview.rating ? '#F59E0B' : '#C2B4A3'}
                    />
                  </button>
                ))}
                <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#D9822B', marginLeft: '6px' }}>
                  {newReview.rating} out of 5 Stars
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: '#5C4A3E' }}>
                Your Honest Review *
              </label>
              <textarea 
                rows={3} 
                required
                placeholder="How did you like the flavour, texture, and natural oil separation?"
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #E8DDCE', outline: 'none', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn btn-primary" 
                style={{ padding: '11px 26px', display: 'flex', alignItems: 'center', gap: '8px', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
              >
                {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                {isSubmitting ? 'Posting Review...' : 'Submit Verified Review ✨'}
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="btn btn-secondary"
                style={{ padding: '11px 20px', backgroundColor: '#FFFFFF', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Reviews Horizontal Slider Track */}
        <div 
          ref={sliderRef}
          className="reviews-slider-track"
          style={{
            display: 'flex',
            gap: '20px',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth',
            paddingBottom: '16px',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {reviewsList.map((test, index) => (
            <div
              key={test.id || `rev-${index}`}
              style={{
                flex: '0 0 auto',
                width: 'clamp(280px, 82vw, 340px)',
                scrollSnapAlign: 'start',
                background: '#FFFFFF',
                borderRadius: '18px',
                padding: '24px',
                border: '1.5px solid #E8DDCE',
                boxShadow: '0 4px 18px rgba(51, 26, 17, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.25s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#D9822B';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 24px rgba(217, 130, 43, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E8DDCE';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 18px rgba(51, 26, 17, 0.04)';
              }}
            >
              <div>
                {/* Rating stars & verified badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', gap: '3px' }}>
                    {[...Array(test.rating || 5)].map((_, i) => (
                      <Star key={i} size={15} fill="#D9822B" color="#D9822B" />
                    ))}
                  </div>
                  <span 
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: '#03543F',
                      background: '#DEF7EC',
                      padding: '3px 8px',
                      borderRadius: '99px'
                    }}
                  >
                    <CheckCircle2 size={12} /> Verified Buyer
                  </span>
                </div>

                {/* Comment */}
                <p 
                  style={{ 
                    fontSize: '0.9rem', 
                    color: '#381C12', 
                    lineHeight: 1.6, 
                    marginBottom: '18px', 
                    fontStyle: 'italic',
                    minHeight: '88px',
                    display: '-webkit-box',
                    WebkitLineClamp: 5,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  &ldquo;{test.comment}&rdquo;
                </p>
              </div>

              {/* Reviewer Details */}
              <div style={{ paddingTop: '14px', borderTop: '1px solid #F3ECE2' }}>
                <div style={{ fontWeight: 800, fontSize: '0.96rem', color: '#20100A' }}>
                  {test.name}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#736257' }}>
                  {test.role || 'Verified Buyer'}
                </div>
                {test.flavour && (
                  <div style={{ fontSize: '0.72rem', color: '#B87024', fontWeight: 700, marginTop: '4px' }}>
                    Purchased: {test.flavour}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Slider Bottom Bar: Progress Tracker & Stats */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '20px',
            flexWrap: 'wrap',
            gap: '14px'
          }}
        >
          {/* Progress track */}
          <div style={{ flex: 1, minWidth: '180px', maxWidth: '300px' }}>
            <div
              style={{
                width: '100%',
                height: '5px',
                background: '#EAE1D5',
                borderRadius: '99px',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${Math.max(12, scrollProgress)}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #D9822B, #B8671B)',
                  borderRadius: '99px',
                  transition: 'width 0.15s ease-out'
                }}
              />
            </div>
          </div>

          {/* Subtext info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#736257', fontWeight: 600 }}>
            <Sparkles size={14} color="#D9822B" />
            <span>Showing {reviewsList.length} Verified Reviews • Swipe or click arrows to explore</span>
          </div>
        </div>

      </div>

      <style jsx>{`
        .reviews-slider-track::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
