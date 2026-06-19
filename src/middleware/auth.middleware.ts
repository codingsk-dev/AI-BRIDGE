import { Request, Response, NextFunction } from 'express';
import { authService } from '../auth/services/auth.service';
import { logger } from '../../utils/logger';
import { prisma } from '../../lib/prisma';

/**
 * Middleware to authenticate JWT token from cookies
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Unauthorized: No refresh token provided' });
    }

    // Verify refresh token
    const payload = authService.verifyRefreshToken(refreshToken) as { userId: string };

    // Check if token exists in database and is not expired
    const storedToken = await prisma.refreshToken.findFirst({
      where: {
        token: refreshToken,
        userId: payload.userId,
        expiresAt: {
          gt: new Date()
        },
        revoked: false
      }
    });

    if (!storedToken) {
      return res.status(401).json({ error: 'Unauthorized: Invalid or expired refresh token' });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isVerified: true
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    // Attach user to request object
    req.user = user;

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};