import { Router } from 'express';
import { authController } from '../controllers/auth.controller';

const router = Router();

router.post('/register', (req, res, next) => authController.register(req, res, next));
router.post('/login', (req, res, next) => authController.login(req, res, next));
router.get('/me', (req, res, next) => authController.getMe(req, res, next));
router.put('/profile', (req, res, next) => authController.updateProfile(req, res, next));
router.post('/change-password', (req, res, next) => authController.changePassword(req, res, next));
router.post('/admin-verify', (req, res, next) => authController.verifyAdminPasscode(req, res, next));
router.get('/orders', (req, res, next) => authController.getMyOrders(req, res, next));

export default router;

