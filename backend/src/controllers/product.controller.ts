import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/product.service';

export class ProductController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = req.query.category as string | undefined;
      const products = await productService.getAllProducts(category);
      res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=120');
      res.status(200).json({
        success: true,
        count: products.length,
        data: products
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);
      if (!product) {
        res.status(404).json({
          success: false,
          message: `Product with ID '${id}' not found`
        });
        return;
      }
      res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.createProduct(req.body);
      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await productService.updateProduct(id, req.body);
      if (!updated) {
        res.status(404).json({
          success: false,
          message: `Product with ID '${id}' not found`
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await productService.deleteProduct(id);
      res.status(200).json({
        success: deleted,
        message: deleted ? 'Product deleted' : 'Product not found'
      });
    } catch (error) {
      next(error);
    }
  }
}

export const productController = new ProductController();
