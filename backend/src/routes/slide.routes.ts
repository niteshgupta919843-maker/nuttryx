import { Router } from 'express';
import { slideController } from '../controllers/slide.controller';
import { requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Public: Fetch active hero slides
router.get('/', (req, res, next) => slideController.getAll(req, res, next));
router.get('/:id', (req, res, next) => slideController.getById(req, res, next));

// Admin only: Add, edit, remove slides
router.post('/', requireAdmin, (req, res, next) => slideController.create(req, res, next));
router.put('/:id', requireAdmin, (req, res, next) => slideController.update(req, res, next));
router.delete('/:id', requireAdmin, (req, res, next) => slideController.delete(req, res, next));

export default router;

