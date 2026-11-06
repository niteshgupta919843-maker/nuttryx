'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { PRODUCTS, Product } from '@/data/products';
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  Check, 
  Flame,
  ArrowUpDown,
  RefreshCw,
  Minus,
  Plus
} from 'lucide-react';

interface ShopClientProps {
  initialProducts?: Product[];
}

export default function ShopClient({ initialProducts }: ShopClientProps) {
  const { addToCart, wishlist, toggleWishlist } = useCart();

  const [products, setProducts] = useState<Product[]>(() => {
    if (initialProducts && initialProducts.length > 0) {
      return initialProducts.filter(p => p.id !== 'bundle-trio');
    }
    return PRODUCTS.filter(p => p.id !== 'bundle-trio');
  });

  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setProducts(initialProducts.filter(p => p.id !== 'bundle-trio'));
    }
  }, [initialProducts]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedNotice, setAddedNotice] = useState<Record<string, boolean>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch live products from backend MongoDB with fallback
  const fetchLiveProducts = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsRefreshing(true);
    try {
      // Try Next.js rewritten /api/products first, then direct port 5000
      const timestamp = Date.now();
      let res = await fetch(`/api/products?_t=${timestamp}`, { cache: 'no-store' });
      if (!res.ok) {
        res = await fetch(`https://nuttryx.onrender.com/api/products?_t=${timestamp}`, { cache: 'no-store' });
      }

      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const liveList = json.data.filter((p: Product) => p.id !== 'bundle-trio');
          if (liveList.length > 0) {
            setProducts(liveList);
            try {
              localStorage.setItem('nuttryx_cached_products', JSON.stringify(liveList));
            } catch {}
          }
        }
      }
    } catch {
      // Keep existing products if offline
    } finally {
      if (!isSilent) setIsRefreshing(false);
    }
  }, []);

  // Mount + auto polling every 3 seconds + tab focus sync
  useEffect(() => {
    fetchLiveProducts();

    const interval = setInterval(() => {
      fetchLiveProducts(true);
    }, 30000);

    const onFocus = () => fetchLiveProducts(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'nuttryx_catalog_updated') {
        fetchLiveProducts(true);
      }
    };
    const onCustomUpdate = () => fetchLiveProducts(true);

    window.addEventListener('focus', onFocus);
    window.addEventListener('storage', onStorage);
    window.addEventListener('nuttryx_catalog_updated', onCustomUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('nuttryx_catalog_updated', onCustomUpdate);
    };
  }, [fetchLiveProducts]);

  // Handle size selection per product
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

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'all') {
          if (selectedCategory === 'protein' && p.category !== 'protein') return false;
          if (selectedCategory === 'chocolate' && p.category !== 'chocolate') return false;
          if (selectedCategory === 'combos' && p.category !== 'combos') return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = p.name.toLowerCase().includes(q);
          const matchSubtitle = p.subtitle ? p.subtitle.toLowerCase().includes(q) : false;
          const matchDesc = p.description ? p.description.toLowerCase().includes(q) : false;
          const matchIngredients = p.ingredients ? p.ingredients.toLowerCase().includes(q) : false;
          if (!matchName && !matchSubtitle && !matchDesc && !matchIngredients) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const aPrice = (a.sizes && a.sizes[0]) ? a.sizes[0].price : 299;
        const bPrice = (b.sizes && b.sizes[0]) ? b.sizes[0].price : 299;

        if (sortBy === 'price-asc') return aPrice - bPrice;
        if (sortBy === 'price-desc') return bPrice - aPrice;
        if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
        return 0; // Featured
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  const categories = [
    { id: 'all', label: 'All Flavours', count: products.length },
    { id: 'protein', label: 'High Protein', count: products.filter(p => p.category === 'protein').length },
    { id: 'chocolate', label: 'Dark Chocolate', count: products.filter(p => p.category === 'chocolate').length },
    { id: 'combos', label: 'Combos & Launches', count: products.filter(p => p.category === 'combos').length },
  ];

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100vh', paddingBottom: '90px' }}>
      
      {/* ── Banner / Breadcrumb Header ── */}
      <section 
        style={{
          background: 'linear-gradient(135deg, #20100A 0%, #3D1F13 100%)',
          color: '#FFFFFF',
          padding: '60px 0 50px 0',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div 
          style={{
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(217, 130, 43, 0.15) 0%, rgba(217, 130, 43, 0) 70%)',
            pointerEvents: 'none'
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          {/* Breadcrumbs */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', marginBottom: '14px', color: '#E8DDCE' }}>
            <Link href="/" style={{ color: '#E8DDCE', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <span style={{ color: '#FFB067', fontWeight: 700 }}>Shop Catalog</span>
          </nav>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '18px' }}>
            <div>
              <span 
                style={{
                  display: 'inline-block',
                  backgroundColor: 'rgba(217, 130, 43, 0.25)',
                  border: '1px solid rgba(217, 130, 43, 0.45)',
                  color: '#FFD199',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  padding: '5px 14px',
                  borderRadius: '9999px',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em'
                }}
              >
                100% Pure Peanut Butter
              </span>
              <h1 
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(2rem, 3.8vw, 2.8rem)',
                  fontWeight: 900,
                  lineHeight: 1.15,
                  color: '#FFFFFF',
                  marginBottom: '12px',
                  letterSpacing: '-0.02em',
                  textShadow: '0 2px 8px rgba(0,0,0,0.4)'
                }}
              >
                Nuttryx Official Store
              </h1>
              <p style={{ color: '#F0E6DC', fontSize: '1rem', maxWidth: '580px', lineHeight: 1.55 }}>
                Handcrafted from slow-roasted bold Saurashtra peanuts. Zero refined sugar, zero palm oil, pure wholesome nutrition delivered to your doorstep.
              </p>
            </div>

            {/* Quick Live DB status indicator */}
            <button
              onClick={() => fetchLiveProducts(false)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FAF7F2',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title="Click to refresh products from database"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
              <span>Live Catalog Sync</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Main Filter & Products Container ── */}
      <div className="container" style={{ marginTop: '36px' }}>
        
        {/* Controls Bar: Search, Category Pills, Sort */}
        <div 
          className="shop-controls-card"
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: 'clamp(14px, 3vw, 20px)',
            border: '1px solid #ECE4D8',
            boxShadow: '0 4px 16px rgba(51, 26, 17, 0.04)',
            marginBottom: '32px'
          }}
        >
          <div 
            className="shop-controls-inner"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap'
            }}
          >
            {/* Category Pills */}
            <div className="shop-categories-scroll" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '9999px',
                      border: isActive ? '1.5px solid #20100A' : '1.5px solid #E6DCD1',
                      background: isActive ? '#20100A' : '#FFFFFF',
                      color: isActive ? '#FFFFFF' : '#4A3B32',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>{cat.label}</span>
                    <span 
                      style={{
                        fontSize: '0.74rem',
                        padding: '1px 7px',
                        borderRadius: '9999px',
                        background: isActive ? '#D9822B' : '#EFE8DE',
                        color: isActive ? '#FFFFFF' : '#736257',
                        fontWeight: 800
                      }}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right: Search & Sort */}
            <div className="shop-search-sort-group" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', flex: '1 1 auto', justifyContent: 'flex-end' }}>
              {/* Search Bar */}
              <div 
                className="shop-search-box"
                style={{
                  position: 'relative',
                  minWidth: '200px',
                  maxWidth: '320px',
                  width: '100%'
                }}
              >
                <Search 
                  size={16} 
                  color="#8A7669" 
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} 
                />
                <input
                  type="text"
                  placeholder="Search peanut butter..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 14px 9px 36px',
                    borderRadius: '8px',
                    border: '1px solid #D8CCC0',
                    fontSize: '0.88rem',
                    color: '#20100A',
                    outline: 'none',
                    background: '#FDFCFB'
                  }}
                />
              </div>

              {/* Sort Dropdown */}
              <div className="shop-sort-box" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ArrowUpDown size={15} color="#736257" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  style={{
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #D8CCC0',
                    fontSize: '0.86rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 600,
                    color: '#20100A',
                    background: '#FDFCFB',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  <option value="featured">Featured First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ── Products Grid ── */}
        {filteredProducts.length === 0 ? (
          <div 
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #ECE4D8'
            }}
          >
            <div 
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#F5EEE6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto'
              }}
            >
              <Search size={28} color="#A89485" />
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: '#20100A', marginBottom: '8px' }}>
              No Products Found
            </h3>
            <p style={{ color: '#736257', fontSize: '0.92rem', marginBottom: '20px' }}>
              Try adjusting your category filter or search keywords.
            </p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              style={{
                padding: '9px 22px',
                borderRadius: '8px',
                background: '#20100A',
                color: '#FFFFFF',
                border: 'none',
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '0.86rem',
                cursor: 'pointer'
              }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
              gap: 'clamp(16px, 3vw, 24px)',
              alignItems: 'stretch'
            }}
          >
            {filteredProducts.map((product) => {
              const isWishlisted = wishlist.includes(product.id);
              const sizes = (product.sizes && product.sizes.length > 0) ? product.sizes : [{ weight: '500g', price: 299, originalPrice: 399, inStock: true }];
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
                      height: 'clamp(190px, 45vw, 230px)',
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

                    {/* Top Floating Badges */}
                    {product.badge && (
                      <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 2 }}>
                        <span 
                          style={{
                            background: 'rgba(255, 243, 230, 0.95)',
                            backdropFilter: 'blur(6px)',
                            color: '#B55A00',
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            padding: '4px 10px',
                            borderRadius: '9999px',
                            border: '1px solid #FFE0BD',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                          }}
                        >
                          {product.badge}
                        </span>
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

                  {/* Title & Subtitle */}
                  <h3 
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      color: '#20100A',
                      lineHeight: 1.3,
                      marginBottom: '4px'
                    }}
                  >
                    {product.name}
                  </h3>
                  <p 
                    style={{
                      fontSize: '0.82rem',
                      color: '#736257',
                      lineHeight: 1.4,
                      marginBottom: '12px'
                    }}
                  >
                    {product.subtitle}
                  </p>

                  {/* Star Rating */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', color: '#D9822B' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={13} fill="#D9822B" />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#736257', fontWeight: 600 }}>
                      ({product.reviewsCount || 850})
                    </span>
                  </div>

                  {/* Size Selector */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {sizes.map((s) => {
                        const isSizeActive = s.weight === currentWeight;
                        return (
                          <button
                            key={s.weight}
                            onClick={() => handleSizeSelect(product.id, s.weight)}
                            style={{
                              flex: 1,
                              padding: '6px 10px',
                              borderRadius: '6px',
                              border: isSizeActive ? '1.5px solid #20100A' : '1px solid #E2D7CB',
                              background: isSizeActive ? '#FBF9F6' : '#FFFFFF',
                              color: isSizeActive ? '#20100A' : '#736257',
                              fontWeight: isSizeActive ? 800 : 600,
                              fontSize: '0.82rem',
                              fontFamily: 'var(--font-heading)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <span>{s.weight}</span>
                            {isSizeActive && <Check size={12} color="#D9822B" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Nutrition Micro Highlights */}
                  {product.nutrition && (
                    <div 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: '#FAF6F0',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        marginBottom: '16px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        color: '#4B382D'
                      }}
                    >
                      <span>⚡ {product.nutrition.proteinPer100g} Protein</span>
                      <span style={{ color: '#C8B8A8' }}>•</span>
                      <span>🌱 {product.nutrition.sugarAdded} Added Sugar</span>
                    </div>
                  )}

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
                                fontSize: '0.86rem',
                                color: '#A19183',
                                textDecoration: 'line-through'
                              }}
                            >
                              ₹{activeSize.originalPrice}
                            </span>
                          )}
                        </div>
                        {discountPercent > 0 && (
                          <span style={{ fontSize: '0.7rem', color: '#166534', fontWeight: 700 }}>
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
        )}

      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .shop-controls-inner {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .shop-categories-scroll {
            overflow-x: auto !important;
            flex-wrap: nowrap !important;
            padding-bottom: 6px !important;
            -webkit-overflow-scrolling: touch;
          }
          .shop-categories-scroll::-webkit-scrollbar {
            display: none;
          }
          .shop-search-sort-group {
            width: 100% !important;
            justify-content: space-between !important;
          }
          .shop-search-box {
            max-width: none !important;
            flex: 1 1 100% !important;
          }
          .shop-sort-box {
            width: 100% !important;
            justify-content: flex-end !important;
          }
        }
      `}</style>
    </div>
  );
}

