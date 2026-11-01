import mongoose, { Schema, Document } from 'mongoose';

export interface ISettingsDocument extends Document {
  key: string;
  companyName: string;
  factoryAddress: string;
  googleMapsUrl: string;
  supportPhone: string;
  supportHours: string;
  supportEmail: string;
  fssaiNumber: string;
  instagramUrl: string;
  facebookUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
  whatsappNumber: string;
}

const SettingsSchema = new Schema<ISettingsDocument>(
  {
    key: { type: String, default: 'store_settings', unique: true },
    companyName: { type: String, default: 'NUTTRYX Foods Pvt Ltd' },
    factoryAddress: { type: String, default: 'NUTTRYX Foods Pvt Ltd, GIDC Agro Park, Rajkot - Saurashtra, Gujarat 360003' },
    googleMapsUrl: { type: String, default: 'https://maps.google.com/?q=GIDC+Agro+Park+Rajkot+Gujarat+360003' },
    supportPhone: { type: String, default: '+91 98765 43210' },
    supportHours: { type: String, default: '(Mon - Sat, 10am - 7pm)' },
    supportEmail: { type: String, default: 'care@nuttryx.com' },
    fssaiNumber: { type: String, default: '11524999000123' },
    instagramUrl: { type: String, default: 'https://instagram.com' },
    facebookUrl: { type: String, default: 'https://facebook.com' },
    twitterUrl: { type: String, default: 'https://twitter.com' },
    youtubeUrl: { type: String, default: 'https://youtube.com' },
    whatsappNumber: { type: String, default: '+91 98765 43210' }
  },
  { timestamps: true }
);

export const SettingsModel = mongoose.model<ISettingsDocument>('Settings', SettingsSchema);

