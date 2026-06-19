import { z } from 'zod';

// Knowledge base update schema
export const updateKnowledgeBaseSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional()
});

// Export schema
export const knowledgeBaseValidators = {
  update: updateKnowledgeBaseSchema
};