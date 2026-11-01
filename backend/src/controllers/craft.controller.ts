import { Request, Response, NextFunction } from 'express';
import { CraftModel, ICraftStep } from '../models/craft.model';

const DEFAULT_STEPS: ICraftStep[] = [
  {
    id: 'step-1',
    num: '01',
    title: 'Ethical Sourcing',
    subtitle: 'Saurashtra, Gujarat',
    icon: 'Sparkles',
    desc: 'We procure only export-grade bold peanuts directly from certified Saurashtra farmers. Every single lot undergoes 14-parameter aflatoxin and purity screening.',
    order: 1,
    isActive: true
  },
  {
    id: 'step-2',
    num: '02',
    title: 'Slow Hot-Air Roasting',
    subtitle: 'Uniform Golden Crunch',
    icon: 'Flame',
    desc: 'Unlike mass-market factories that burn peanuts in 3 minutes, we gently hot-air roast in micro-batches for 22 minutes to unlock rich natural nutty aromatics.',
    order: 2,
    isActive: true
  },
  {
    id: 'step-3',
    num: '03',
    title: 'Granite Stone Grinding',
    subtitle: 'Zero Heat Shear',
    icon: 'Cpu',
    desc: 'Our stone mills gently crush the roasted kernels without overheating the natural oils, preserving 100% of the active antioxidants and plant protein.',
    order: 3,
    isActive: true
  },
  {
    id: 'step-4',
    num: '04',
    title: 'Fresh Clean Jarring',
    subtitle: 'Zero Palm Oil',
    icon: 'PackageCheck',
    desc: 'Immediately jarred and foil-induction sealed to lock in farm-fresh aroma. Dispatched directly to your doorstep with guaranteed freshness.',
    order: 4,
    isActive: true
  }
];

export class CraftController {
  // GET /api/craft - Returns the craft story config and steps (auto-seeds if missing)
  async getCraft(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let craft = await CraftModel.findOne({ key: 'main_craft_story' });

      if (!craft) {
        craft = await CraftModel.create({
          key: 'main_craft_story',
          badge: 'The Pure Craft',
          heading: 'From Gujarat Soil to Your Spoon',
          description: 'No chemical emulsifiers, no hydrogenated palm oils, no shortcuts. Just honest Indian peanuts transformed into pure nutrition.',
          steps: DEFAULT_STEPS,
          isActive: true
        });
      } else if (!craft.steps || craft.steps.length === 0) {
        craft.steps = DEFAULT_STEPS;
        await craft.save();
      }

      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      res.status(200).json({
        success: true,
        data: craft
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/craft - Update section heading, badge, description or full steps
  async updateCraft(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { badge, heading, description, steps, isActive } = req.body;

      let craft = await CraftModel.findOne({ key: 'main_craft_story' });
      if (!craft) {
        craft = new CraftModel({ key: 'main_craft_story', steps: DEFAULT_STEPS });
      }

      if (badge !== undefined) craft.badge = badge.trim();
      if (heading !== undefined) craft.heading = heading.trim();
      if (description !== undefined) craft.description = description.trim();
      if (isActive !== undefined) craft.isActive = Boolean(isActive);
      if (Array.isArray(steps)) craft.steps = steps;

      await craft.save();

      res.status(200).json({
        success: true,
        message: 'Craft process story updated successfully!',
        data: craft
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/craft/steps - Add a new step
  async addStep(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { num, title, subtitle, icon, desc, order } = req.body;

      if (!title || !desc) {
        res.status(400).json({
          success: false,
          message: 'Step title and description are required'
        });
        return;
      }

      let craft = await CraftModel.findOne({ key: 'main_craft_story' });
      if (!craft) {
        craft = new CraftModel({ key: 'main_craft_story', steps: DEFAULT_STEPS });
      }

      const stepId = `step-${Date.now()}`;
      const newStep: ICraftStep = {
        id: stepId,
        num: num || `0${craft.steps.length + 1}`,
        title: title.trim(),
        subtitle: (subtitle || 'Pure Nut Nutrition').trim(),
        icon: icon || 'Sparkles',
        desc: desc.trim(),
        order: Number(order) || craft.steps.length + 1,
        isActive: true
      };

      craft.steps.push(newStep);
      await craft.save();

      res.status(201).json({
        success: true,
        message: 'Craft step added successfully!',
        data: newStep,
        allSteps: craft.steps
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/craft/steps/:id - Update an existing step
  async updateStep(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { num, title, subtitle, icon, desc, order, isActive } = req.body;

      const craft = await CraftModel.findOne({ key: 'main_craft_story' });
      if (!craft) {
        res.status(404).json({ success: false, message: 'Craft story not found' });
        return;
      }

      const stepIndex = craft.steps.findIndex(s => s.id === id);
      if (stepIndex === -1) {
        res.status(404).json({ success: false, message: 'Step not found' });
        return;
      }

      const target = craft.steps[stepIndex];
      if (num !== undefined) target.num = num;
      if (title !== undefined) target.title = title.trim();
      if (subtitle !== undefined) target.subtitle = subtitle.trim();
      if (icon !== undefined) target.icon = icon;
      if (desc !== undefined) target.desc = desc.trim();
      if (order !== undefined) target.order = Number(order) || target.order;
      if (isActive !== undefined) target.isActive = Boolean(isActive);

      craft.steps[stepIndex] = target;
      await craft.save();

      res.status(200).json({
        success: true,
        message: 'Craft step updated successfully!',
        data: target,
        allSteps: craft.steps
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/craft/steps/:id - Delete a step
  async deleteStep(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const craft = await CraftModel.findOne({ key: 'main_craft_story' });
      if (!craft) {
        res.status(404).json({ success: false, message: 'Craft story not found' });
        return;
      }

      const initialLen = craft.steps.length;
      craft.steps = craft.steps.filter(s => s.id !== id);

      if (craft.steps.length === initialLen) {
        res.status(404).json({ success: false, message: 'Step not found' });
        return;
      }

      await craft.save();

      res.status(200).json({
        success: true,
        message: 'Craft step deleted successfully!',
        allSteps: craft.steps
      });
    } catch (error) {
      next(error);
    }
  }
}

export const craftController = new CraftController();

