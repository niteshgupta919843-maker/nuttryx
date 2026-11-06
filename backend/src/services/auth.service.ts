import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { UserModel, IUserDocument } from '../models/User.model';
import { OrderModel } from '../models/Order.model';
import { emailService } from './email.service';

const JWT_SECRET = process.env.JWT_SECRET || 'nuttryx-secret-jwt-token-key-2026';

export interface AuthUserResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  role: 'customer' | 'admin';
  createdAt?: string;
}

interface ResetOtpRecord {
  identifier: string;
  targetEmail: string;
  recipientName: string;
  otp: string;
  expiresAt: number;
  attempts: number;
  verified: boolean;
  isAdmin: boolean;
  resetToken?: string;
  tokenExpiresAt?: number;
}

function maskEmailAddress(email: string): string {
  const parts = email.split('@');
  if (parts.length !== 2) return email;
  const name = parts[0];
  const domain = parts[1];
  if (name.length <= 2) return `${name[0]}*@${domain}`;
  return `${name[0]}***${name[name.length - 1]}@${domain}`;
}

export class AuthService {
  private formatUser(doc: IUserDocument): AuthUserResponse {
    return {
      id: doc.id,
      name: doc.name,
      email: doc.email,
      phone: doc.phone,
      address: doc.address || '',
      city: doc.city || '',
      state: doc.state || '',
      pincode: doc.pincode || '',
      role: doc.role,
      createdAt: doc.createdAt ? doc.createdAt.toISOString() : new Date().toISOString()
    };
  }

  private generateToken(user: AuthUserResponse): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );
  }

  async register(data: {
    name: string;
    email: string;
    phone: string;
    password?: string;
    address?: string;
    city?: string;
    pincode?: string;
  }): Promise<{ user: AuthUserResponse; token: string }> {
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanPhone = data.phone.trim().replace(/\D/g, '');

    // Check existing
    const existing = await UserModel.findOne({
      $or: [{ email: cleanEmail }, { phone: cleanPhone }]
    });

    if (existing) {
      if (existing.email === cleanEmail) {
        throw new Error('An account with this email address already exists. Please Sign In.');
      }
      if (existing.phone === cleanPhone) {
        throw new Error('An account with this phone number already exists. Please Sign In.');
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password || 'Nuttryx@123', salt);

    const newUser = await UserModel.create({
      id: `USR-${Date.now().toString().slice(-6)}`,
      name: data.name.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      password: hashedPassword,
      address: data.address || '',
      city: data.city || '',
      pincode: data.pincode || '',
      role: 'customer'
    });

    const userProfile = this.formatUser(newUser);
    const token = this.generateToken(userProfile);

    return { user: userProfile, token };
  }

  async login(identifier: string, password?: string): Promise<{ user: AuthUserResponse; token: string }> {
    const clean = identifier.trim().toLowerCase();
    const cleanDigits = identifier.trim().replace(/\D/g, '');

    // Search by email or phone
    const userDoc = await UserModel.findOne({
      $or: [
        { email: clean },
        { phone: clean },
        { phone: cleanDigits }
      ]
    });

    if (!userDoc) {
      throw new Error('No account found with this email or phone number. Please create an account.');
    }

    if (password && userDoc.password) {
      const isMatch = await bcrypt.compare(password, userDoc.password);
      if (!isMatch) {
        throw new Error('Incorrect password. Please try again or reset your password.');
      }
    }

    const userProfile = this.formatUser(userDoc);
    const token = this.generateToken(userProfile);

    return { user: userProfile, token };
  }

  async loginWithGoogle(data: {
    code?: string;
    credential?: string;
    email?: string;
    name?: string;
    picture?: string;
  }): Promise<{ user: AuthUserResponse; token: string }> {
    let email = (data.email || '').trim().toLowerCase();
    let name = (data.name || '').trim();

    // If OAuth code is provided, exchange it with Google OAuth2 API
    if (data.code) {
      try {
        const clientId = process.env.GOOGLE_CLIENT_ID || '';
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
        const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${clientUrl}/auth/google-callback`;

        if (clientId && clientSecret) {
          const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              code: data.code,
              client_id: clientId,
              client_secret: clientSecret,
              redirect_uri: redirectUri,
              grant_type: 'authorization_code'
            })
          });

          const tokenData = await tokenRes.json();
          if (tokenData.access_token) {
            const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${tokenData.access_token}` }
            });
            const userData = await userRes.json();
            if (userData.email) {
              email = userData.email.trim().toLowerCase();
              name = userData.name || email.split('@')[0];
            }
          }
        }
      } catch (err) {
        console.error('Google token exchange error:', err);
      }
    }

    // If ID token / credential is provided, decode payload
    if (data.credential && !email) {
      try {
        const parts = data.credential.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
          if (payload.email) {
            email = payload.email.trim().toLowerCase();
            name = payload.name || email.split('@')[0];
          }
        }
      } catch (err) {
        console.error('Failed to parse Google credential token:', err);
      }
    }

    if (!email) {
      throw new Error('Could not retrieve email from Google Account. Please try again.');
    }

    // Find or create user
    let userDoc = await UserModel.findOne({ email });

    if (!userDoc) {
      userDoc = await UserModel.create({
        id: `USR-${Date.now().toString().slice(-6)}`,
        name: name || 'Google User',
        email,
        phone: '',
        password: '',
        role: 'customer'
      });
      console.log(`✅ New user registered via Google: ${email} (${name})`);
    } else {
      console.log(`✅ Existing user signed in via Google: ${email}`);
    }

    const userProfile = this.formatUser(userDoc);
    const token = this.generateToken(userProfile);

    return { user: userProfile, token };
  }

  async getProfile(userId: string): Promise<AuthUserResponse | null> {
    const userDoc = await UserModel.findOne({ id: userId });
    if (!userDoc) return null;
    return this.formatUser(userDoc);
  }

  async updateProfile(userId: string, data: Partial<AuthUserResponse>): Promise<AuthUserResponse | null> {
    const updated = await UserModel.findOneAndUpdate(
      { id: userId },
      {
        $set: {
          ...(data.name && { name: data.name.trim() }),
          ...(data.address !== undefined && { address: data.address.trim() }),
          ...(data.city !== undefined && { city: data.city.trim() }),
          ...(data.state !== undefined && { state: data.state.trim() }),
          ...(data.pincode !== undefined && { pincode: data.pincode.trim() })
        }
      },
      { new: true }
    );

    if (!updated) return null;
    return this.formatUser(updated);
  }

  async changePassword(userId: string, currentPass: string, newPass: string): Promise<boolean> {
    const userDoc = await UserModel.findOne({ id: userId });
    if (!userDoc) throw new Error('User account not found.');
    if (!newPass || newPass.length < 6) {
      throw new Error('New password must be at least 6 characters long.');
    }
    if (!userDoc.password) {
      throw new Error('No password set for this account.');
    }
    
    const isMatch = await bcrypt.compare(currentPass, userDoc.password);
    if (!isMatch) {
      throw new Error('Current password is incorrect.');
    }

    const salt = await bcrypt.genSalt(10);
    userDoc.password = await bcrypt.hash(newPass, salt);
    await userDoc.save();
    return true;
  }

  async resetPassword(identifier: string, newPass: string): Promise<boolean> {
    const clean = identifier.trim().toLowerCase();
    const cleanDigits = identifier.trim().replace(/\D/g, '');

    const userDoc = await UserModel.findOne({
      $or: [
        { email: clean },
        { phone: clean },
        { phone: cleanDigits }
      ]
    });

    if (!userDoc) {
      throw new Error('No account found with this email or mobile number.');
    }

    if (!newPass || newPass.length < 6) {
      throw new Error('New password must be at least 6 characters long.');
    }

    const salt = await bcrypt.genSalt(10);
    userDoc.password = await bcrypt.hash(newPass, salt);
    await userDoc.save();
    return true;
  }

  async getUserOrders(email?: string, phone?: string): Promise<any[]> {
    const conditions: any[] = [];
    if (email && email.trim()) {
      conditions.push({ 'customer.email': new RegExp(`^${email.trim()}$`, 'i') });
    }
    if (phone && phone.trim()) {
      const digits = phone.trim().replace(/\D/g, '');
      conditions.push({ 'customer.phone': phone.trim() });
      if (digits) conditions.push({ 'customer.phone': digits });
    }

    if (conditions.length === 0) return [];

    const orders = await OrderModel.find({ $or: conditions }).sort({ createdAt: -1 }).lean();
    return orders;
  }

  private otpStore = new Map<string, ResetOtpRecord>();

  async requestPasswordResetOtp(identifier: string, forAdmin: boolean = false): Promise<{
    success: boolean;
    message: string;
    targetEmail: string;
    maskedEmail: string;
    expiresInSeconds: number;
    devOtp?: string;
  }> {
    const raw = identifier.trim().toLowerCase();
    const cleanDigits = identifier.trim().replace(/\D/g, '');

    const expectedAdminEmail = (process.env.ADMIN_EMAIL || 'niteshgupta919843@gmail.com').trim().toLowerCase();
    const isAdminTarget = forAdmin || raw === 'admin' || raw === expectedAdminEmail;

    let targetEmail = '';
    let recipientName = 'Customer';
    let isAdmin = false;

    if (isAdminTarget) {
      isAdmin = true;
      targetEmail = expectedAdminEmail;
      recipientName = 'Nuttryx Admin';
    } else {
      const userDoc = await UserModel.findOne({
        $or: [
          { email: raw },
          { phone: raw },
          { phone: cleanDigits }
        ]
      });

      if (!userDoc) {
        throw new Error('No registered account found with this email or mobile number.');
      }

      targetEmail = userDoc.email;
      recipientName = userDoc.name || 'Customer';
    }

    if (!targetEmail || !targetEmail.includes('@')) {
      throw new Error('No valid registered email address found for this account.');
    }

    // Generate random 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const key = (isAdmin ? 'admin:' : 'user:') + (isAdmin ? expectedAdminEmail : raw);

    const record: ResetOtpRecord = {
      identifier: raw,
      targetEmail,
      recipientName,
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      attempts: 0,
      verified: false,
      isAdmin
    };

    this.otpStore.set(key, record);

    // Send real email via Gmail SMTP
    await emailService.sendPasswordResetOtpEmail(targetEmail, otp, recipientName);

    const maskedEmail = maskEmailAddress(targetEmail);

    return {
      success: true,
      message: `A 6-digit OTP has been sent to ${maskedEmail}`,
      targetEmail,
      maskedEmail,
      expiresInSeconds: 600,
      devOtp: process.env.NODE_ENV !== 'production' ? otp : undefined
    };
  }

  async verifyPasswordResetOtp(identifier: string, otp: string, forAdmin: boolean = false): Promise<{
    success: boolean;
    message: string;
    resetToken: string;
  }> {
    const raw = identifier.trim().toLowerCase();
    const expectedAdminEmail = (process.env.ADMIN_EMAIL || 'niteshgupta919843@gmail.com').trim().toLowerCase();
    const isAdminTarget = forAdmin || raw === 'admin' || raw === expectedAdminEmail;

    const key = (isAdminTarget ? 'admin:' : 'user:') + (isAdminTarget ? expectedAdminEmail : raw);
    const record = this.otpStore.get(key);

    if (!record) {
      throw new Error('OTP has expired or has not been requested yet. Please request a new OTP.');
    }

    if (Date.now() > record.expiresAt) {
      this.otpStore.delete(key);
      throw new Error('OTP has expired. Please request a new one.');
    }

    if (record.attempts >= 5) {
      this.otpStore.delete(key);
      throw new Error('Too many incorrect attempts. Please request a new OTP.');
    }

    if (record.otp !== otp.trim()) {
      record.attempts += 1;
      const remaining = 5 - record.attempts;
      throw new Error(`Invalid OTP code. (${remaining} attempts remaining)`);
    }

    // Validated
    record.verified = true;
    record.resetToken = crypto.randomUUID();
    record.tokenExpiresAt = Date.now() + 15 * 60 * 1000; // 15 mins for setting password

    return {
      success: true,
      message: 'OTP verified successfully.',
      resetToken: record.resetToken
    };
  }

  async completePasswordResetWithOtp(data: {
    identifier: string;
    resetToken: string;
    newPassword: string;
    forAdmin?: boolean;
  }): Promise<{ success: boolean; message: string }> {
    const { identifier, resetToken, newPassword, forAdmin } = data;
    const raw = identifier.trim().toLowerCase();
    const expectedAdminEmail = (process.env.ADMIN_EMAIL || 'niteshgupta919843@gmail.com').trim().toLowerCase();
    const isAdminTarget = forAdmin || raw === 'admin' || raw === expectedAdminEmail;

    const key = (isAdminTarget ? 'admin:' : 'user:') + (isAdminTarget ? expectedAdminEmail : raw);
    const record = this.otpStore.get(key);

    if (!record || !record.verified || record.resetToken !== resetToken) {
      throw new Error('Invalid or expired password reset session. Please start again.');
    }

    if (record.tokenExpiresAt && Date.now() > record.tokenExpiresAt) {
      this.otpStore.delete(key);
      throw new Error('Password reset session expired. Please start again.');
    }

    // Password validation rules
    if (!newPassword || newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }
    if (!/[A-Za-z]/.test(newPassword)) {
      throw new Error('Password must contain at least one letter (A-Z).');
    }
    if (!/[0-9]/.test(newPassword)) {
      throw new Error('Password must contain at least one number (0-9).');
    }

    if (record.isAdmin) {
      // Update process.env and backend/.env file
      process.env.ADMIN_SECRET = newPassword;
      try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
          let envContent = fs.readFileSync(envPath, 'utf8');
          if (envContent.includes('ADMIN_SECRET=')) {
            envContent = envContent.replace(/ADMIN_SECRET=.*/g, `ADMIN_SECRET=${newPassword}`);
          } else {
            envContent += `\nADMIN_SECRET=${newPassword}\n`;
          }
          fs.writeFileSync(envPath, envContent, 'utf8');
          console.log('✅ Admin secret updated successfully in backend/.env');
        }
      } catch (err) {
        console.warn('⚠️ Could not persist new ADMIN_SECRET to .env file:', err);
      }

      this.otpStore.delete(key);
      return {
        success: true,
        message: 'Admin password reset successfully! Please sign in with your new password.'
      };
    } else {
      // Update customer password
      const cleanDigits = raw.replace(/\D/g, '');
      const userDoc = await UserModel.findOne({
        $or: [
          { email: raw },
          { phone: raw },
          { phone: cleanDigits }
        ]
      });

      if (!userDoc) {
        throw new Error('User account not found.');
      }

      const salt = await bcrypt.genSalt(10);
      userDoc.password = await bcrypt.hash(newPassword, salt);
      await userDoc.save();

      this.otpStore.delete(key);
      return {
        success: true,
        message: 'Password reset successfully! Please sign in with your new password.'
      };
    }
  }
}

export const authService = new AuthService();

