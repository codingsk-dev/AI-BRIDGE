import { z } from 'zod';

// Chat session creation schema
export const createChatSessionSchema = z.object({
  // Visitor ID would come from cookie or header in real implementation
  visitorId: z.string().optional()
});

// Chat message creation schema
export const createChatMessageSchema = z.object({
  content: z.string().min(1, 'Message content is required'),
  isFromUser: z.boolean().default(true)
});

// Export schemas
export const chatValidators = {
  createSession: createChatSessionSchema,
  createMessage: createChatMessageSchema
};