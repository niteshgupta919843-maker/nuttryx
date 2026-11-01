import { Router } from 'express';
import { orderController } from '../controllers/order.controller';
import { validateSampleInput } from '../validators/order.validator';
import { requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Public: Submit a sample request
router.post('/', validateSampleInput, (req, res, next) => orderController.createSampleRequest(req, res, next));

// Admin only: List all sample claims
router.get('/', requireAdmin, (req, res, next) => orderController.getAllSampleRequests(req, res, next));

// Admin only: Update dispatch status of a sample claim
router.patch('/:id/status', requireAdmin, (req, res, next) => orderController.updateSampleStatus(req, res, next));

export default router;

