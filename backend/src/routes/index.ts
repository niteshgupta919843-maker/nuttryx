import { Router } from 'express';
import productRoutes from './product.routes';
import orderRoutes from './order.routes';
import sampleRoutes from './sample.routes';
import slideRoutes from './slide.routes';
import authRoutes from './auth.routes';
import paymentRoutes from './payment.routes';
import tickerRoutes from './ticker.routes';
import settingsRoutes from './settings.routes';
import faqRoutes from './faq.routes';
import craftRoutes from './craft.routes';
import lifestyleRoutes from './lifestyle.routes';
import benefitRoutes from './benefit.routes';
import reviewRoutes from './review.routes';

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
router.use('/faqs', faqRoutes);
router.use('/craft', craftRoutes);
router.use('/lifestyle', lifestyleRoutes);
router.use('/benefit', benefitRoutes);
router.use('/reviews', reviewRoutes);

export default router;

