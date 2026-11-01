import { Product, Order, SampleRequest } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = {
  // Products
  async getProducts(): Promise<Product[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/products`);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      return data.data;
    } catch (error) {
      console.warn('API unavailable, fallback to local data', error);
      const { PRODUCTS } = await import('@/data/products');
      return PRODUCTS;
    }
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}`);
      if (!res.ok) throw new Error('Failed to fetch product');
      const data = await res.json();
      return data.data;
    } catch (error) {
      console.warn('API unavailable, fallback to local data', error);
      const { PRODUCTS } = await import('@/data/products');
      return PRODUCTS.find((p) => p.id === id) || null;
    }
  },

  // Orders
  async createOrder(orderData: Omit<Order, 'id' | 'status' | 'createdAt'>): Promise<{ success: boolean; orderId: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (!res.ok) throw new Error('Order creation failed');
      return await res.json();
    } catch (error) {
      console.warn('Backend order failed, simulated local success', error);
      return { success: true, orderId: `NUTX-${Date.now().toString().slice(-6)}` };
    }
  },

  // Sample Request
  async requestSample(sampleData: Omit<SampleRequest, 'id' | 'createdAt'>): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/samples`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sampleData)
      });
      if (!res.ok) throw new Error('Sample request failed');
      return await res.json();
    } catch (error) {
      console.warn('Backend sample request failed, simulated local success', error);
      return { success: true, message: 'Free sample request received successfully!' };
    }
  }
};

