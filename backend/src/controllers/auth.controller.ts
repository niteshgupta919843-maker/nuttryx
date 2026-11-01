import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, phone, password, address, city, pincode } = req.body;
      if (!name || !email || !phone) {
        res.status(400).json({
          success: false,
          message: 'Please provide full name, email address, and phone number.'
        });
        return;
      }

      const result = await authService.register({
        name,
        email,
        phone,
        password,
        address,
        city,
        pincode
      });

      res.status(201).json({
        success: true,
        message: 'Account registered successfully!',
        data: result.user,
        token: result.token
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Registration failed'
      });
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { identifier, email, phone, password } = req.body;
      const targetIdentifier = identifier || email || phone;

      if (!targetIdentifier) {
        res.status(400).json({
          success: false,
          message: 'Please provide an email address or mobile number.'
        });
        return;
      }

      const result = await authService.login(targetIdentifier, password);

      res.status(200).json({
        success: true,
        message: `Welcome back, ${result.user.name}!`,
        data: result.user,
        token: result.token
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message || 'Authentication failed'
      });
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.query.userId || req.headers['x-user-id']) as string;
      if (!userId) {
        res.status(400).json({ success: false, message: 'Missing user identification' });
        return;
      }

      const user = await authService.getProfile(userId);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, userId, name, address, city, state, pincode } = req.body;
      const targetId = id || userId;
      if (!targetId) {
        res.status(400).json({ success: false, message: 'Missing user ID' });
        return;
      }

      const updated = await authService.updateProfile(targetId, {
        name,
        address,
        city,
        state,
        pincode
      });

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully!',
        data: updated
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getMyOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const email = (req.query.email || '') as string;
      const phone = (req.query.phone || '') as string;

      if (!email && !phone) {
        res.status(400).json({
          success: false,
          message: 'Please provide user email or phone to retrieve order history.'
        });
        return;
      }

      const orders = await authService.getUserOrders(email, phone);

      res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
      });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, currentPassword, newPassword } = req.body;
      if (!userId || !currentPassword || !newPassword) {
        res.status(400).json({ success: false, message: 'All fields are required.' });
        return;
      }

      await authService.changePassword(userId, currentPassword, newPassword);
      res.status(200).json({ success: true, message: 'Password updated successfully!' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || 'Password update failed.' });
    }
  }

  async verifyAdminPasscode(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { passcode } = req.body;
      const expectedPasscode = process.env.ADMIN_SECRET || 'Nuttryx@Admin2026';

      if (!passcode || passcode !== expectedPasscode) {
        res.status(401).json({ success: false, message: 'Invalid Admin passcode.' });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Admin access verified.',
        adminToken: expectedPasscode
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();

