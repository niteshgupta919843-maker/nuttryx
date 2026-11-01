import { Router } from 'express';
import { lifestyleController } from '../controllers/lifestyle.controller';

const router = Router();

// Public & Admin: Get lifestyle section
router.get('/', lifestyleController.getLifestyle.bind(lifestyleController));

// Update header or whole lifestyle document
router.put('/', lifestyleController.updateLifestyle.bind(lifestyleController));

// Pillar CRUD operations
router.post('/pillars', lifestyleController.addPillar.bind(lifestyleController));
router.put('/pillars/:id', lifestyleController.updatePillar.bind(lifestyleController));
router.delete('/pillars/:id', lifestyleController.deletePillar.bind(lifestyleController));

export default router;

