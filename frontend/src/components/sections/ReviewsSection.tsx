'use client';

import React, { useState } from 'react';
import { TESTIMONIALS } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { Star, CheckCircle2, MessageSquareHeart, ThumbsUp, Sparkles } from 'lucide-react';

export default function ReviewsSection() {
  const { triggerToast } = useCart();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', role: '', comment: '', rating: 5 });

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) {
      triggerToast('Please fill in your name and review comment');
      return;
    }
    triggerToast('Thank you for sharing your review! It will appear shortly after verification. ❤️');
    setShowReviewForm(false);
    setNewReview({ name: '', role: '', comment: '', rating: 5 });
  };

  return (
    <section id="reviews" style={{ padding: '80px 0', background: '#FAF7F2' }}>
      <div className="container">
        
        {/* Section Header */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
            marginBottom: '40px'
          }}
        >
          <div>
            <span className="section-tag">
              <MessageSquareHeart size={14} /> Real Community Love
            </span>
            <h2 className="section-title">1,450+ Verified 5-Star Reviews</h2>
            <p className="section-desc">
              From powerlifters hitting PRs to parents feeding their children clean breakfast, see what people say about NUTTRYX.
            </p>
          </div>

          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="btn btn-secondary"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            {showReviewForm ? 'Close Form' : 'Write a Review ✍️'}
          </button>
        </div>

        {/* Submit Review Form (if toggled) */}
        {showReviewForm && (
          <form 
            onSubmit={handleReviewSubmit}
            style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              border: '2px solid #D9822B',
              marginBottom: '32px',
              boxShadow: '0 8px 24px rgba(217, 130, 43, 0.1)'
            }}
          >
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '14px', color: '#20100A' }}>
              Share Your NUTTRYX Experience
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: '#5C4A3E' }}>
                  Your Full Name:
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Vikram Malhotra" 
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E8DDCE', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: '#5C4A3E' }}>
                  Your Lifestyle / City:
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Gym Coach, Delhi" 
                  value={newReview.role}
                  onChange={(e) => setNewReview({ ...newReview, role: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E8DDCE', outline: 'none' }}
                />
              </div>
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: '#5C4A3E' }}>
                Your Review:
              </label>
              <textarea 
                rows={3} 
                placeholder="How did you like the flavour, texture, and protein punch?"
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E8DDCE', outline: 'none', fontFamily: 'inherit' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px' }}>
              Submit Verified Review
            </button>
          </form>
        )}

        {/* Rating Breakdown Bar & Reviews Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}
        >
          {TESTIMONIALS.map((test) => (
            <div
              key={test.id}
              style={{
                background: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                border: '1.5px solid #E8DDCE',
                boxShadow: '0 4px 16px rgba(51, 26, 17, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#D9822B')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#E8DDCE')}
            >
              <div>
                {/* Rating stars & verified badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', color: '#F59E0B' }}>
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} size={15} fill="#F59E0B" />
                    ))}
                  </div>
                  <span 
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#2D6A4F',
                      background: '#E8F5E9',
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}
                  >
                    <CheckCircle2 size={12} /> Verified Buyer
                  </span>
                </div>

                {/* Comment */}
                <p style={{ fontSize: '0.92rem', color: '#381C12', lineHeight: 1.6, marginBottom: '16px', fontStyle: 'italic' }}>
                  &ldquo;{test.comment}&rdquo;
                </p>
              </div>

              {/* Reviewer Details */}
              <div style={{ paddingTop: '14px', borderTop: '1px solid #F3ECE2' }}>
                <div style={{ fontWeight: 800, fontSize: '0.96rem', color: '#20100A' }}>
                  {test.name}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#736257' }}>
                  {test.role}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#B87024', fontWeight: 600, marginTop: '4px' }}>
                  Purchased: {test.flavour}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
