import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { logger } from '../utils/logger';

/**
 * Middleware to validate request body against a Zod schema
 * @param schema - Zod schema to validate against
 */
export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      logger.warn('Validation error', {
        error: error.errors,
        body: req.body,
        url: req.originalUrl,
        method: req.method
      });
      // Re-throw to be handled by error handler
      next(error);
    }
  };
};

// Optional: Parameter validation middleware
export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      logger.warn('Parameter validation error', {
        error: error.errors,
        params: req.params,
        url: req.originalUrl,
        method: req.method
      });
      next(error);
    }
  };
};

// Optional: Query validation middleware
export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      logger.warn('Query validation error', {
        error: error.errors,
        query: req.query,
        url: req.originalUrl,
        method: req.method
      });
      next(error);
    }
  };
};