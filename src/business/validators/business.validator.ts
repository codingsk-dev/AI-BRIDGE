import { z } from 'zod';

// Business creation schema
export const createBusinessSchema = z.object({
  name: z.string().min(1, 'Business name is required'),
  description: z.string().optional(),
  websiteUrl: z.string().url('Invalid URL').optional(),
  industry: z.enum([
    'TECHNOLOGY',
    'HEALTHCARE',
    'FINANCE',
    'RETAIL',
    'EDUCATION',
    'HOSPITALITY',
    'MANUFACTURING',
    'CONSULTING',
    'OTHER'
  ], {
    invalid_type_error: 'Invalid industry',
    required_error: 'Industry is required'
  }),
  contactEmail: z.string().email('Invalid email address').optional(),
  contactPhone: z.string().optional(),
  address: z.string().optional()
});

// Business update schema (partial)
export const updateBusinessSchema = z.object({
  name: z.string().min(1, 'Business name is required').optional(),
  description: z.string().optional(),
  websiteUrl: z.string().url('Invalid URL').optional(),
  industry: z.enum([
    'TECHNOLOGY',
    'HEALTHCARE',
    'FINANCE',
    'RETAIL',
    'EDUCATION',
    'HOSPITALITY',
    'MANUFACTURING',
    'CONSULTING',
    'OTHER'
  ]).optional(),
  contactEmail: z.string().email('Invalid email address').optional(),
  contactPhone: z.string().optional(),
  address: z.string().optional()
});

// Export schemas
export const businessValidators = {
  create: createBusinessSchema,
  update: updateBusinessSchema
};