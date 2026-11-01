import mongoose, { Schema, Document } from 'mongoose';
import { SampleRequest } from '../types';

export interface ISampleDocument extends Omit<SampleRequest, 'id'>, Document {
  id: string;
}

const SampleSchema = new Schema<ISampleDocument>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    selectedFlavour: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'dispatched', 'delivered'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

SampleSchema.index({ phone: 1 });
SampleSchema.index({ createdAt: -1 });
SampleSchema.index({ status: 1 });

export const SampleModel = mongoose.model<ISampleDocument>('Sample', SampleSchema);
