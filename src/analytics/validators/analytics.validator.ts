import { z } from 'zod';

// Analytics creation schema
export const createAnalyticsSchema = z.object({
  metricType: z.enum([
    'TOTAL_CHATS',
    'POPULAR_TOPICS',
    'FAILED_RESPONSES',
    'RESOLUTION_RATE',
    'AVERAGE_SESSION_DURATION'
  ]),
  metricValue: z.number(),
  labels: z.string().optional() // JSON string for additional dimensions
});

// Export schema
export const analyticsValidators = {
  create: createAnalyticsSchema
};