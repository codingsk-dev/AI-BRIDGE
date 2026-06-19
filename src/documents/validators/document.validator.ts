import { z } from 'zod';

// Document upload schema
export const uploadDocumentSchema = z.object({
  // File validation will be handled by multer middleware
  // This schema is for metadata if needed
  description: z.string().optional()
});

// Document update schema
export const updateDocumentSchema = z.object({
  description: z.string().optional(),
  isProcessed: z.boolean().optional()
});

// Export schemas
export const documentValidators = {
  upload: uploadDocumentSchema,
  update: updateDocumentSchema
};