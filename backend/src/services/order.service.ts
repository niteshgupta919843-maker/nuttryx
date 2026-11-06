import mongoose from 'mongoose';
import { OrderModel } from '../models/Order.model';
import { SampleModel } from '../models/Sample.model';
import { Order, SampleRequest } from '../types';
import { emailService } from './email.service';

export class OrderService {
  async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'status'> & { status?: Order['status'] }): Promise<Order> {
    const newOrder = {
      ...orderData,
      id: (orderData as any).id || `NUTX-${Date.now().toString().slice(-6)}`,
      status: orderData.status || 'pending',
      paymentMethod: orderData.paymentMethod || 'cod',
      paymentStatus: orderData.paymentStatus || (orderData.paymentMethod === 'cod' ? 'cod' : 'pending'),
      paymentId: orderData.paymentId || '',
      razorpayOrderId: orderData.razorpayOrderId || ''
    };
    let resultOrder: Order;
    try {
      const created = await OrderModel.create(newOrder);
      resultOrder = (created as any).toObject() as Order;
    } catch (e) {
      console.warn('MongoDB order insert failed, fallback in-memory', e);
      resultOrder = {
        ...newOrder,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
    }

    // Trigger instant email notification in background (non-blocking for sub-100ms checkout response)
    emailService.sendOrderNotification(resultOrder).catch((emailErr) => {
      console.error('Background order email notification error:', emailErr);
    });

    return resultOrder;
  }

  async getAllOrders(): Promise<Order[]> {
    try {
      const orders = await OrderModel.find().sort({ createdAt: -1 }).lean();
      return orders as unknown as Order[];
    } catch (e) {
      return [];
    }
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order | null> {
    const query = mongoose.isValidObjectId(id) ? { $or: [{ id }, { _id: id }] } : { id };
    const updated = await OrderModel.findOneAndUpdate(query, { $set: { status } }, { new: true }).lean();
    return updated as unknown as Order | null;
  }

  async updateSampleStatus(id: string, status: 'pending' | 'dispatched' | 'delivered'): Promise<SampleRequest | null> {
    const query = mongoose.isValidObjectId(id) ? { $or: [{ id }, { _id: id }] } : { id };
    const updated = await SampleModel.findOneAndUpdate(query, { $set: { status } }, { new: true }).lean();
    return updated as unknown as SampleRequest | null;
  }

  async trackOrder(query: string): Promise<Order | null> {
    try {
      const clean = query.trim();
      if (!clean) return null;

      const escaped = clean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`^${escaped}$`, 'i');

      // 1. Search by exact or case-insensitive Order ID, Phone, or Email
      let order = await OrderModel.findOne({
        $or: [
          { id: clean.toUpperCase() },
          { id: regex },
          { 'customer.phone': clean },
          { 'customer.phone': clean.replace(/\D/g, '') },
          { 'customer.email': regex }
        ]
      }).sort({ createdAt: -1 }).lean();

      // 2. If user provided partial digits (e.g. "458898" or "892102"), search with NUTX- prefix
      if (!order && /^\d+$/.test(clean)) {
        order = await OrderModel.findOne({ id: `NUTX-${clean}` }).lean();
      }

      // 3. Substring match fallback on ID
      if (!order && clean.length >= 4) {
        order = await OrderModel.findOne({ id: new RegExp(escaped, 'i') }).sort({ createdAt: -1 }).lean();
      }

      return order as unknown as Order | null;
    } catch (e) {
      console.error('Order tracking lookup error:', e);
      return null;
    }
  }

  async createSampleRequest(sampleData: Omit<SampleRequest, 'id' | 'createdAt'>): Promise<SampleRequest> {
    const newSample = {
      ...sampleData,
      id: `SMP-${Date.now().toString().slice(-6)}`
    };
    let resultSample: SampleRequest;
    try {
      const created = await SampleModel.create(newSample);
      resultSample = (created as any).toObject() as SampleRequest;
    } catch (e) {
      console.warn('MongoDB sample insert failed, fallback in-memory', e);
      resultSample = {
        ...newSample,
        createdAt: new Date().toISOString()
      };
    }

    // Send instant email notification in background (non-blocking for instant response)
    emailService.sendSampleNotification(resultSample).catch((emailErr) => {
      console.error('Background sample email notification error:', emailErr);
    });

    return resultSample;
  }

  async getAllSampleRequests(): Promise<SampleRequest[]> {
    try {
      const samples = await SampleModel.find().sort({ createdAt: -1 }).lean();
      return samples as unknown as SampleRequest[];
    } catch (e) {
      return [];
    }
  }
}

export const orderService = new OrderService();
