import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Public store catalog
router.get('/', (req, res, next) => productController.getAll(req, res, next));
router.get('/:id', (req, res, next) => productController.getById(req, res, next));

// Admin only: create, update, delete products
router.post('/', requireAdmin, (req, res, next) => productController.create(req, res, next));
router.put('/:id', requireAdmin, (req, res, next) => productController.update(req, res, next));
router.delete('/:id', requireAdmin, (req, res, next) => productController.delete(req, res, next));

export default router;
