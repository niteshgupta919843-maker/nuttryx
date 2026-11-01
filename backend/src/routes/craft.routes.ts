import { Router } from 'express';
import { craftController } from '../controllers/craft.controller';

const router = Router();

// Public & Admin: Get craft story section
router.get('/', craftController.getCraft.bind(craftController));

// Update header or whole craft story
router.put('/', craftController.updateCraft.bind(craftController));

// Step CRUD operations
router.post('/steps', craftController.addStep.bind(craftController));
router.put('/steps/:id', craftController.updateStep.bind(craftController));
router.delete('/steps/:id', craftController.deleteStep.bind(craftController));

export default router;

