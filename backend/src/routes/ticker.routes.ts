import { Router } from 'express';
import { tickerController } from '../controllers/ticker.controller';
import { requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.get('/', (req, res, next) => tickerController.get(req, res, next));
router.put('/', requireAdmin, (req, res, next) => tickerController.update(req, res, next));

export default router;

