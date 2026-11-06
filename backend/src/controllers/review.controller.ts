import { Request, Response, NextFunction } from 'express';
import { ReviewModel, IReview } from '../models/review.model';
import { INITIAL_50_REVIEWS } from '../data/initialReviews';

export class ReviewController {
  // GET /api/reviews - Get reviews (public & admin)
  async getReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let reviews = await ReviewModel.find().sort({ order: 1, createdAt: -1 });

      if (reviews.length === 0) {
        // Initial seed only if collection is completely empty
        for (const rev of INITIAL_50_REVIEWS) {
          await ReviewModel.updateOne({ id: rev.id }, { $setOnInsert: rev }, { upsert: true });
        }
        reviews = await ReviewModel.find().sort({ order: 1, createdAt: -1 });
      }

      // If called by storefront (no admin header/query), filter active ones
      const isAdmin = req.query.admin === 'true' || req.headers['x-admin-secret'];
      const data = isAdmin ? reviews : reviews.filter((r) => r.isActive !== false);

      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      res.status(200).json({
        success: true,
        count: data.length,
        data
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/reviews - Create a review (from website or admin)
  async createReview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, role, rating, comment, flavour } = req.body;

      if (!name || !comment) {
        res.status(400).json({
          success: false,
          message: 'Name and comment are required fields'
        });
        return;
      }

      const totalCount = await ReviewModel.countDocuments();
      const id = `rev-${Date.now()}`;

      const newReview = await ReviewModel.create({
        id,
        name: String(name).trim(),
        role: role ? String(role).trim() : 'Verified Buyer',
        rating: Number(rating) ? Math.min(5, Math.max(1, Number(rating))) : 5,
        date: 'Verified Buyer • Just now',
        comment: String(comment).trim(),
        flavour: flavour ? String(flavour).trim() : 'Dark Chocolate Peanut Butter',
        isVerified: true,
        isActive: true,
        order: totalCount + 1
      });

      res.status(201).json({
        success: true,
        message: 'Review submitted successfully',
        data: newReview
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/reviews/:id - Update review (edit details or toggle active status)
  async updateReview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { name, role, rating, comment, flavour, isActive, isVerified, order } = req.body;

      const review = await ReviewModel.findOne({ id });
      if (!review) {
        res.status(404).json({ success: false, message: `Review '${id}' not found` });
        return;
      }

      if (name !== undefined) review.name = String(name).trim();
      if (role !== undefined) review.role = String(role).trim();
      if (rating !== undefined) review.rating = Math.min(5, Math.max(1, Number(rating)));
      if (comment !== undefined) review.comment = String(comment).trim();
      if (flavour !== undefined) review.flavour = String(flavour).trim();
      if (isActive !== undefined) review.isActive = Boolean(isActive);
      if (isVerified !== undefined) review.isVerified = Boolean(isVerified);
      if (order !== undefined) review.order = Number(order);

      await review.save();

      res.status(200).json({
        success: true,
        message: 'Review updated successfully',
        data: review
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/reviews/:id - Delete review
  async deleteReview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = await ReviewModel.deleteOne({ id });

      if (result.deletedCount === 0) {
        res.status(404).json({ success: false, message: `Review '${id}' not found` });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Review deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

export const reviewController = new ReviewController();

