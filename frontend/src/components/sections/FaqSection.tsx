'use client';

import React, { useState, useEffect } from 'react';
import { FAQS } from '@/data/products';
import { ChevronDown, HelpCircle, Sparkles, MessageCircle } from 'lucide-react';

interface FaqSectionProps {
  initialFaqs?: any[];
}

export default function FaqSection({ initialFaqs }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [faqsList, setFaqsList] = useState<{ id?: string; q: string; a: string; category?: string }[]>(() => {
    if (initialFaqs && initialFaqs.length > 0) {
      return initialFaqs.map((f: any) => ({
        id: f.id,
        q: f.question,
        a: f.answer,
        category: f.category
      }));
    }
    return FAQS;
  });

  useEffect(() => {
    if (initialFaqs && initialFaqs.length > 0) {
      setFaqsList(initialFaqs.map((f: any) => ({
        id: f.id,
        q: f.question,
        a: f.answer,
        category: f.category
      })));
    }
  }, [initialFaqs]);

  const fetchLiveFaqs = async () => {
    try {
      let res = await fetch(`/api/faqs?_t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) {
        res = await fetch(`https://nuttryx.onrender.com/api/faqs?_t=${Date.now()}`, { cache: 'no-store' });
      }
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setFaqsList(json.data.map((f: any) => ({
            id: f.id,
            q: f.question,
            a: f.answer,
            category: f.category
          })));
        }
      }
    } catch {
      // Fallback to static FAQS
    }
  };

  useEffect(() => {
    fetchLiveFaqs();

    const onUpdate = () => fetchLiveFaqs();
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'nuttryx_faqs_updated') fetchLiveFaqs();
    };

    window.addEventListener('focus', onUpdate);
    window.addEventListener('storage', onStorage);
    window.addEventListener('nuttryx_faqs_updated', onUpdate);

    const interval = setInterval(fetchLiveFaqs, 10000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onUpdate);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('nuttryx_faqs_updated', onUpdate);
    };
  }, []);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" style={{ padding: '80px 0', background: '#FFFFFF' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="section-tag">
            <HelpCircle size={14} /> Clear Answers
          </span>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-desc" style={{ margin: '0 auto' }}>
            Got questions about purity, shelf life, or natural oil separation? We have got you covered.
          </p>
        </div>

        {/* Accordion List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqsList.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                style={{
                  border: `1.5px solid ${isOpen ? '#D9822B' : '#E8DDCE'}`,
                  borderRadius: 'var(--radius-md)',
                  background: isOpen ? '#FAF7F2' : '#FFFFFF',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  boxShadow: isOpen ? '0 4px 16px rgba(217, 130, 43, 0.08)' : 'none'
                }}
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  style={{
                    width: '100%',
                    padding: '18px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: '#20100A',
                    gap: '16px'
                  }}
                >
                  <span>{faq.q}</span>
                  <div 
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.25s ease',
                      color: isOpen ? '#D9822B' : '#736257',
                      flexShrink: 0
                    }}
                  >
                    <ChevronDown size={20} />
                  </div>
                </button>

                {isOpen && (
                  <div 
                    style={{
                      padding: '0 20px 20px',
                      color: '#5C4A3E',
                      fontSize: '0.94rem',
                      lineHeight: 1.65,
                      borderTop: '1px solid rgba(232, 221, 206, 0.6)',
                      paddingTop: '14px'
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp Help CTA */}
        <div 
          style={{
            marginTop: '36px',
            textAlign: 'center',
            padding: '20px',
            background: '#FAF7F2',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid #E8DDCE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div>
            <div style={{ fontWeight: 800, color: '#20100A', fontSize: '1rem' }}>
              Still have a specific question about your nutrition?
            </div>
            <div style={{ fontSize: '0.84rem', color: '#736257' }}>
              Our nutrition team is online on WhatsApp to help you choose the right jar!
            </div>
          </div>
          <a
            href="https://wa.me/919999999999?text=Hi%20Nuttryx!%20I%20have%20a%20question%20about%20your%20pure%20peanut%20butter."
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ padding: '10px 20px', fontSize: '0.88rem' }}
          >
            <MessageCircle size={16} color="#38A169" /> Chat on WhatsApp
          </a>
        </div>

      </div>
    </section>
  );
}
