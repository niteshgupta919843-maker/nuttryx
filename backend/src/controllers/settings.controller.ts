import { Request, Response, NextFunction } from 'express';
import { settingsService } from '../services/settings.service';

export class SettingsController {
  async get(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await settingsService.getSettings();
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const payload = req.body;
      const data = await settingsService.updateSettings(payload);
      res.status(200).json({
        success: true,
        message: 'Store & factory settings updated successfully',
        data
      });
    } catch (error) {
      next(error);
    }
  }
}

export const settingsController = new SettingsController();

