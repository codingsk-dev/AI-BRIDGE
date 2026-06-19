import { z } from 'zod';

// Notification creation schema
export const createNotificationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
  type: z.enum([
    'SYSTEM',
    'BUSINESS_UPDATE',
    'AI_READINESS_REPORT',
    'CHAT_RATING_REQUEST',
    'SUBSCRIPTION_EXPIRING'
  ]),
  isRead: z.boolean().default(false)
});

// Notification update schema (for marking as read/unread)
export const updateNotificationSchema = z.object({
  isRead: z.boolean()
});

// Export schemas
export const notificationValidators = {
  create: createNotificationSchema,
  update: updateNotificationSchema
};