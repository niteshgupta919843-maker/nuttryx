import { Router } from 'express';
import { faqController } from '../controllers/faq.controller';

const router = Router();

router.get('/', (req, res) => faqController.getFaqs(req, res));
router.get('/admin', (req, res) => faqController.getAllAdminFaqs(req, res));
router.post('/', (req, res) => faqController.createFaq(req, res));
router.put('/:id', (req, res) => faqController.updateFaq(req, res));
router.delete('/:id', (req, res) => faqController.deleteFaq(req, res));

export default router;

