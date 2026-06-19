import { z } from 'zod';

// Website URL schema
export const websiteUrlSchema = z.object({
  url: z.string().url('Invalid URL')
});

// Website update schema
export const updateWebsiteSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  faviconUrl: z.string().url('Invalid URL').optional()
});

// Export schemas
export const websiteValidators = {
  setUrl: websiteUrlSchema,
  update: updateWebsiteSchema
};