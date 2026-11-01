import mongoose, { Schema, Document } from 'mongoose';

export interface ITickerDocument extends Document {
  key: string;
  items: string[];
  speed?: number;
  isActive: boolean;
}

const TickerSchema = new Schema<ITickerDocument>(
  {
    key: { type: String, default: 'main_ticker', unique: true },
    items: { type: [String], required: true },
    speed: { type: Number, default: 30 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const TickerModel = mongoose.model<ITickerDocument>('Ticker', TickerSchema);

