import { z } from 'zod';

// Widget creation schema
export const createWidgetSchema = z.object({
  title: z.string().default('AI Assistant'),
  theme: z.enum(['LIGHT', 'DARK', 'AUTO']).default('LIGHT'),
  position: z.enum(['BOTTOM_RIGHT', 'BOTTOM_LEFT', 'TOP_RIGHT', 'TOP_LEFT']).default('BOTTOM_RIGHT'),
  isEnabled: z.boolean().default(true),
  customCss: z.string().optional()
});

// Widget update schema
export const updateWidgetSchema = z.object({
  title: z.string().optional(),
  theme: z.enum(['LIGHT', 'DARK', 'AUTO']).optional(),
  position: z.enum(['BOTTOM_RIGHT', 'BOTTOM_LEFT', 'TOP_RIGHT', 'TOP_LEFT']).optional(),
  isEnabled: z.boolean().optional(),
  customCss: z.string().optional()
});

// Export schemas
export const widgetValidators = {
  create: createWidgetSchema,
  update: updateWidgetSchema
};