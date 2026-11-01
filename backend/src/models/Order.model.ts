import mongoose, { Schema, Document } from 'mongoose';
import { Order } from '../types';

export interface IOrderDocument extends Omit<Order, 'id'>, Document {
  id: string;
}

const OrderSchema = new Schema<IOrderDocument>(
  {
    id: { type: String, required: true, unique: true },
    customer: {
      name: { type: String, required: true },
      email: { type: String, default: '' },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, default: '' },
      pincode: { type: String, required: true }
    },
    items: [
      {
        product: { type: Schema.Types.Mixed, required: true },
        selectedSize: { type: Schema.Types.Mixed, required: true },
        quantity: { type: Number, required: true, default: 1 }
      }
    ],
    subtotal: { type: Number, required: true },
    shipping: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      enum: ['razorpay', 'upi', 'card', 'cod'],
      default: 'cod'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'cod'],
      default: 'cod'
    },
    paymentId: { type: String, default: '' },
    razorpayOrderId: { type: String, default: '' }
  },
  { timestamps: true }
);

OrderSchema.index({ 'customer.phone': 1 });
OrderSchema.index({ 'customer.email': 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

export const OrderModel = mongoose.model<IOrderDocument>('Order', OrderSchema);
