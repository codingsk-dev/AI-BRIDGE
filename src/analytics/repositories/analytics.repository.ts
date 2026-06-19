import { prisma } from '../../lib/prisma';
import { Analytics } from '@prisma/client';

// Analytics repository
export class AnalyticsRepository {
  // Find analytics by ID
  async findById(id: string): Promise<Analytics | null> {
    return prisma.analytics.findUnique({
      where: { id }
    });
  }

  // Find analytics by business ID
  async findByBusinessId(businessId: string): Promise<Analytics[]> {
    return prisma.analytics.findMany({
      where: { businessId },
      orderBy: { date: 'desc' }
    });
  }

  // Find analytics by business ID and metric type
  async findByBusinessIdAndMetricType(businessId: string, metricType: string): Promise<Analytics[]> {
    return prisma.analytics.findMany({
      where: { businessId, metricType },
      orderBy: { date: 'desc' }
    });
  }

  // Find latest analytics by business ID and metric type
  async findLatestByBusinessIdAndMetricType(businessId: string, metricType: string): Promise<Analytics | null> {
    return prisma.analytics.findFirst({
      where: { businessId, metricType },
      orderBy: { date: 'desc' }
    });
  }

  // Create analytics
  async createAnalytics(data: {
    businessId: string;
    metricType: string;
    metricValue: number;
    labels?: string;
    date?: Date;
  }): Promise<Analytics> {
    return prisma.analytics.create({
      data: {
        businessId: data.businessId,
        metricType: data.metricType,
        metricValue: data.metricValue,
        labels: data.labels,
        date: data.date || new Date()
      }
    });
  }

  // Update analytics
  async updateAnalytics(id: string, data: Partial<Omit<Analytics, 'id' | 'businessId' | 'createdAt'>>): Promise<Analytics> {
    return prisma.analytics.update({
      where: { id },
      data
    });
  }

  // Delete analytics (soft delete)
  async deleteAnalytics(id: string): Promise<Analytics> {
    return prisma.analytics.update({
      where: { id },
      data: {  }
    });
  }

  // Get analytics count for business
  async countByBusinessId(businessId: string): Promise<number> {
    return prisma.analytics.count({
      where: { businessId }
    });
  }

  // Delete old analytics (for data retention)
  async deleteOldAnalytics(businessId: string, daysToKeep: number): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await prisma.analytics.deleteMany({
      where: {
        businessId,
        date: {
          lt: cutoffDate
        }
      }
    });

    return result.count;
  }
}

// Export singleton instance
export const analyticsRepository = new AnalyticsRepository();