import mongoose, { Schema, Document } from 'mongoose';

export interface IReview {
  id: string;
  name: string;
  role: string;
  rating: number;
  date: string;
  comment: string;
  flavour: string;
  isVerified?: boolean;
  isActive?: boolean;
  order?: number;
}

export interface IReviewDocument extends Document {
  id: string;
  name: string;
  role: string;
  rating: number;
  date: string;
  comment: string;
  flavour: string;
  isVerified: boolean;
  isActive: boolean;
  order: number;
}

const ReviewSchema = new Schema<IReviewDocument>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, default: 'Verified Buyer' },
    rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    date: { type: String, default: 'Verified Buyer • Today' },
    comment: { type: String, required: true },
    flavour: { type: String, default: 'Dark Chocolate Peanut Butter' },
    isVerified: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 1 }
  },
  { timestamps: true }
);

export const ReviewModel = mongoose.model<IReviewDocument>('Review', ReviewSchema);

