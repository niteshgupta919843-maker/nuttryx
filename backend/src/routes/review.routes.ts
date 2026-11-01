import { Router } from 'express';
import { reviewController } from '../controllers/review.controller';

const router = Router();

// Public & Admin: Get reviews
router.get('/', reviewController.getReviews.bind(reviewController));

// Public & Admin: Create a new review
router.post('/', reviewController.createReview.bind(reviewController));

// Admin: Update review (edit or toggle visibility)
router.put('/:id', reviewController.updateReview.bind(reviewController));

// Admin: Delete review
router.delete('/:id', reviewController.deleteReview.bind(reviewController));

export default router;

