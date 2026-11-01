import { Router } from 'express';
import { benefitController } from '../controllers/benefit.controller';

const router = Router();

// Public & Admin: Get benefit comparison section
router.get('/', benefitController.getBenefits.bind(benefitController));

// Update header, footer, or entire benefit document
router.put('/', benefitController.updateBenefitSection.bind(benefitController));

// Row CRUD operations
router.post('/rows', benefitController.addRow.bind(benefitController));
router.put('/rows/:id', benefitController.updateRow.bind(benefitController));
router.delete('/rows/:id', benefitController.deleteRow.bind(benefitController));

export default router;

