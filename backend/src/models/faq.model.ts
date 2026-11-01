import mongoose, { Schema, Document } from 'mongoose';

export interface IFaq {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order: number;
  isActive: boolean;
}

export interface IFaqDocument extends Omit<IFaq, 'id'>, Document {
  id: string;
}

const FaqSchema = new Schema<IFaqDocument>(
  {
    id: { type: String, required: true, unique: true },
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    category: { type: String, default: 'General' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

FaqSchema.index({ isActive: 1, order: 1 });

export const FaqModel = mongoose.model<IFaqDocument>('Faq', FaqSchema);

