import { z } from 'zod';

// Job creation schema
export const createJobSchema = z.object({
  name: z.string().min(1, 'Job name is required'),
  type: z.string().min(1, 'Job type is required'),
  payload: z.record(z.unknown()).optional(),
  scheduledAt: z.date().optional()
});

// Job update schema
export const updateJobSchema = z.object({
  name: z.string().min(1, 'Job name is required').optional(),
  type: z.string().min(1, 'Job type is required').optional(),
  payload: z.record(z.unknown()).optional(),
  scheduledAt: z.date().optional(),
  status: z.enum(['pending', 'processing', 'completed', 'failed']).optional()
});

// Export schemas
export const jobValidators = {
  create: createJobSchema,
  update: updateJobSchema
};