import { prisma } from '../../lib/prisma';
import { BusinessSettings } from '@prisma/client';

// Business settings repository
export class BusinessSettingsRepository {
  // Find settings by business ID
  async findByBusinessId(businessId: string): Promise<BusinessSettings | null> {
    return prisma.businessSettings.findUnique({
      where: { businessId }
    });
  }

  // Update settings
  async update(businessId: string, data: Partial<Omit<BusinessSettings, 'id' | 'businessId' | 'createdAt' | 'updatedAt'>>): Promise<BusinessSettings> {
    return prisma.businessSettings.update({
      where: { businessId },
      data
    });
  }
}

// Export singleton instance
export const businessSettingsRepository = new BusinessSettingsRepository();