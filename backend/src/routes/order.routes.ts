import { Router } from 'express';
import { orderController } from '../controllers/order.controller';
import { validateOrderInput } from '../validators/order.validator';
import { requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Public: Place an order
router.post('/', validateOrderInput, (req, res, next) => orderController.createOrder(req, res, next));

// Public: Track specific order
router.get('/track/:query', (req, res, next) => orderController.trackOrder(req, res, next));
router.get('/:id', (req, res, next) => orderController.trackOrder(req, res, next));

// Admin only: List all customer orders
router.get('/', requireAdmin, (req, res, next) => orderController.getAllOrders(req, res, next));

// Admin only: Update order shipment status
router.patch('/:id/status', requireAdmin, (req, res, next) => orderController.updateStatus(req, res, next));

export default router;
