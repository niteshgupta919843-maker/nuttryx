import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller';

const router = Router();

// Public: Get payment gateway configuration (Key ID, UPI VPA)
router.get('/config', (req, res) => paymentController.getConfig(req, res));

// Public: Create a Razorpay / UPI order token
router.post('/create-order', (req, res, next) => paymentController.createOrder(req, res, next));

// Public: Verify payment signature
router.post('/verify', (req, res, next) => paymentController.verifyPayment(req, res, next));

export default router;

