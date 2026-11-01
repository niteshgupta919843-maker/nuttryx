import mongoose from 'mongoose';
import { ENV } from './env';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(ENV.MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`🌿 MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    // Don't crash server immediately, allow fallback/retry
  }
};

