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

  async googleLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { credential, code, email, name, picture } = req.body;
      const result = await authService.loginWithGoogle({
        credential,
        code,
        email,
        name,
        picture
      });

      res.status(200).json({
        success: true,
        message: `Welcome, ${result.user.name}!`,
        data: result.user,
        token: result.token
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Google sign-in failed'
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

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { identifier, newPassword } = req.body;
      if (!identifier || !newPassword) {
        res.status(400).json({
          success: false,
          message: 'Please provide registered email/mobile and your new password.'
        });
        return;
      }

      await authService.resetPassword(identifier, newPassword);
      res.status(200).json({
        success: true,
        message: 'Password reset successfully! Please sign in with your new password.'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to reset password.'
      });
    }
  }

  async sendResetOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { identifier, forAdmin } = req.body;
      if (!identifier || !identifier.trim()) {
        res.status(400).json({
          success: false,
          message: 'Please provide your registered email or mobile number.'
        });
        return;
      }

      const result = await authService.requestPasswordResetOtp(identifier, !!forAdmin);
      res.status(200).json({
        success: true,
        message: result.message,
        targetEmail: result.targetEmail,
        maskedEmail: result.maskedEmail,
        expiresInSeconds: result.expiresInSeconds,
        devOtp: result.devOtp
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to send OTP.'
      });
    }
  }

  async verifyResetOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { identifier, otp, forAdmin } = req.body;
      if (!identifier || !otp) {
        res.status(400).json({
          success: false,
          message: 'Please provide your email/mobile and the 6-digit OTP code.'
        });
        return;
      }

      const result = await authService.verifyPasswordResetOtp(identifier, otp, !!forAdmin);
      res.status(200).json({
        success: true,
        message: result.message,
        resetToken: result.resetToken
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'OTP verification failed.'
      });
    }
  }

  async resetPasswordWithOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { identifier, resetToken, newPassword, forAdmin } = req.body;
      if (!identifier || !resetToken || !newPassword) {
        res.status(400).json({
          success: false,
          message: 'Missing required parameters to complete password reset.'
        });
        return;
      }

      const result = await authService.completePasswordResetWithOtp({
        identifier,
        resetToken,
        newPassword,
        forAdmin: !!forAdmin
      });

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to reset password.'
      });
    }
  }

  async verifyAdminPasscode(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const usernameInput = (req.body.username || req.body.email || '').trim().toLowerCase();
      const passcode = req.body.passcode || req.body.password;
      const expectedPasscode = process.env.ADMIN_SECRET || 'Admin@2026N';
      const expectedAdminEmail = (process.env.ADMIN_EMAIL || 'niteshgupta919843@gmail.com').trim().toLowerCase();

      // Validate username / email if provided
      if (usernameInput && usernameInput !== expectedAdminEmail && usernameInput !== 'admin') {
        res.status(401).json({ success: false, message: 'Invalid Admin username or email.' });
        return;
      }

      if (!passcode || passcode !== expectedPasscode) {
        res.status(401).json({ success: false, message: 'Invalid Admin password.' });
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

