import { Request, Response } from 'express';
import { FaqModel, IFaq } from '../models/faq.model';

const DEFAULT_FAQS: Omit<IFaq, 'id'>[] = [
  {
    question: 'Why does oil float on top of the peanut butter?',
    answer: 'Natural peanut oil separation is the ultimate proof of purity! Commercial brands add hydrogenated palm oil and chemical emulsifiers to keep the oil mixed artificially. At NUTTRYX, we use zero palm oil. Simply stir the natural oils back in with a spoon or store the jar upside down.',
    category: 'Purity & Quality',
    order: 1,
    isActive: true
  },
  {
    question: 'What makes NUTTRYX different from supermarket peanut butter brands?',
    answer: 'Most commercial brands use 20-30% added refined sugar, cheap vegetable oil, and low-grade peanuts. NUTTRYX uses 100% slow-roasted Saurashtra bold peanuts, zero refined sugar, zero palm oil, and delivers 30g of authentic plant protein per 100g.',
    category: 'Purity & Quality',
    order: 2,
    isActive: true
  },
  {
    question: 'Is NUTTRYX suitable for diabetics and keto diets?',
    answer: 'Yes, absolutely! Our Classic Creamy and Crunchy peanut butters have 0g added sugar and only naturally occurring complex carbohydrates with high fibre (low glycemic index). It does not trigger sudden insulin spikes.',
    category: 'Diet & Health',
    order: 3,
    isActive: true
  },
  {
    question: 'How long does a jar stay fresh and how should I store it?',
    answer: 'NUTTRYX has a shelf life of 9 months from the date of manufacture. Store it in a cool, dry place away from direct sunlight. Refrigeration is optional-it will make it firmer, while room temperature keeps it creamy and easily spreadable.',
    category: 'Storage & Freshness',
    order: 4,
    isActive: true
  },
  {
    question: 'How does the Free 50g Sample offer work?',
    answer: 'Simply choose your favourite flavour on our Free Sample claim section, enter your delivery address, and we will courier a fresh 50g jar straight to your doorstep so you can taste the pure Saurashtra roast before ordering full jars!',
    category: 'Samples & Orders',
    order: 5,
    isActive: true
  }
];

export class FaqController {
  async getFaqs(req: Request, res: Response): Promise<void> {
    try {
      let faqs = await FaqModel.find({ isActive: true }).sort({ order: 1, createdAt: 1 }).lean();

      // If empty, auto-seed defaults
      if (!faqs || faqs.length === 0) {
        console.log('🌱 Pre-seeding default FAQs into MongoDB...');
        const seeded = await FaqModel.insertMany(
          DEFAULT_FAQS.map((f, i) => ({
            ...f,
            id: `FAQ-${(1001 + i).toString()}`
          }))
        );
        faqs = seeded.map(doc => doc.toObject());
      }

      res.status(200).json({
        success: true,
        count: faqs.length,
        data: faqs
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch FAQs'
      });
    }
  }

  async getAllAdminFaqs(req: Request, res: Response): Promise<void> {
    try {
      let faqs = await FaqModel.find({}).sort({ order: 1, createdAt: 1 }).lean();

      if (!faqs || faqs.length === 0) {
        const seeded = await FaqModel.insertMany(
          DEFAULT_FAQS.map((f, i) => ({
            ...f,
            id: `FAQ-${(1001 + i).toString()}`
          }))
        );
        faqs = seeded.map(doc => doc.toObject());
      }

      res.status(200).json({
        success: true,
        count: faqs.length,
        data: faqs
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch admin FAQs'
      });
    }
  }

  async createFaq(req: Request, res: Response): Promise<void> {
    try {
      const { question, answer, category, order, isActive } = req.body;
      if (!question || !answer) {
        res.status(400).json({
          success: false,
          message: 'Both question and answer are required.'
        });
        return;
      }

      const count = await FaqModel.countDocuments();
      const id = `FAQ-${Date.now().toString().slice(-6)}`;

      const newFaq = await FaqModel.create({
        id,
        question: question.trim(),
        answer: answer.trim(),
        category: category?.trim() || 'General',
        order: typeof order === 'number' ? order : count + 1,
        isActive: isActive !== false
      });

      res.status(201).json({
        success: true,
        message: 'FAQ created successfully!',
        data: newFaq
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create FAQ'
      });
    }
  }

  async updateFaq(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { question, answer, category, order, isActive } = req.body;

      const updated = await FaqModel.findOneAndUpdate(
        { $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
        {
          $set: {
            ...(question !== undefined && { question: question.trim() }),
            ...(answer !== undefined && { answer: answer.trim() }),
            ...(category !== undefined && { category: category.trim() }),
            ...(order !== undefined && { order: Number(order) }),
            ...(isActive !== undefined && { isActive: Boolean(isActive) })
          }
        },
        { returnDocument: 'after' }
      );

      if (!updated) {
        res.status(404).json({ success: false, message: 'FAQ not found.' });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'FAQ updated successfully!',
        data: updated
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update FAQ'
      });
    }
  }

  async deleteFaq(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await FaqModel.findOneAndDelete({
        $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
      });

      if (!deleted) {
        res.status(404).json({ success: false, message: 'FAQ not found.' });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'FAQ deleted successfully!'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete FAQ'
      });
    }
  }
}

export const faqController = new FaqController();

