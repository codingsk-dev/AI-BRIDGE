import { Router } from 'express';
import { analyticsController } from '../controllers/analytics.controller';

const router = Router();

router.get('/', analyticsController.getAll || ((req, res) => res.json({})));

export default router;
