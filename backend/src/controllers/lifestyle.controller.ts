import { Request, Response, NextFunction } from 'express';
import { LifestyleModel, ILifestylePillar } from '../models/lifestyle.model';

const DEFAULT_PILLARS: ILifestylePillar[] = [
  {
    id: 'lifestyle-1',
    icon: 'Dumbbell',
    title: 'Supports Fitness',
    subtitle: 'Gym & Athletes',
    desc: '30g plant protein per 100g supplies clean amino acids for muscle repair and endurance without bloating or hydrogenated oils.',
    perk: 'Ideal pre/post workout fuel',
    order: 1,
    isActive: true
  },
  {
    id: 'lifestyle-2',
    icon: 'GraduationCap',
    title: 'Fuels Students',
    subtitle: 'Late Nights & Exams',
    desc: 'Rich in vitamin E, magnesium and healthy fats that enhance cognitive focus, memory retention, and all-night study power.',
    perk: 'Sustained energy, zero crash',
    order: 2,
    isActive: true
  },
  {
    id: 'lifestyle-3',
    icon: 'Laptop',
    title: 'Working Professionals',
    subtitle: 'Busy Workdays',
    desc: 'No time for breakfast? Spread on brown bread or blend in a 60-second smoothie for 4+ hours of full productivity.',
    perk: 'Zero mid-afternoon slump',
    order: 3,
    isActive: true
  },
  {
    id: 'lifestyle-4',
    icon: 'Users',
    title: 'Healthier Families',
    subtitle: 'Kids & Parents',
    desc: 'Pure clean nutrition without chemical stabilizers or hidden cane sugars. Wholesome goodness every mom can trust completely.',
    perk: '100% kid-safe pure ingredients',
    order: 4,
    isActive: true
  }
];

export class LifestyleController {
  // GET /api/lifestyle - Returns lifestyle data (auto-seeds if missing)
  async getLifestyle(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let doc = await LifestyleModel.findOne({ key: 'main_lifestyle' });

      if (!doc) {
        doc = await LifestyleModel.create({
          key: 'main_lifestyle',
          badge: 'Built For Every Lifestyle',
          heading: 'Who Is NUTTRYX Crafted For?',
          description: 'From high-performance gym workouts to busy laptop desks and school lunchboxes, our pure peanut butter fuels your daily journey.',
          pillars: DEFAULT_PILLARS,
          isActive: true
        });
      } else if (!doc.pillars || doc.pillars.length === 0) {
        doc.pillars = DEFAULT_PILLARS;
        await doc.save();
      }

      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      res.status(200).json({
        success: true,
        data: doc
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/lifestyle - Update header and/or full pillars
  async updateLifestyle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { badge, heading, description, pillars, isActive } = req.body;

      let doc = await LifestyleModel.findOne({ key: 'main_lifestyle' });
      if (!doc) {
        doc = new LifestyleModel({ key: 'main_lifestyle', pillars: DEFAULT_PILLARS });
      }

      if (badge !== undefined) doc.badge = badge.trim();
      if (heading !== undefined) doc.heading = heading.trim();
      if (description !== undefined) doc.description = description.trim();
      if (isActive !== undefined) doc.isActive = Boolean(isActive);
      if (Array.isArray(pillars)) doc.pillars = pillars;

      await doc.save();

      res.status(200).json({
        success: true,
        message: 'Lifestyle section updated successfully!',
        data: doc
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/lifestyle/pillars - Add a new pillar card
  async addPillar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { icon, title, subtitle, desc, perk, order } = req.body;

      if (!title || !desc) {
        res.status(400).json({
          success: false,
          message: 'Pillar title and description are required'
        });
        return;
      }

      let doc = await LifestyleModel.findOne({ key: 'main_lifestyle' });
      if (!doc) {
        doc = new LifestyleModel({ key: 'main_lifestyle', pillars: DEFAULT_PILLARS });
      }

      const pillarId = `lifestyle-${Date.now()}`;
      const newPillar: ILifestylePillar = {
        id: pillarId,
        icon: icon || 'Dumbbell',
        title: title.trim(),
        subtitle: (subtitle || 'Daily Nutrition').trim(),
        desc: desc.trim(),
        perk: (perk || 'Clean nutrition for daily energy').trim(),
        order: Number(order) || doc.pillars.length + 1,
        isActive: true
      };

      doc.pillars.push(newPillar);
      await doc.save();

      res.status(201).json({
        success: true,
        message: 'Lifestyle pillar added successfully!',
        data: newPillar,
        allPillars: doc.pillars
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/lifestyle/pillars/:id - Update an existing pillar card
  async updatePillar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { icon, title, subtitle, desc, perk, order, isActive } = req.body;

      const doc = await LifestyleModel.findOne({ key: 'main_lifestyle' });
      if (!doc) {
        res.status(404).json({ success: false, message: 'Lifestyle section not found' });
        return;
      }

      const pillarIndex = doc.pillars.findIndex(p => p.id === id);
      if (pillarIndex === -1) {
        res.status(404).json({ success: false, message: 'Pillar not found' });
        return;
      }

      const target = doc.pillars[pillarIndex];
      if (icon !== undefined) target.icon = icon;
      if (title !== undefined) target.title = title.trim();
      if (subtitle !== undefined) target.subtitle = subtitle.trim();
      if (desc !== undefined) target.desc = desc.trim();
      if (perk !== undefined) target.perk = perk.trim();
      if (order !== undefined) target.order = Number(order) || target.order;
      if (isActive !== undefined) target.isActive = Boolean(isActive);

      doc.pillars[pillarIndex] = target;
      await doc.save();

      res.status(200).json({
        success: true,
        message: 'Lifestyle pillar updated successfully!',
        data: target,
        allPillars: doc.pillars
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/lifestyle/pillars/:id - Delete a pillar card
  async deletePillar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const doc = await LifestyleModel.findOne({ key: 'main_lifestyle' });
      if (!doc) {
        res.status(404).json({ success: false, message: 'Lifestyle section not found' });
        return;
      }

      const initialLen = doc.pillars.length;
      doc.pillars = doc.pillars.filter(p => p.id !== id);

      if (doc.pillars.length === initialLen) {
        res.status(404).json({ success: false, message: 'Pillar not found' });
        return;
      }

      await doc.save();

      res.status(200).json({
        success: true,
        message: 'Lifestyle pillar deleted successfully!',
        allPillars: doc.pillars
      });
    } catch (error) {
      next(error);
    }
  }
}

export const lifestyleController = new LifestyleController();

