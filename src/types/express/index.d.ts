import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      context?: any; // Replace with proper Context interface if available
    }
  }
}