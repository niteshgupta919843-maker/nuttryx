import { Request, Response, NextFunction } from 'express';
import { slideService } from '../services/slide.service';

export class SlideController {
  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slides = await slideService.getAllSlides();
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.status(200).json({
        success: true,
        count: slides.length,
        data: slides
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const slide = await slideService.getSlideById(id);
      if (!slide) {
        res.status(404).json({
          success: false,
          message: `Slide with ID '${id}' not found`
        });
        return;
      }
      res.status(200).json({
        success: true,
        data: slide
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slide = await slideService.createSlide(req.body);
      res.status(201).json({
        success: true,
        message: 'Hero slide created successfully',
        data: slide
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const slide = await slideService.updateSlide(id, req.body);
      if (!slide) {
        res.status(404).json({
          success: false,
          message: `Slide with ID '${id}' not found`
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: 'Hero slide updated successfully',
        data: slide
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await slideService.deleteSlide(id);
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: `Slide with ID '${id}' not found`
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: 'Hero slide deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

export const slideController = new SlideController();

