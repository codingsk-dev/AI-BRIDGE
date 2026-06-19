import { z } from 'zod';

// Sync job creation schema
export const createSyncJobSchema = z.object({
  type: z.enum(['website', 'document', 'knowledge_base']).default('website'),
  // Additional parameters can be added here based on sync type
});

// Sync job update schema
export const updateSyncJobSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'completed', 'failed']).optional(),
  errorMessage: z.string().optional(),
  pagesProcessed: z.number().int().nonnegative().optional(),
  documentsProcessed: z.number().int().nonnegative().optional()
});

// Export schemas
export const syncValidators = {
  create: createSyncJobSchema,
  update: updateSyncJobSchema
};