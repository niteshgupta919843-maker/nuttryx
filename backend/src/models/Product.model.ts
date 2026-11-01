import mongoose, { Schema, Document } from 'mongoose';
import { Product } from '../types';

export interface IProductDocument extends Omit<Product, 'id'>, Document {
  id: string;
}

const ProductSchema = new Schema<IProductDocument>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    badge: { type: String, default: '' },
    rating: { type: Number, default: 4.8 },
    reviewsCount: { type: Number, default: 100 },
    category: { type: String, enum: ['all', 'protein', 'chocolate', 'combos'], default: 'protein' },
    sizes: [
      {
        weight: { type: String, required: true },
        price: { type: Number, required: true },
        originalPrice: { type: Number, required: true },
        inStock: { type: Boolean, default: true }
      }
    ],
    nutrition: {
      proteinPer100g: { type: String, default: '30g' },
      proteinPerServing: { type: String, default: '10g' },
      caloriesPerServing: { type: String, default: '190 kcal' },
      dietaryFibre: { type: String, default: '7g' },
      sugarAdded: { type: String, default: '0g' }
    },
    ingredients: { type: String, default: '' },
    features: [{ type: String }]
  },
  { timestamps: true }
);

ProductSchema.index({ category: 1 });
ProductSchema.index({ createdAt: -1 });

export const ProductModel = mongoose.model<IProductDocument>('Product', ProductSchema);
