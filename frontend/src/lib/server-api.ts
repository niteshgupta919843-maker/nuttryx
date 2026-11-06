import { Product } from '@/types';

const BACKEND_BASE = (process.env.NEXT_PUBLIC_BACKEND_URL || 'https://nuttryx.onrender.com').replace(/\/$/, '');

export async function fetchServerProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${BACKEND_BASE}/api/products?_t=${Date.now()}`, {
      cache: 'no-store'
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch (err) {
    console.error('Server fetch products error:', err);
  }
  return [];
}

export async function fetchServerSlides(): Promise<any[]> {
  try {
    const res = await fetch(`${BACKEND_BASE}/api/slides?_t=${Date.now()}`, {
      cache: 'no-store'
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch (err) {
    console.error('Server fetch slides error:', err);
  }
  return [];
}

export async function fetchServerFaqs(): Promise<any[]> {
  try {
    const res = await fetch(`${BACKEND_BASE}/api/faqs?_t=${Date.now()}`, {
      cache: 'no-store'
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch (err) {
    console.error('Server fetch faqs error:', err);
  }
  return [];
}

export async function fetchServerReviews(): Promise<any[]> {
  try {
    const res = await fetch(`${BACKEND_BASE}/api/reviews?_t=${Date.now()}`, {
      cache: 'no-store'
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch (err) {
    console.error('Server fetch reviews error:', err);
  }
  return [];
}

export async function fetchServerCraft(): Promise<any | null> {
  try {
    const res = await fetch(`${BACKEND_BASE}/api/craft?_t=${Date.now()}`, {
      cache: 'no-store'
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (err) {
    console.error('Server fetch craft error:', err);
  }
  return null;
}

export async function fetchServerBenefit(): Promise<any | null> {
  try {
    const res = await fetch(`${BACKEND_BASE}/api/benefit?_t=${Date.now()}`, {
      cache: 'no-store'
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (err) {
    console.error('Server fetch benefit error:', err);
  }
  return null;
}

export async function fetchServerTicker(): Promise<string[]> {
  try {
    const res = await fetch(`${BACKEND_BASE}/api/ticker?_t=${Date.now()}`, {
      cache: 'no-store'
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch (err) {
    console.error('Server fetch ticker error:', err);
  }
  return [];
}

export async function fetchServerLifestyle(): Promise<any | null> {
  try {
    const res = await fetch(`${BACKEND_BASE}/api/lifestyle?_t=${Date.now()}`, {
      cache: 'no-store'
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (err) {
    console.error('Server fetch lifestyle error:', err);
  }
  return null;
}

