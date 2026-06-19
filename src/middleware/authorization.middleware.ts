import { Request, Response, NextFunction } from 'express';
import { logger } from '../../utils/logger';

/**
 * Middleware to authorize users based on roles
 * @param roles - Array of allowed roles
 */
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole) {
      logger.warn('Authorization failed: No role found on user');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!roles.includes(userRole)) {
      logger.warn(`Authorization failed: User role ${userRole} not authorized for this action`);
      return res.status(403).json({ error: 'Forbidden' });
    }

    next();
  };
};

// Optional: Middleware to check if user owns resource
export const ownResource = (getOwnerIdFn: (req: Request) => string | Promise<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const userRole = req.user?.role;

      // Admins can access any resource
      if (userRole === 'ADMIN') {
        return next();
      }

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const ownerId = await getOwnerIdFn(req);

      if (userId !== ownerId) {
        logger.warn(`Ownership failed: User ${userId} does not own resource owned by ${ownerId}`);
        return res.status(403).json({ error: 'Forbidden' });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};