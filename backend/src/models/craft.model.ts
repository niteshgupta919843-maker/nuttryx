import mongoose, { Schema, Document } from 'mongoose';

export interface ICraftStep {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  icon: string;
  desc: string;
  order: number;
  isActive?: boolean;
}

export interface ICraftDocument extends Document {
  key: string;
  badge: string;
  heading: string;
  description: string;
  steps: ICraftStep[];
  isActive: boolean;
}

const CraftStepSchema = new Schema<ICraftStep>(
  {
    id: { type: String, required: true },
    num: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    icon: { type: String, default: 'Sparkles' },
    desc: { type: String, required: true },
    order: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true }
  },
  { _id: false }
);

const CraftSchema = new Schema<ICraftDocument>(
  {
    key: { type: String, default: 'main_craft_story', unique: true },
    badge: { type: String, default: 'The Pure Craft' },
    heading: { type: String, default: 'From Gujarat Soil to Your Spoon' },
    description: {
      type: String,
      default: 'No chemical emulsifiers, no hydrogenated palm oils, no shortcuts. Just honest Indian peanuts transformed into pure nutrition.'
    },
    steps: { type: [CraftStepSchema], default: [] },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const CraftModel = mongoose.model<ICraftDocument>('Craft', CraftSchema);

