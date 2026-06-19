import { z } from 'zod';

// Business settings update schema
export const updateBusinessSettingsSchema = z.object({
  timezone: z.string().optional(),
  language: z.string().optional(),
  emailNotifications: z.boolean().optional(),
  analyticsSharing: z.boolean().optional(),
  dataRetentionDays: z.number().int().positive().optional()
});

// Export schema
export const businessSettingsValidators = {
  update: updateBusinessSettingsSchema
};