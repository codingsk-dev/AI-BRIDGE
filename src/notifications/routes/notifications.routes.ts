import { Router } from 'express';
import { notificationController } from './controllers/notification.controller';
import { validateRequest } from '../../middleware/validation.middleware';
import { createNotificationSchema, updateNotificationSchema } from './validators/notification.validator';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Create notification
router.post(
  '/',
  validateRequest(createNotificationSchema),
  notificationController.create
);

// Get notification by ID
router.get(
  '/:id',
  notificationController.getById
);

// Get notifications by business ID
router.get(
  '/',
  notificationController.getByBusinessId
);

// Get unread notifications by business ID
router.get(
  '/unread',
  notificationController.getUnread
);

// Update notification
router.put(
  '/:id',
  validateRequest(updateNotificationSchema),
  notificationController.update
);

// Delete notification
router.delete(
  '/:id',
  notificationController.delete
);

// Mark notification as read
router.post(
  '/:id/read',
  notificationController.markAsRead
);

// Mark notification as unread
router.post(
  '/:id/unread',
  notificationController.markAsUnread
);

// Mark all notifications as read for business
router.post(
  '/read-all',
  notificationController.markAllAsRead
);

// Get notification count for business
router.get(
  '/count',
  notificationController.getCount
);

// Get unread notification count for business
router.get(
  '/unread/count',
  notificationController.getUnreadCount
);

export default router;