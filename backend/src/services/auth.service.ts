import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel, IUserDocument } from '../models/User.model';
import { OrderModel } from '../models/Order.model';

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
      { returnDocument: 'after' }
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
}

export const authService = new AuthService();

