import { Router } from 'express';
import { widgetController } from './controllers/widget.controller';
import { validateRequest } from '../../middleware/validation.middleware';
import { createWidgetSchema, updateWidgetSchema } from './validators/widget.validator';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get widget for business
router.get(
  '/',
  widgetController.getByBusinessId
);

// Create widget for business
router.post(
  '/',
  validateRequest(createWidgetSchema),
  widgetController.create
);

// Update widget
router.put(
  '/',
  validateRequest(updateWidgetSchema),
  widgetController.update
);

// Delete widget
router.delete(
  '/',
  widgetController.delete
);

export default router;