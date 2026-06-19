import { prisma } from '../../lib/prisma';
import { Business, BusinessSettings, User } from '@prisma/client';

// Business repository for business-related database operations
export class BusinessRepository {
  // Find business by ID
  async findById(id: string): Promise<Business | null> {
    return prisma.business.findUnique({
      where: { id }
    });
  }

  // Find business by user ID
  async findByUserId(userId: string): Promise<Business | null> {
    return prisma.business.findUnique({
      where: { userId }
    });
  }

  // Create new business
  async createBusiness(data: {
    userId: string;
    name: string;
    description?: string;
    websiteUrl?: string;
    industry: string;
    contactEmail?: string;
    contactPhone?: string;
    address?: string;
  }): Promise<Business> {
    return prisma.business.create({
      data: {
        userId: data.userId,
        name: data.name,
        description: data.description,
        websiteUrl: data.websiteUrl,
        industry: data.industry,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        address: data.address
      }
    });
  }

  // Update business
  async updateBusiness(id: string, data: Partial<Omit<Business, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'deletedAt'>>): Promise<Business> {
    return prisma.business.update({
      where: { id },
      data
    });
  }

  // Delete business (soft delete)
  async deleteBusiness(id: string): Promise<Business> {
    return prisma.business.update({
      where: { id },
      data: {  }
    });
  }

  // Find businesses with pagination and filters
  async findMany(
    skip = 0,
    take = 10,
    filters: {
      industry?: string;
      name?: string;
      isActive?: boolean;
    } = {}
  ): Promise<{ businesses: Business[]; total: number }> {
    const where: any = {};

    if (filters.industry) {
      where.industry = filters.industry;
    }

    if (filters.name) {
      where.name = {
        contains: filters.name,
        mode: 'insensitive'
      };
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    // Exclude soft deleted businesses
    where.deletedAt = null;

    const [businesses, total] = await prisma.$transaction([
      prisma.business.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.business.count({ where })
    ]);

    return { businesses, total };
  }

  // Create business settings
  async createBusinessSettings(data: {
    businessId: string;
    timezone?: string;
    language?: string;
    emailNotifications?: boolean;
    analyticsSharing?: boolean;
    dataRetentionDays?: number;
  }): Promise<BusinessSettings> {
    return prisma.businessSettings.create({
      data: {
        businessId: data.businessId,
        timezone: data.timezone,
        language: data.language,
        emailNotifications: data.emailNotifications,
        analyticsSharing: data.analyticsSharing,
        dataRetentionDays: data.dataRetentionDays
      }
    });
  }

  // Update business settings
  async updateBusinessSettings(id: string, data: Partial<Omit<BusinessSettings, 'id' | 'businessId' | 'createdAt' | 'updatedAt'>>): Promise<BusinessSettings> {
    return prisma.businessSettings.update({
      where: { id },
      data
    });
  }

  // Find business settings by business ID
  async findBusinessSettingsByBusinessId(businessId: string): Promise<BusinessSettings | null> {
    return prisma.businessSettings.findUnique({
      where: { businessId }
    });
  }
}

// Export singleton instance
export const businessRepository = new BusinessRepository();