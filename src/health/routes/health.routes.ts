import { Router } from 'express';
import { healthController } from './controllers/health.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

// Health check endpoint (public - no authentication required)
router.get(
  '/',
  healthController.check
);

// Health check history (requires authentication)
router.get(
  '/history',
  authenticate,
  healthController.history
);

// Latest health check (requires authentication)
router.get(
  '/latest',
  authenticate,
  healthController.latest
);

export default router;