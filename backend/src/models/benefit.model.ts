import mongoose, { Schema, Document } from 'mongoose';

export interface IBenefitRow {
  id: string;
  feature: string;
  nuttryx: string;
  regular: string;
  nuttryxWins?: boolean;
  order: number;
  isActive?: boolean;
}

export interface IBenefitDocument extends Document {
  key: string;
  badge: string;
  heading: string;
  description: string;
  footerBanner: string;
  footerLinkText: string;
  footerLinkUrl: string;
  rows: IBenefitRow[];
  isActive: boolean;
}

const BenefitRowSchema = new Schema<IBenefitRow>(
  {
    id: { type: String, required: true },
    feature: { type: String, required: true },
    nuttryx: { type: String, required: true },
    regular: { type: String, required: true },
    nuttryxWins: { type: Boolean, default: true },
    order: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true }
  },
  { _id: false }
);

const BenefitSchema = new Schema<IBenefitDocument>(
  {
    key: { type: String, default: 'main_benefit', unique: true },
    badge: { type: String, default: 'The Clean Label Revolution' },
    heading: { type: String, default: 'Why NUTTRYX Wins Hands Down' },
    description: {
      type: String,
      default: 'We started NUTTRYX because Indian fitness enthusiasts and families deserve genuine, unadulterated peanut butter without toxic palm oil and excessive sugars.'
    },
    footerBanner: {
      type: String,
      default: 'Certified under FSSAI regulations and tested in NABL accredited food testing laboratories.'
    },
    footerLinkText: { type: String, default: 'Try Pure Taste →' },
    footerLinkUrl: { type: String, default: '#products' },
    rows: { type: [BenefitRowSchema], default: [] },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const BenefitModel = mongoose.model<IBenefitDocument>('Benefit', BenefitSchema);

