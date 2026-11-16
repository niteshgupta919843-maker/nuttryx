'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { PRODUCTS, Product } from '@/data/products';
import { getBackendBaseUrl } from '@/lib/api';
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  ArrowRight,
  Minus,
  Plus,
  Check
} from 'lucide-react';

interface ProductSectionProps {
  initialProducts?: Product[];
}

export default function ProductSection({ initialProducts }: ProductSectionProps) {
  const { addToCart, wishlist, toggleWishlist } = useCart();

  // Exclude bundle-trio, show authentic peanut butter jars
  const [jarProducts, setJarProducts] = useState<Product[]>(() => {
    if (initialProducts && initialProducts.length > 0) {
      return initialProducts.filter(p => p.id !== 'bundle-trio');
    }
    return PRODUCTS.filter(p => p.id !== 'bundle-trio');
  });

  // Sync if server initialProducts update
  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setJarProducts(initialProducts.filter(p => p.id !== 'bundle-trio'));
    }
  }, [initialProducts]);

  // Selected size per product: { [productId]: '500g' | '1kg' }
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  // Selected quantity per product: { [productId]: number }
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  // Added to cart feedback: { [productId]: boolean }
  const [addedNotice, setAddedNotice] = useState<Record<string, boolean>>({});

  const handleSizeSelect = (productId: string, weight: string) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: weight }));
  };

  const handleQuantityChange = (productId: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[productId] || 1;
      const next = Math.max(1, Math.min(20, current + delta));
      return { ...prev, [productId]: next };
    });
  };

  const handleAddToCart = (product: Product, weight: string, qty: number) => {
    addToCart(product, weight, qty);
    setAddedNotice(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedNotice(prev => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  // Sync products dynamically with MongoDB database (auto-refresh + polling + focus)
  useEffect(() => {
    const fetchLiveCatalog = async () => {
      try {
        const timestamp = Date.now();
        let res = await fetch(`/api/products?_t=${timestamp}`, { cache: 'no-store' });
        if (!res.ok) {
          res = await fetch(`${getBackendBaseUrl()}/api/products?_t=${timestamp}`, { cache: 'no-store' });
        }
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            const liveJars = json.data.filter((p: Product) => p.id !== 'bundle-trio');
            if (liveJars.length > 0) {
              setJarProducts(liveJars);
              try {
                localStorage.setItem('nuttryx_cached_products', JSON.stringify(liveJars));
              } catch {}
            }
          }
        }
      } catch {
        // Fallback to static catalog if backend offline
      }
    };

    fetchLiveCatalog();
    const interval = setInterval(fetchLiveCatalog, 30000); // Gentle 30s background sync
    const onFocus = () => fetchLiveCatalog();
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'nuttryx_catalog_updated') fetchLiveCatalog();
    };
    const onCustomUpdate = () => fetchLiveCatalog();

    window.addEventListener('focus', onFocus);
    window.addEventListener('storage', onStorage);
    window.addEventListener('nuttryx_catalog_updated', onCustomUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('nuttryx_catalog_updated', onCustomUpdate);
    };
  }, []);

  return (
    <section id="products" style={{ padding: '60px 0 80px 0', background: '#F8F4EE' }}>
      <div className="container">
        
        {/* Section Header */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '36px',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div>
            <h2 
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)',
                fontWeight: 900,
                color: '#20100A',
                marginBottom: '4px'
              }}
            >
              Our Products
            </h2>
            <p 
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                color: '#5C4A3E'
              }}
            >
              Delicious, nutritious and made with the goodness of real peanuts.
            </p>
          </div>

          <a 
            href="/shop" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#20100A',
              color: '#FFFFFF',
              padding: '9px 20px',
              borderRadius: '9999px',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '0.85rem',
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#381C12')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#20100A')}
          >
            <span>View All Products</span>
            <ArrowRight size={14} />
          </a>
        </div>

        {/* ── Product Cards Grid ── */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: 'clamp(16px, 3vw, 24px)',
            alignItems: 'stretch'
          }}
        >
          {jarProducts.map((product) => {
            const isWishlisted = wishlist.includes(product.id);
            const sizes = (product.sizes && product.sizes.length > 0)
              ? product.sizes
              : [{ weight: '500g', price: 299, originalPrice: 399, inStock: true }];
            const currentWeight = selectedSizes[product.id] || sizes[0].weight;
            const activeSize = sizes.find(s => s.weight === currentWeight) || sizes[0];
            const currentQty = quantities[product.id] || 1;
            const isAdded = !!addedNotice[product.id];
            const discountPercent = activeSize.originalPrice
              ? Math.round(((activeSize.originalPrice - activeSize.price) / activeSize.originalPrice) * 100)
              : 0;

            return (
              <div
                key={product.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '24px',
                  padding: 'clamp(14px, 3vw, 18px)',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  border: '1px solid #ECE2D5',
                  boxShadow: '0 4px 18px rgba(51, 26, 17, 0.05)',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 16px 36px rgba(51, 26, 17, 0.12)';
                  e.currentTarget.style.borderColor = '#DFD2C2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 18px rgba(51, 26, 17, 0.05)';
                  e.currentTarget.style.borderColor = '#ECE2D5';
                }}
              >
                {/* ── Visual Image Showcase with Soft Rounded Corners ── */}
                <div 
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '460 / 380',
                    borderRadius: '18px',
                    overflow: 'hidden',
                    background: 'linear-gradient(180deg, #FDFBF8 0%, #F5ECE0 100%)',
                    border: '1px solid rgba(80, 45, 25, 0.08)',
                    marginBottom: '16px'
                  }}
                >
                  <Image 
                    src={product.image} 
                    alt={product.name} 
                    fill
                    style={{ 
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease'
                    }}
                    sizes="(max-width: 768px) 100vw, 360px"
                  />

                  {/* Floating Product Badge */}
                  {product.badge && (
                    <div 
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        background: 'rgba(32, 16, 10, 0.9)',
                        backdropFilter: 'blur(6px)',
                        color: '#FAF7F2',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '4px 11px',
                        borderRadius: '9999px',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        zIndex: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.18)'
                      }}
                    >
                      {product.badge}
                    </div>
                  )}

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.92)',
                      backdropFilter: 'blur(6px)',
                      border: '1px solid rgba(255, 255, 255, 0.8)',
                      color: isWishlisted ? '#E53E3E' : '#736257',
                      cursor: 'pointer',
                      zIndex: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 3px 10px rgba(0,0,0,0.12)',
                      transition: 'transform 0.15s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    title="Add to Wishlist"
                  >
                    <Heart size={17} fill={isWishlisted ? '#E53E3E' : 'none'} />
                  </button>
                </div>

                {/* Product Title */}
                <h4 
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.08rem',
                    fontWeight: 800,
                    color: '#20100A',
                    lineHeight: 1.35,
                    marginBottom: '6px',
                    minHeight: '2.8rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                  title={product.name}
                >
                  {product.name}
                </h4>

                {/* Star Ratings + Review Pill */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', color: '#D9822B' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} fill="#D9822B" />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#20100A' }}>
                    {product.rating || '4.9'}
                  </span>
                  <span style={{ fontSize: '0.74rem', color: '#8A7669', fontWeight: 600 }}>
                    ({product.reviewsCount})
                  </span>
                </div>

                {/* Size / Weight Selector (Sleek Natural Chips) */}
                <div style={{ marginBottom: '14px', minHeight: '52px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#8A7669', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Pack Size:
                    </span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#B55A00' }}>
                      {activeSize.weight} selected
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {sizes.map((s) => {
                      const isSizeActive = s.weight === currentWeight;
                      return (
                        <button
                          key={s.weight}
                          type="button"
                          onClick={() => handleSizeSelect(product.id, s.weight)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '9999px',
                            border: isSizeActive ? '1.5px solid #20100A' : '1px solid #E8DDD0',
                            background: isSizeActive ? '#20100A' : '#FAF6F0',
                            color: isSizeActive ? '#FFFFFF' : '#5C4A3E',
                            fontWeight: isSizeActive ? 800 : 600,
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            boxShadow: isSizeActive ? '0 2px 8px rgba(32, 16, 10, 0.16)' : 'none',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (!isSizeActive) {
                              e.currentTarget.style.borderColor = '#D9822B';
                              e.currentTarget.style.background = '#F3ECE2';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSizeActive) {
                              e.currentTarget.style.borderColor = '#E8DDD0';
                              e.currentTarget.style.background = '#FAF6F0';
                            }
                          }}
                        >
                          <span>{s.weight}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Price, Quantity Stepper & Add to Cart Action */}
                <div 
                  style={{ 
                    marginTop: 'auto',
                    paddingTop: '12px',
                    borderTop: '1px solid #F3ECE2',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                        <span 
                          style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '1.45rem',
                            fontWeight: 900,
                            color: '#20100A'
                          }}
                        >
                          ₹{activeSize.price}
                        </span>
                        {activeSize.originalPrice && (
                          <span 
                            style={{
                              fontSize: '0.84rem',
                              color: '#A19183',
                              textDecoration: 'line-through'
                            }}
                          >
                            ₹{activeSize.originalPrice}
                          </span>
                        )}
                      </div>
                      {discountPercent > 0 && (
                        <span 
                          style={{ 
                            fontSize: '0.68rem', 
                            color: '#047857', 
                            fontWeight: 800,
                            background: '#ECFDF5',
                            border: '1px solid #A7F3D0',
                            padding: '1px 7px',
                            borderRadius: '9999px',
                            display: 'inline-block',
                            marginTop: '3px'
                          }}
                        >
                          Save {discountPercent}%
                        </span>
                      )}
                    </div>

                    {/* Quantity Stepper [- 1 +] */}
                    <div 
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        background: '#FAF6F0',
                        border: '1.5px solid #ECE2D5',
                        borderRadius: '9999px',
                        padding: '3px 4px'
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(product.id, -1)}
                        disabled={currentQty <= 1}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          border: 'none',
                          background: currentQty <= 1 ? 'transparent' : '#FFFFFF',
                          color: currentQty <= 1 ? '#C2B3A3' : '#20100A',
                          cursor: currentQty <= 1 ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: currentQty <= 1 ? 'none' : '0 1px 3px rgba(0,0,0,0.1)',
                          transition: 'all 0.15s ease'
                        }}
                        title="Decrease quantity"
                      >
                        <Minus size={13} strokeWidth={2.5} />
                      </button>

                      <span 
                        style={{
                          minWidth: '28px',
                          textAlign: 'center',
                          fontSize: '0.88rem',
                          fontWeight: 900,
                          color: '#20100A',
                          fontFamily: 'var(--font-heading)'
                        }}
                      >
                        {currentQty}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleQuantityChange(product.id, 1)}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          border: 'none',
                          background: '#FFFFFF',
                          color: '#20100A',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          transition: 'all 0.15s ease'
                        }}
                        title="Increase quantity"
                      >
                        <Plus size={13} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product, activeSize.weight, currentQty)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      backgroundColor: isAdded ? '#166534' : '#20100A',
                      color: '#FFFFFF',
                      padding: '12px 20px',
                      borderRadius: '9999px',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(32, 16, 10, 0.22)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isAdded) {
                        e.currentTarget.style.backgroundColor = '#381C12';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isAdded) {
                        e.currentTarget.style.backgroundColor = '#20100A';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    {isAdded ? (
                      <>
                        <Check size={16} />
                        <span>Added {currentQty} Jar{currentQty > 1 ? 's' : ''} to Cart! ✓</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={15} />
                        <span>Add to Cart • ₹{activeSize.price * currentQty}</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
