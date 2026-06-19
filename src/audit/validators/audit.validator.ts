import { z } from 'zod';

// Audit creation schema
export const createAuditSchema = z.object({
  readinessScore: z.number().int().min(0).max(100),
  businessSummary: z.string().optional(),
  aiOpportunities: z.string().optional(), // JSON string
  automationSuggestions: z.string().optional(), // JSON string
  estimatedBenefits: z.string().optional(), // JSON string
  strengths: z.string().optional(), // JSON string
  weaknesses: z.string().optional(), // JSON string
  suggestedSolutions: z.string().optional(), // JSON string
  expectedRoi: z.string().optional() // JSON string
});

// Export schema
export const auditValidators = {
  create: createAuditSchema
};