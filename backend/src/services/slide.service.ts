import { SlideModel, ISlide } from '../models/slide.model';

export const INITIAL_SLIDES: ISlide[] = [
  {
    id: 'slide-dark-chocolate',
    name: 'Dark Chocolate Peanut Butter',
    subtitle: 'PURE PEANUT BUTTER',
    titleLine1: 'Creamy. Roasted.',
    titleLine2: 'Protein Rich.',
    description: 'Fuel your fitness, work, and daily life with the natural power of real peanuts.',
    bannerImage: '/images/hero-bg-dark-chocolate.jpg',
    badge1: 'HIGH\nPROTEIN',
    badge2: 'NO ADDED\nSUGAR',
    badge3: '100%\nNATURAL',
    buttonText: 'Shop Now',
    buttonLink: '/shop',
    sampleButtonText: 'Book 50g Sample',
    order: 1,
    isActive: true
  },
  {
    id: 'slide-creamy',
    name: 'Natural Creamy Peanut Butter',
    subtitle: '100% PURE & NATURAL',
    titleLine1: 'Silky Smooth.',
    titleLine2: 'Zero Added Sugar.',
    description: 'Handcrafted from slow-roasted Saurashtra peanuts for an ultra-smooth, creamy texture.',
    bannerImage: '/images/hero-bg-creamy.jpg',
    badge1: 'HIGH\nPROTEIN',
    badge2: 'NO ADDED\nSUGAR',
    badge3: '100%\nNATURAL',
    buttonText: 'Shop Now',
    buttonLink: '/shop',
    sampleButtonText: 'Book 50g Sample',
    order: 2,
    isActive: true
  },
  {
    id: 'slide-crunchy',
    name: 'Roasted Crunchy Peanut Butter',
    subtitle: 'EXTRA CRUNCH & FIBER',
    titleLine1: 'Bold Crunch.',
    titleLine2: 'Power Packed.',
    description: 'Loaded with real crispy roasted peanut bits in every spoonful for high-protein workouts.',
    bannerImage: '/images/hero-bg-crunchy.jpg',
    badge1: 'HIGH\nPROTEIN',
    badge2: 'NO ADDED\nSUGAR',
    badge3: '100%\nNATURAL',
    buttonText: 'Shop Now',
    buttonLink: '/shop',
    sampleButtonText: 'Book 50g Sample',
    order: 3,
    isActive: true
  }
];

export class SlideService {
  async seedIfEmpty(): Promise<void> {
    try {
      const count = await SlideModel.countDocuments();
      if (count === 0) {
        await SlideModel.insertMany(INITIAL_SLIDES);
        console.log('🥜 Seeded initial Hero Banner slides into MongoDB');
      }
    } catch (e) {
      console.warn('Could not seed slides:', e);
    }
  }

  async getAllSlides(): Promise<ISlide[]> {
    try {
      const slides = await SlideModel.find().sort({ order: 1, createdAt: 1 }).lean();
      if (slides && slides.length > 0) return slides as unknown as ISlide[];
    } catch (err) {
      console.warn('MongoDB slide query failed, using memory fallback', err);
    }
    return INITIAL_SLIDES;
  }

  async getSlideById(id: string): Promise<ISlide | null> {
    try {
      const slide = await SlideModel.findOne({ id }).lean();
      if (slide) return slide as unknown as ISlide;
    } catch (err) {
      console.warn('MongoDB slide query failed', err);
    }
    return INITIAL_SLIDES.find(s => s.id === id) || null;
  }

  async createSlide(data: Partial<ISlide>): Promise<ISlide> {
    const id = data.id || `slide-${Date.now()}`;
    const newSlide = await SlideModel.create({
      ...data,
      id
    });
    return newSlide.toObject() as unknown as ISlide;
  }

  async updateSlide(id: string, data: Partial<ISlide>): Promise<ISlide | null> {
    const updated = await SlideModel.findOneAndUpdate(
      { id },
      { $set: data },
      { new: true }
    ).lean();
    return updated as unknown as ISlide | null;
  }

  async deleteSlide(id: string): Promise<boolean> {
    const res = await SlideModel.deleteOne({ id });
    return res.deletedCount > 0;
  }
}

export const slideService = new SlideService();

