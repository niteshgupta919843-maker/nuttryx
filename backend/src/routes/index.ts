import { Router } from 'express';
import productRoutes from './product.routes';
import orderRoutes from './order.routes';
import sampleRoutes from './sample.routes';
import slideRoutes from './slide.routes';
import authRoutes from './auth.routes';
import paymentRoutes from './payment.routes';
import tickerRoutes from './ticker.routes';
import settingsRoutes from './settings.routes';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'nuttryx-backend-api',
    timestamp: new Date().toISOString()
  });
});

router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/samples', sampleRoutes);
router.use('/slides', slideRoutes);
router.use('/auth', authRoutes);
router.use('/payment', paymentRoutes);
router.use('/ticker', tickerRoutes);
router.use('/settings', settingsRoutes);

export default router;

