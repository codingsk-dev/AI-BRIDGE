import { prisma } from '../../lib/prisma';
import { Audit } from '@prisma/client';

// Audit repository
export class AuditRepository {
  // Find audit by ID
  async findById(id: string): Promise<Audit | null> {
    return prisma.audit.findUnique({
      where: { id }
    });
  }

  // Find audits by business ID
  async findByBusinessId(businessId: string): Promise<Audit[]> {
    return prisma.audit.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Find latest audit by business ID
  async findLatestByBusinessId(businessId: string): Promise<Audit | null> {
    return prisma.audit.findFirst({
      where: { businessId },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Create audit
  async createAudit(data: {
    businessId: string;
    readinessScore: number;
    businessSummary?: string;
    aiOpportunities?: string;
    automationSuggestions?: string;
    estimatedBenefits?: string;
    strengths?: string;
    weaknesses?: string;
    suggestedSolutions?: string;
    expectedRoi?: string;
  }): Promise<Audit> {
    return prisma.audit.create({
      data: {
        businessId: data.businessId,
        readinessScore: data.readinessScore,
        businessSummary: data.businessSummary,
        aiOpportunities: data.aiOpportunities,
        automationSuggestions: data.automationSuggestions,
        estimatedBenefits: data.estimatedBenefits,
        strengths: data.strengths,
        weaknesses: data.weaknesses,
        suggestedSolutions: data.suggestedSolutions,
        expectedRoi: data.expectedRoi
      }
    });
  }

  // Update audit
  async updateAudit(id: string, data: Partial<Omit<Audit, 'id' | 'businessId' | 'createdAt'>>): Promise<Audit> {
    return prisma.audit.update({
      where: { id },
      data
    });
  }

  // Delete audit (soft delete)
  async deleteAudit(id: string): Promise<Audit> {
    return prisma.audit.update({
      where: { id },
      data: {  }
    });
  }

  // Get audit count for business
  async countByBusinessId(businessId: string): Promise<number> {
    return prisma.audit.count({
      where: { businessId }
    });
  }
}

// Export singleton instance
export const auditRepository = new AuditRepository();