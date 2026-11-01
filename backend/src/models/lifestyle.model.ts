import mongoose, { Schema, Document } from 'mongoose';

export interface ILifestylePillar {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  desc: string;
  perk: string;
  order: number;
  isActive?: boolean;
}

export interface ILifestyleDocument extends Document {
  key: string;
  badge: string;
  heading: string;
  description: string;
  pillars: ILifestylePillar[];
  isActive: boolean;
}

const LifestylePillarSchema = new Schema<ILifestylePillar>(
  {
    id: { type: String, required: true },
    icon: { type: String, default: 'Dumbbell' },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    desc: { type: String, required: true },
    perk: { type: String, required: true },
    order: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true }
  },
  { _id: false }
);

const LifestyleSchema = new Schema<ILifestyleDocument>(
  {
    key: { type: String, default: 'main_lifestyle', unique: true },
    badge: { type: String, default: 'Built For Every Lifestyle' },
    heading: { type: String, default: 'Who Is NUTTRYX Crafted For?' },
    description: {
      type: String,
      default: 'From high-performance gym workouts to busy laptop desks and school lunchboxes, our pure peanut butter fuels your daily journey.'
    },
    pillars: { type: [LifestylePillarSchema], default: [] },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const LifestyleModel = mongoose.model<ILifestyleDocument>('Lifestyle', LifestyleSchema);

