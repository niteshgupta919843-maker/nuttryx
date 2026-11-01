import { TickerModel } from '../models/ticker.model';

export const DEFAULT_TICKER_ITEMS: string[] = [
  '🔥 100% Slow Roasted Saurashtra Peanuts',
  '💪 30g Pure Plant Protein',
  '🚫 Zero Added Refined Sugar',
  '🌿 Zero Palm Oil or Trans Fats',
  '🌱 100% Pure Vegetarian Certified',
  '🚚 Free Express Shipping Over ₹499',
  '🎁 Free 50g Sample with Every Order',
  '🇮🇳 Made with Pride in India'
];

export class TickerService {
  async getTicker(): Promise<{ items: string[]; speed: number; isActive: boolean }> {
    try {
      const doc = await TickerModel.findOne({ key: 'main_ticker' }).lean();
      if (doc && Array.isArray(doc.items) && doc.items.length > 0) {
        return {
          items: doc.items,
          speed: doc.speed || 30,
          isActive: doc.isActive !== false
        };
      }
    } catch (err) {
      console.warn('MongoDB ticker fetch failed:', err);
    }
    return {
      items: DEFAULT_TICKER_ITEMS,
      speed: 30,
      isActive: true
    };
  }

  async updateTicker(items: string[], speed = 30, isActive = true): Promise<{ items: string[]; speed: number; isActive: boolean }> {
    const updated = await TickerModel.findOneAndUpdate(
      { key: 'main_ticker' },
      { $set: { items, speed, isActive } },
      { new: true, upsert: true }
    ).lean();
    return {
      items: updated.items,
      speed: updated.speed || speed,
      isActive: updated.isActive !== false
    };
  }
}

export const tickerService = new TickerService();

