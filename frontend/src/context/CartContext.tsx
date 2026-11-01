'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/data/products';
import { useAuth } from '@/context/AuthContext';

export interface CartItem {
  id: string; // combo of productId and weight
  product: Product;
  weight: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, weight: string, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isQuickViewOpen: boolean;
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  isSampleModalOpen: boolean;
  openSampleModal: () => void;
  closeSampleModal: () => void;
  isCheckoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  toast: string | null;
  triggerToast: (msg: string) => void;
  closeToast: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from localStorage safely
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nuttryx_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
        }
      }
      const savedWish = localStorage.getItem('nuttryx_wishlist');
      if (savedWish) {
        setWishlist(JSON.parse(savedWish));
      }
    } catch {
      // ignore
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage ONLY AFTER initial load from storage has completed
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('nuttryx_cart', JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('nuttryx_wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist, isLoaded]);

  // Re-open sample modal automatically if returning from login redirect
  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      const urlParams = new URLSearchParams(window.location.search);
      const isSampleRedirect = urlParams.get('sample') === 'true' || sessionStorage.getItem('nuttryx_open_sample') === 'true';
      if (isSampleRedirect) {
        sessionStorage.removeItem('nuttryx_open_sample');
        if (urlParams.has('sample')) {
          urlParams.delete('sample');
          const cleanSearch = urlParams.toString();
          const cleanUrl = window.location.pathname + (cleanSearch ? `?${cleanSearch}` : '');
          window.history.replaceState({}, '', cleanUrl);
        }
        setIsSampleModalOpen(true);
      }
    }
  }, [user]);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const closeToast = () => {
    setToast(null);
  };

  const performAddToCart = (product: Product, weight: string, quantity = 1) => {
    const sizeConfig = product.sizes.find(s => s.weight === weight) || product.sizes[0];
    const itemId = `${product.id}-${weight}`;

    setItems(prev => {
      const existing = prev.find(i => i.id === itemId);
      if (existing) {
        return prev.map(i =>
          i.id === itemId ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          product,
          weight,
          price: sizeConfig.price,
          quantity
        }
      ];
    });

    triggerToast(`Added ${quantity}x ${product.name} (${weight}) to your cart! 🥜`);
    setIsCartOpen(true);
  };

  // If customer logs in, automatically add any pending item they attempted to add previously
  useEffect(() => {
    if (user) {
      try {
        const pending = localStorage.getItem('nuttryx_pending_cart_item');
        if (pending) {
          const item = JSON.parse(pending);
          localStorage.removeItem('nuttryx_pending_cart_item');
          if (item?.product && item?.weight) {
            performAddToCart(item.product, item.weight, item.quantity || 1);
          }
        }
      } catch {
        // ignore
      }
    }
  }, [user]);

  const addToCart = (product: Product, weight: string, quantity = 1) => {
    // If customer is NOT logged in: redirect immediately to login / register page
    if (!user) {
      try {
        localStorage.setItem('nuttryx_pending_cart_item', JSON.stringify({
          product,
          weight,
          quantity
        }));
      } catch {
        // ignore
      }

      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname + window.location.search;
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}&action=add_to_cart`;
      }
      return;
    }

    // Customer IS logged in: add directly without asking to log in again!
    performAddToCart(product, weight, quantity);
  };

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems(prev =>
      prev
        .map(i => {
          if (i.id === id) {
            const nextQty = i.quantity + delta;
            return nextQty > 0 ? { ...i, quantity: nextQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        triggerToast('Removed from your favourites');
        return prev.filter(id => id !== productId);
      } else {
        triggerToast('Saved to your favourites ❤️');
        return [...prev, productId];
      }
    });
  };

  const openQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setIsQuickViewOpen(false);
    setQuickViewProduct(null);
  };

  const openSampleModal = () => {
    if (!user) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('nuttryx_open_sample', 'true');
        window.location.href = '/login?mode=login&redirect=' + encodeURIComponent('/?sample=true');
      }
      return;
    }
    setIsSampleModalOpen(true);
  };
  const closeSampleModal = () => setIsSampleModalOpen(false);

  const openCheckout = () => {
    setIsCartOpen(false);
    if (typeof window !== 'undefined') {
      window.location.href = '/checkout';
    }
  };
  const closeCheckout = () => setIsCheckoutOpen(false);

  const { cartCount, subtotal, discount, shipping, total } = React.useMemo(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const sub = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountRate = appliedCoupon === 'NUTTRYX10' ? 0.10 : appliedCoupon === 'FITNESS20' ? 0.20 : 0;
    const disc = Math.round(sub * discountRate);
    const ship = sub > 0 && sub - disc < 499 ? 49 : 0;
    const tot = Math.max(0, sub - disc + ship);
    return { cartCount: count, subtotal: sub, discount: disc, shipping: ship, total: tot };
  }, [items, appliedCoupon]);

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'NUTTRYX10') {
      setAppliedCoupon('NUTTRYX10');
      triggerToast('🎉 10% discount applied with code NUTTRYX10!');
      return { success: true, message: '10% discount applied!' };
    }
    if (clean === 'FITNESS20') {
      if (subtotal >= 699) {
        setAppliedCoupon('FITNESS20');
        triggerToast('🔥 20% Mega Fitness discount applied!');
        return { success: true, message: '20% off on orders above ₹699!' };
      }
      return { success: false, message: 'FITNESS20 requires minimum order of ₹699' };
    }
    return { success: false, message: 'Invalid coupon code. Try NUTTRYX10' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    triggerToast('Coupon removed');
  };

  const contextValue = React.useMemo(() => ({
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    subtotal,
    discount,
    shipping,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    isCartOpen,
    setIsCartOpen,
    isQuickViewOpen,
    quickViewProduct,
    openQuickView,
    closeQuickView,
    isSampleModalOpen,
    openSampleModal,
    closeSampleModal,
    isCheckoutOpen,
    openCheckout,
    closeCheckout,
    wishlist,
    toggleWishlist,
    toast,
    triggerToast,
    closeToast
  }), [
    items,
    cartCount,
    subtotal,
    discount,
    shipping,
    total,
    appliedCoupon,
    isCartOpen,
    isQuickViewOpen,
    quickViewProduct,
    isSampleModalOpen,
    isCheckoutOpen,
    wishlist,
    toast
  ]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
