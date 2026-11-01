import mongoose, { Schema, Document } from 'mongoose';

export interface IUserDocument extends Document {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  role: 'customer' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    pincode: { type: String, default: '' },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' }
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);

