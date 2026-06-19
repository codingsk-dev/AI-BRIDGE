import { Router } from 'express';
import { businessSettingsController } from '../controllers/business-settings.controller';

const router = Router();

router.get('/', businessSettingsController.getAll || ((req, res) => res.json({})));

export default router;
