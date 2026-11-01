import mongoose, { Schema, Document } from 'mongoose';

export interface ISlide {
  id: string;
  name: string;
  subtitle: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  bannerImage: string;
  badge1: string;
  badge2: string;
  badge3: string;
  buttonText: string;
  buttonLink: string;
  sampleButtonText: string;
  order: number;
  isActive: boolean;
}

export interface ISlideDocument extends Omit<ISlide, 'id'>, Document {
  id: string;
}

const SlideSchema = new Schema<ISlideDocument>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    subtitle: { type: String, default: 'PURE PEANUT BUTTER' },
    titleLine1: { type: String, required: true },
    titleLine2: { type: String, required: true },
    description: { type: String, required: true },
    bannerImage: { type: String, required: true },
    badge1: { type: String, default: 'HIGH\nPROTEIN' },
    badge2: { type: String, default: 'NO ADDED\nSUGAR' },
    badge3: { type: String, default: '100%\nNATURAL' },
    buttonText: { type: String, default: 'Shop Now' },
    buttonLink: { type: String, default: '/shop' },
    sampleButtonText: { type: String, default: 'Get Free Sample' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

SlideSchema.index({ isActive: 1, order: 1 });
SlideSchema.index({ createdAt: -1 });

export const SlideModel = mongoose.model<ISlideDocument>('Slide', SlideSchema);

