import mongoose from 'mongoose';
import { ProductModel } from '../models/Product.model';
import { INITIAL_PRODUCTS } from '../data/products.data';
import { Product } from '../types';

export class ProductService {
  async seedIfEmpty(): Promise<void> {
    try {
      const count = await ProductModel.countDocuments();
      if (count === 0) {
        await ProductModel.insertMany(INITIAL_PRODUCTS);
        console.log('🥜 Seeded initial peanut butter products into MongoDB');
      }
    } catch (e) {
      console.warn('Could not seed products:', e);
    }
  }

  async getAllProducts(category?: string): Promise<Product[]> {
    try {
      const query: Record<string, any> = category && category !== 'all' ? { category } : {};
      const products = await ProductModel.find(query).lean();
      if (products && products.length > 0) return products as unknown as Product[];
    } catch (err) {
      console.warn('MongoDB query failed, using memory fallback', err);
    }
    // Fallback to initial data if DB not ready
    if (category && category !== 'all') {
      return INITIAL_PRODUCTS.filter((p) => p.category === category);
    }
    return INITIAL_PRODUCTS;
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      const query = mongoose.isValidObjectId(id)
        ? { $or: [{ id }, { _id: id }] }
        : { id };
      const product = await ProductModel.findOne(query).lean();
      if (product) return product as unknown as Product;
    } catch (err) {
      console.warn('MongoDB query failed, using memory fallback', err);
    }
    return INITIAL_PRODUCTS.find((p) => p.id === id) || null;
  }

  async createProduct(productData: Product): Promise<Product> {
    const created = await ProductModel.create(productData);
    return created.toObject() as unknown as Product;
  }

  async updateProduct(id: string, updateData: Partial<Product>): Promise<Product | null> {
    const query = mongoose.isValidObjectId(id)
      ? { $or: [{ id }, { _id: id }] }
      : { id };
    const updated = await ProductModel.findOneAndUpdate(
      query,
      { $set: { ...updateData, id } },
      { new: true, upsert: true }
    ).lean();
    return updated as unknown as Product | null;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const query = mongoose.isValidObjectId(id)
      ? { $or: [{ id }, { _id: id }] }
      : { id };
    const result = await ProductModel.deleteOne(query);
    return (result.deletedCount || 0) > 0;
  }
}

export const productService = new ProductService();
