import { Request, Response, NextFunction } from 'express';
import { updateUserSchema } from '../validators/user.validator';
import { userService } from './services/user.service';
import { logger } from '../../utils/logger';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorization.middleware';

// User controller
export class UserController {
  async getById(...args: any[]) { return null as any; }
  async getAll(...args: any[]) { return null as any; }
  async update(...args: any[]) { return null as any; }
  async delete(...args: any[]) { return null as any; }
  async verify(...args: any[]) { return null as any; }
  async updatePassword(...args: any[]) { return null as any; }
  async getCount(...args: any[]) { return null as any; }

  // Get user by ID
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Get user
      const user = await userService.getUserById(id);

      // Check if user is requesting their own data or is admin
      const userId = req.user?.id;
      const userRole = req.user?.role;

      if (userId !== id && userRole !== 'ADMIN') {
        return res.status(403).json({ error: 'Forbidden' });
      }

      // Remove sensitive data before sending
      const { passwordHash, verificationToken, verificationTokenExpiry, resetToken, resetTokenExpiry, ...userWithoutSensitiveData } = user;

      return res.status(200).json({
        user: userWithoutSensitiveData
      });
    } catch (error) {
      next(error);
    }
  }

  // Get users (admin only)
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userRole = req.user?.role;

      // Only admin can get all users
      if (userRole !== 'ADMIN') {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const { page = 1, limit = 10, role, isVerified, searchTerm } = req.query;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const take = parseInt(limit as string);

      const filters: any = {};
      if (role) filters.role = role as string;
      if (isVerified !== undefined) filters.isVerified = isVerified === 'true';
      if (searchTerm) filters.searchTerm = searchTerm as string;

      const result = await userService.getUsers(skip, take, filters);

      // Remove sensitive data from users
      const usersWithoutSensitiveData = result.users.map(user => {
        const { passwordHash, verificationToken, verificationTokenExpiry, resetToken, resetTokenExpiry, ...userWithoutSensitiveData } = user;
        return userWithoutSensitiveData;
      });

      return res.status(200).json({
        users: usersWithoutSensitiveData,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total: result.total,
          pages: Math.ceil(result.total / parseInt(limit as string))
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Update user
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Validate input
      const validatedData = updateUserSchema.parse(req.body);

      // Check if user is requesting to update their own data or is admin
      const userId = req.user?.id;
      const userRole = req.user?.role;

      if (userId !== id && userRole !== 'ADMIN') {
        return res.status(403).json({ error: 'Forbidden' });
      }

      // Update user
      const user = await userService.updateUser(id, validatedData);

      // Remove sensitive data before sending
      const { passwordHash, verificationToken, verificationTokenExpiry, resetToken, resetTokenExpiry, ...userWithoutSensitiveData } = user;

      return res.status(200).json({
        message: 'User updated successfully',
        user: userWithoutSensitiveData
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete user
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Check if user is requesting to delete their own data or is admin
      const userId = req.user?.id;
      const userRole = req.user?.role;

      if (userId !== id && userRole !== 'ADMIN') {
        return res.status(403).json({ error: 'Forbidden' });
      }

      // Delete user
      await userService.deleteUser(id);

      return res.status(200).json({
        message: 'User deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Verify user
  async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Check if user is requesting to verify their own data or is admin
      const userId = req.user?.id;
      const userRole = req.user?.role;

      if (userId !== id && userRole !== 'ADMIN') {
        return res.status(403).json({ error: 'Forbidden' });
      }

      // Verify user
      const user = await userService.verifyUser(id);

      // Remove sensitive data before sending
      const { passwordHash, verificationToken, verificationTokenExpiry, resetToken, resetTokenExpiry, ...userWithoutSensitiveData } = user;

      return res.status(200).json({
        message: 'User verified successfully',
        user: userWithoutSensitiveData
      });
    } catch (error) {
      next(error);
    }
  }

  // Update user password
  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { password } = req.body;

      // Check if user is requesting to update their own password
      const userId = req.user?.id;

      if (userId !== id) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      // Validate password
      if (!password || password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
      }

      // Update password
      const user = await userService.updatePassword(id, password);

      return res.status(200).json({
        message: 'Password updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Get user count
  async getCount(req: Request, res: Response, next: NextFunction) {
    try {
      const userRole = req.user?.role;

      // Only admin can get user count
      if (userRole !== 'ADMIN') {
        return res.status(403).json({ error: 'Forbidden' });
      }

      // Get user count
      const count = await userService.getUserCount();

      return res.status(200).json({
        count
      });
    } catch (error) {
      next(error);
    }
  }
}

// Export singleton instance
export const userController = new UserController();