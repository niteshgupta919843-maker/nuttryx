import { Request, Response, NextFunction } from 'express';
import { tickerService } from '../services/ticker.service';

export class TickerController {
  async get(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await tickerService.getTicker();
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.status(200).json({
        success: true,
        data: data.items,
        speed: data.speed,
        isActive: data.isActive
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { items, speed, isActive } = req.body;
      if (!Array.isArray(items)) {
        res.status(400).json({
          success: false,
          message: 'Items must be an array of strings'
        });
        return;
      }
      const data = await tickerService.updateTicker(items, speed, isActive);
      res.status(200).json({
        success: true,
        message: 'Ticker marquee updated successfully',
        data: data.items,
        speed: data.speed,
        isActive: data.isActive
      });
    } catch (error) {
      next(error);
    }
  }
}

export const tickerController = new TickerController();

