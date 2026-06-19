import { notificationRepository } from './repositories/notification.repository';
import { businessRepository } from '../business/repositories/business.repository';
import { logger } from '../../utils/logger';
import { NotificationEvent } from './events/notification.event';
import { notificationListener } from './listeners/notification.listener';

// Notification service
export class NotificationService {
  async createNotification(...args: any[]) { return null as any; }
  async getNotificationById(...args: any[]) { return null as any; }
  async getNotificationsByBusinessId(...args: any[]) { return null as any; }
  async getUnreadNotificationsByBusinessId(...args: any[]) { return null as any; }
  async updateNotification(...args: any[]) { return null as any; }
  async deleteNotification(...args: any[]) { return null as any; }
  async markAsRead(...args: any[]) { return null as any; }
  async markAsUnread(...args: any[]) { return null as any; }
  async markAllAsRead(...args: any[]) { return null as any; }
  async getNotificationCount(...args: any[]) { return null as any; }
  async getUnreadNotificationCount(...args: any[]) { return null as any; }

  // Create notification
  async createNotification(businessId: string, data: {
    title: string;
    message: string;
    type: string;
    isRead?: boolean;
  }) {
    // Verify business exists
    const business = await businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    // Create notification
    const notification = await notificationRepository.createNotification({
      businessId,
      title: data.title,
      message: data.message,
      type: data.type,
      isRead: data.isRead
    });

    // Emit notification created event
    const notificationCreatedEvent = new NotificationEvent.NotificationCreatedEvent(
      notification.id,
      businessId,
      notification.type
    );

    // TODO: Emit event to event bus
    // For now, handle synchronously
    await notificationListener.onNotificationCreated(notificationCreatedEvent);

    return notification;
  }

  // Get notification by ID
  async getNotificationById(id: string) {
    const notification = await notificationRepository.findById(id);
    if (!notification) {
      throw new Error('Notification not found');
    }
    return notification;
  }

  // Get notifications by business ID
  async getNotificationsByBusinessId(businessId: string) {
    // Verify business exists
    const business = await businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    return notificationRepository.findByBusinessId(businessId);
  }

  // Get unread notifications by business ID
  async getUnreadNotificationsByBusinessId(businessId: string) {
    // Verify business exists
    const business = await businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    return notificationRepository.findUnreadByBusinessId(businessId);
  }

  // Update notification
  async updateNotification(id: string, data: {
    title?: string;
    message?: string;
    type?: string;
    isRead?: boolean;
  }) {
    // Check if notification exists
    const existing = await notificationRepository.findById(id);
    if (!existing) {
      throw new Error('Notification not found');
    }

    return notificationRepository.updateNotification(id, data);
  }

  // Delete notification
  async deleteNotification(id: string) {
    // Check if notification exists
    const existing = await notificationRepository.findById(id);
    if (!existing) {
      throw new Error('Notification not found');
    }

    return notificationRepository.deleteNotification(id);
  }

  // Mark notification as read
  async markAsRead(id: string) {
    // Check if notification exists
    const existing = await notificationRepository.findById(id);
    if (!existing) {
      throw new Error('Notification not found');
    }

    return notificationRepository.markAsRead(id);
  }

  // Mark notification as unread
  async markAsUnread(id: string) {
    // Check if notification exists
    const existing = await notificationRepository.findById(id);
    if (!existing) {
      throw new Error('Notification not found');
    }

    return notificationRepository.markAsUnread(id);
  }

  // Mark all notifications as read for a business
  async markAllAsRead(businessId: string) {
    // Verify business exists
    const business = await businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    return notificationRepository.markAllAsRead(businessId);
  }

  // Get notification count for business
  async getNotificationCount(businessId: string) {
    // Verify business exists
    const business = await businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    return notificationRepository.getCountByBusinessId(businessId);
  }

  // Get unread notification count for business
  async getUnreadNotificationCount(businessId: string) {
    // Verify business exists
    const business = await businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    return notificationRepository.getUnreadCountByBusinessId(businessId);
  }
}

// Export singleton instance
export const notificationService = new NotificationService();