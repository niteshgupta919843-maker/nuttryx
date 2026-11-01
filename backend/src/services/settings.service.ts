import { SettingsModel } from '../models/settings.model';

export const DEFAULT_SETTINGS = {
  companyName: 'NUTTRYX Foods Pvt Ltd',
  factoryAddress: 'NUTTRYX Foods Pvt Ltd, GIDC Agro Park, Rajkot - Saurashtra, Gujarat 360003',
  googleMapsUrl: 'https://maps.google.com/?q=GIDC+Agro+Park+Rajkot+Gujarat+360003',
  supportPhone: '+91 98765 43210',
  supportHours: '(Mon - Sat, 10am - 7pm)',
  supportEmail: 'care@nuttryx.com',
  fssaiNumber: '11524999000123',
  instagramUrl: 'https://instagram.com',
  facebookUrl: 'https://facebook.com',
  twitterUrl: 'https://twitter.com',
  youtubeUrl: 'https://youtube.com',
  whatsappNumber: '+91 98765 43210'
};

export class SettingsService {
  async getSettings(): Promise<typeof DEFAULT_SETTINGS> {
    try {
      const doc = await SettingsModel.findOne({ key: 'store_settings' }).lean();
      if (doc) {
        return {
          companyName: doc.companyName || DEFAULT_SETTINGS.companyName,
          factoryAddress: doc.factoryAddress || DEFAULT_SETTINGS.factoryAddress,
          googleMapsUrl: doc.googleMapsUrl || DEFAULT_SETTINGS.googleMapsUrl,
          supportPhone: doc.supportPhone || DEFAULT_SETTINGS.supportPhone,
          supportHours: doc.supportHours || DEFAULT_SETTINGS.supportHours,
          supportEmail: doc.supportEmail || DEFAULT_SETTINGS.supportEmail,
          fssaiNumber: doc.fssaiNumber || DEFAULT_SETTINGS.fssaiNumber,
          instagramUrl: doc.instagramUrl || DEFAULT_SETTINGS.instagramUrl,
          facebookUrl: doc.facebookUrl || DEFAULT_SETTINGS.facebookUrl,
          twitterUrl: doc.twitterUrl || DEFAULT_SETTINGS.twitterUrl,
          youtubeUrl: doc.youtubeUrl || DEFAULT_SETTINGS.youtubeUrl,
          whatsappNumber: doc.whatsappNumber || DEFAULT_SETTINGS.whatsappNumber
        };
      }
    } catch (err) {
      console.warn('MongoDB settings fetch failed:', err);
    }
    return DEFAULT_SETTINGS;
  }

  async updateSettings(data: Partial<typeof DEFAULT_SETTINGS>): Promise<typeof DEFAULT_SETTINGS> {
    const updated = await SettingsModel.findOneAndUpdate(
      { key: 'store_settings' },
      { $set: data },
      { new: true, upsert: true }
    ).lean();
    return {
      companyName: updated.companyName || DEFAULT_SETTINGS.companyName,
      factoryAddress: updated.factoryAddress || DEFAULT_SETTINGS.factoryAddress,
      googleMapsUrl: updated.googleMapsUrl || DEFAULT_SETTINGS.googleMapsUrl,
      supportPhone: updated.supportPhone || DEFAULT_SETTINGS.supportPhone,
      supportHours: updated.supportHours || DEFAULT_SETTINGS.supportHours,
      supportEmail: updated.supportEmail || DEFAULT_SETTINGS.supportEmail,
      fssaiNumber: updated.fssaiNumber || DEFAULT_SETTINGS.fssaiNumber,
      instagramUrl: updated.instagramUrl || DEFAULT_SETTINGS.instagramUrl,
      facebookUrl: updated.facebookUrl || DEFAULT_SETTINGS.facebookUrl,
      twitterUrl: updated.twitterUrl || DEFAULT_SETTINGS.twitterUrl,
      youtubeUrl: updated.youtubeUrl || DEFAULT_SETTINGS.youtubeUrl,
      whatsappNumber: updated.whatsappNumber || DEFAULT_SETTINGS.whatsappNumber
    };
  }
}

export const settingsService = new SettingsService();

