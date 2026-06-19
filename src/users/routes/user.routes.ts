import { Router } from 'express';
import { userController } from './controllers/user.controller';
import { validateRequest } from '../../middleware/validation.middleware';
import { updateUserSchema } from './validators/user.validator';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorization.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get user by ID
router.get(
  '/:id',
  userController.getById
);

// Get users (admin only)
router.get(
  '/',
  authorize(['ADMIN']),
  userController.getAll
);

// Update user
router.put(
  '/:id',
  validateRequest(updateUserSchema),
  userController.update
);

// Delete user (admin only)
router.delete(
  '/:id',
  authorize(['ADMIN']),
  userController.delete
);

// Verify user (admin only)
router.patch(
  '/:id/verify',
  authorize(['ADMIN']),
  userController.verify
);

// Update user password
router.patch(
  '/:id/password',
  userController.updatePassword
);

// Get user count (admin only)
router.get(
  '/count',
  authorize(['ADMIN']),
  userController.getCount
);

export default router;