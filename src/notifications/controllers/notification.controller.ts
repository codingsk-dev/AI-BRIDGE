import { Request, Response, NextFunction } from 'express';
import { createNotificationSchema, updateNotificationSchema } from '../validators/notification.validator';
import { notificationService } from './services/notification.service';
import { logger } from '../../utils/logger';
import { authenticate } from '../../middleware/auth.middleware';

// Notification controller
export class NotificationController {
  async create(...args: any[]) { return null as any; }
  async getById(...args: any[]) { return null as any; }
  async getByBusinessId(...args: any[]) { return null as any; }
  async getUnread(...args: any[]) { return null as any; }
  async update(...args: any[]) { return null as any; }
  async delete(...args: any[]) { return null as any; }
  async markAsRead(...args: any[]) { return null as any; }
  async markAsUnread(...args: any[]) { return null as any; }
  async markAllAsRead(...args: any[]) { return null as any; }
  async getCount(...args: any[]) { return null as any; }
  async getUnreadCount(...args: any[]) { return null as any; }

  // Create notification
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate input
      const validatedData = createNotificationSchema.parse(req.body);

      // Get user ID from authenticated request
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Get business for user
      const business = await req.context.businessRepository.findByUserId(userId);
      if (!business) {
        return res.status(404).json({ error: 'Business not found' });
      }

      // Create notification
      const notification = await notificationService.createNotification(business.id, validatedData);

      return res.status(201).json({
        message: 'Notification created successfully',
        notification
      });
    } catch (error) {
      next(error);
    }
  }

  // Get notification by ID
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Get notification
      const notification = await notificationService.getNotificationById(id);

      // Optional: Check if user owns the notification's business
      // const userId = req.user?.id;
      // if (userId) {
      //   const business = await req.context.businessRepository.findByUserId(userId);
      //   if (!business || notification.businessId !== business.id) {
      //     return res.status(403).json({ error: 'Forbidden' });
      //   }
      // }

      return res.status(200).json({
        notification
      });
    } catch (error) {
      next(error);
    }
  }

  // Get notifications by business ID
  async getByBusinessId(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Get business for user
      const business = await req.context.businessRepository.findByUserId(userId);
      if (!business) {
        return res.status(404).json({ error: 'Business not found' });
      }

      // Get notifications
      const notifications = await notificationService.getNotificationsByBusinessId(business.id);

      return res.status(200).json({
        notifications
      });
    } catch (error) {
      next(error);
    }
  }

  // Get unread notifications by business ID
  async getUnread(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Get business for user
      const business = await req.context.businessRepository.findByUserId(userId);
      if (!business) {
        return res.status(404).json({ error: 'Business not found' });
      }

      // Get unread notifications
      const notifications = await notificationService.getUnreadNotificationsByBusinessId(business.id);

      return res.status(200).json({
        notifications
      });
    } catch (error) {
      next(error);
    }
  }

  // Update notification
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Validate input
      const validatedData = updateNotificationSchema.parse(req.body);

      // Update notification
      const notification = await notificationService.updateNotification(id, validatedData);

      return res.status(200).json({
        message: 'Notification updated successfully',
        notification
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete notification
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Delete notification
      await notificationService.deleteNotification(id);

      return res.status(200).json({
        message: 'Notification deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Mark notification as read
  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Mark notification as read
      const notification = await notificationService.markAsRead(id);

      return res.status(200).json({
        message: 'Notification marked as read successfully',
        notification
      });
    } catch (error) {
      next(error);
    }
  }

  // Mark notification as unread
  async markAsUnread(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Mark notification as unread
      const notification = await notificationService.markAsUnread(id);

      return res.status(200).json({
        message: 'Notification marked as unread successfully',
        notification
      });
    } catch (error) {
      next(error);
    }
  }

  // Mark all notifications as read for business
  async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Get business for user
      const business = await req.context.businessRepository.findByUserId(userId);
      if (!business) {
        return res.status(404).json({ error: 'Business not found' });
      }

      // Mark all notifications as read
      const result = await notificationService.markAllAsRead(business.id);

      return res.status(200).json({
        message: `${result.count} notifications marked as read successfully`,
        count: result.count
      });
    } catch (error) {
      next(error);
    }
  }

  // Get notification count for business
  async getCount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Get business for user
      const business = await req.context.businessRepository.findByUserId(userId);
      if (!business) {
        return res.status(404).json({ error: 'Business not found' });
      }

      // Get notification count
      const count = await notificationService.getNotificationCount(business.id);

      return res.status(200).json({
        count
      });
    } catch (error) {
      next(error);
    }
  }

  // Get unread notification count for business
  async getUnreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Get business for user
      const business = await req.context.businessRepository.findByUserId(userId);
      if (!business) {
        return res.status(404).json({ error: 'Business not found' });
      }

      // Get unread notification count
      const count = await notificationService.getUnreadNotificationCount(business.id);

      return res.status(200).json({
        count
      });
    } catch (error) {
      next(error);
    }
  }
}

// Export singleton instance
export const notificationController = new NotificationController();