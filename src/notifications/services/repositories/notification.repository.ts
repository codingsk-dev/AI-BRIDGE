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

  async findById(id: string) { return null; }
  async findByUserId(id: string) { return null; }
  async create(data: any) { return data; }
}
export const notificationRepository = new NotificationRepository();
