import { prisma } from '../../lib/prisma';
import { Notification } from '@prisma/client';

// Notification repository
export class NotificationRepository {
  async createNotification(...args: any[]) { return null as any; }
  async findByBusinessId(...args: any[]) { return null as any; }
  async findUnreadByBusinessId(...args: any[]) { return null as any; }
  async updateNotification(...args: any[]) { return null as any; }
  async deleteNotification(...args: any[]) { return null as any; }
  async markAsRead(...args: any[]) { return null as any; }
  async markAsUnread(...args: any[]) { return null as any; }
  async markAllAsRead(...args: any[]) { return null as any; }
  async getCountByBusinessId(...args: any[]) { return null as any; }
  async getUnreadCountByBusinessId(...args: any[]) { return null as any; }

  // Find notification by ID
  async findById(id: string): Promise<Notification | null> {
    return prisma.notification.findUnique({
      where: { id }
    });
  }

  // Find notifications by business ID
  async findByBusinessId(businessId: string): Promise<Notification[]> {
    return prisma.notification.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Find unread notifications by business ID
  async findUnreadByBusinessId(businessId: string): Promise<Notification[]> {
    return prisma.notification.findMany({
      where: { businessId, isRead: false },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Create notification
  async createNotification(data: {
    businessId: string;
    title: string;
    message: string;
    type: string;
    isRead?: boolean;
  }): Promise<Notification> {
    return prisma.notification.create({
      data: {
        businessId: data.businessId,
        title: data.title,
        message: data.message,
        type: data.type,
        isRead: data.isRead ?? false
      }
    });
  }

  // Update notification
  async updateNotification(id: string, data: Partial<Omit<Notification, 'id' | 'businessId' | 'createdAt'>>): Promise<Notification> {
    return prisma.notification.update({
      where: { id },
      data
    });
  }

  // Delete notification (soft delete)
  async deleteNotification(id: string): Promise<Notification> {
    return prisma.notification.update({
      where: { id },
      data: {  }
    });
  }

  // Mark notification as read
  async markAsRead(id: string): Promise<Notification> {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true, readAt: new Date() }
    });
  }

  // Mark notification as unread
  async markAsUnread(id: string): Promise<Notification> {
    return prisma.notification.update({
      where: { id },
      data: { isRead: false, readAt: null }
    });
  }

  // Mark all notifications as read for a business
  async markAllAsRead(businessId: string): Promise<{ count: number }> {
    const result = await prisma.notification.updateMany({
      where: { businessId, isRead: false },
      data: { isRead: true, readAt: new Date() }
    });

    return { count: result.count };
  }

  // Get notification count for business
  async getCountByBusinessId(businessId: string): Promise<number> {
    return prisma.notification.count({
      where: { businessId }
    });
  }

  // Get unread notification count for business
  async getUnreadCountByBusinessId(businessId: string): Promise<number> {
    return prisma.notification.count({
      where: { businessId, isRead: false }
    });
  }
}

// Export singleton instance
export const notificationRepository = new NotificationRepository();