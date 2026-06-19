import { Router, Request, Response, NextFunction } from 'express';
import { cacheController } from '../controllers/cache.controller';
import { setCacheSchema, getCacheSchema, deleteCacheSchema } from '../validators/cache.validator';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorization.middleware';

const router = Router();

// Cache routes require authentication
router.use(authenticate);

// Set value in cache
router.post(
  '/set',
  validateRequest(setCacheSchema),
  cacheController.set
);

// Get value from cache
router.get(
  '/get/:key',
  validateRequest(getCacheSchema),
  cacheController.get
);

// Delete value from cache
router.delete(
  '/del/:key',
  validateRequest(deleteCacheSchema),
  cacheController.del
);

// Check if key exists in cache
router.get(
  '/exists/:key',
  cacheController.exists
);

// Get cache info
router.get(
  '/info',
  authorize(['ADMIN']), // Only admin can view cache info
  cacheController.info
);

// Flush all cache (use with caution!)
router.post(
  '/flushall',
  authorize(['ADMIN']), // Only admin can flush cache
  cacheController.flushall
);

// Get TTL for key
router.get(
  '/ttl/:key',
  cacheController.ttl
);

// Helper middleware for validation
function validateRequest(schema: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({ ...req.body, ...req.params, ...req.query });
      next();
    } catch (error) {
      next(error);
    }
  };
}

export default router;