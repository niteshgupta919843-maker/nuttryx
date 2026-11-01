import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'https://nuttryx.vercel.app',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/nuttryx_db',
  JWT_SECRET: process.env.JWT_SECRET || 'nuttryx-super-secure-jwt-secret-key-prod-2026-v1',
  ADMIN_SECRET: process.env.ADMIN_SECRET || 'Nuttryx@Admin2026',
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || '',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || '',
  UPI_VPA: process.env.UPI_VPA || 'nuttryx@upi'
};
