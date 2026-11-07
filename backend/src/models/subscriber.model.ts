import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscriberDocument extends Document {
  email: string;
  couponSent: boolean;
  couponCode: string;
  createdAt: Date;
}

const SubscriberSchema = new Schema<ISubscriberDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    couponSent: { type: Boolean, default: true },
    couponCode: { type: String, default: 'NUTTRYX15' }
  },
  { timestamps: true }
);

export const SubscriberModel = mongoose.model<ISubscriberDocument>('Subscriber', SubscriberSchema);

