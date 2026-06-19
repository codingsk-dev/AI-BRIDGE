import { z } from 'zod';

// User update schema
export const updateUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  email: z.string().email('Invalid email address').optional(),
  role: z.enum(['ADMIN', 'BUSINESS_OWNER', 'EMPLOYEE']).optional()
});

// Export schema
export const userValidators = {
  update: updateUserSchema
};