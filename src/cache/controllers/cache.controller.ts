import { Request, Response, NextFunction } from 'express';
import { setCacheSchema, getCacheSchema, deleteCacheSchema } from '../validators/cache.validator';
import { cacheService } from './services/cache.service';
import { logger } from '../../utils/logger';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorization.middleware';

// Cache controller
export class CacheController {
  // Set value in cache
  async set(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate input
      const validatedData = setCacheSchema.parse(req.body);

      // Only allow admin to modify cache
      const userRole = req.user?.role;
      if (userRole !== 'ADMIN') {
        return res.status(403).json({ error: 'Forbidden: Admin access required' });
      }

      // Set value in cache
      await cacheService.set(validatedData.key, validatedData.value, validatedData.ttl);

      return res.status(200).json({
        message: `Cache set successfully for key '${validatedData.key}'`
      });
    } catch (error) {
      next(error);
    }
  }

  // Get value from cache
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate input
      const validatedData = getCacheSchema.parse(req.params);

      // Get value from cache
      const value = await cacheService.get<any>(validatedData.key);

      if (value === null) {
        return res.status(404).json({ error: `Cache miss for key '${validatedData.key}'` });
      }

      return res.status(200).json({
        key: validatedData.key,
        value: value,
        cached: true
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete value from cache
  async del(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate input
      const validatedData = deleteCacheSchema.parse(req.params);

      // Only allow admin to modify cache
      const userRole = req.user?.role;
      if (userRole !== 'ADMIN') {
        return res.status(403).json({ error: 'Forbidden: Admin access required' });
      }

      // Delete value from cache
      const result = await cacheService.del(validatedData.key);

      return res.status(200).json({
        message: `Cache delete successful for key '${validatedData.key}' (${result} item(s) removed)`
      });
    } catch (error) {
      next(error);
    }
  }

  // Check if key exists in cache
  async exists(req: Request, res: Response, next: NextFunction) {
    try {
      const { key } = req.params;

      // Check if key exists in cache
      const exists = await cacheService.exists(key);

      return res.status(200).json({
        key: key,
        exists: exists
      });
    } catch (error) {
      next(error);
    }
  }

  // Get cache info
  async info(req: Request, res: Response, next: NextFunction) {
    try {
      // Only allow admin to view cache info
      const userRole = req.user?.role;
      if (userRole !== 'ADMIN') {
        return res.status(403).json({ error: 'Forbidden: Admin access required' });
      }

      // Get cache info
      const info = await cacheService.info();

      return res.status(200).json({
        info: info
      });
    } catch (error) {
      next(error);
    }
  }

  // Flush all cache (use with caution!)
  async flushall(req: Request, res: Response, next: NextFunction) {
    try {
      // Only allow admin to flush cache
      const userRole = req.user?.role;
      if (userRole !== 'ADMIN') {
        return res.status(403).json({ error: 'Forbidden: Admin access required' });
      }

      // Flush all cache
      await cacheService.flushall();

      return res.status(200).json({
        message: 'Cache flushed successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Get TTL for key
  async ttl(req: Request, res: Response, next: NextFunction) {
    try {
      const { key } = req.params;

      // Get TTL for key
      const ttl = await cacheService.ttl(key);

      return res.status(200).json({
        key: key,
        ttl: ttl // -2 if key doesn't exist, -1 if key exists but has no associated expire
      });
    } catch (error) {
      next(error);
    }
  }
}

// Export singleton instance
export const cacheController = new CacheController();