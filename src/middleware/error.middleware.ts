import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { ValidationError } from 'zod';

export const notFoundHandler = (req: Request, res: Response, next: Function) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error['status'] = 404;
  next(error);
};

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  // Log error
  logger.error({
    message: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    body: req.body,
    query: req.query,
    params: req.params
  }, 'Unhandled error');

  // Default error status
  const status = error.status || 500;

  // Don't leak stack trace in production
  const message = error.message || 'Internal Server Error';

  // Handle Zod validation errors
  if (error instanceof ValidationError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.errors.map((err: any) => ({
        path: err.path,
        message: err.message
      }))
    });
  }

  // Handle known error types
  if (error.code === 'P2002') { // Prisma unique constraint violation
    return res.status(409).json({
      error: 'Conflict',
      message: 'A record with these values already exists'
    });
  }

  if (error.code === 'P2025') { // Prisma record not found
    return res.status(404).json({
      error: 'Not found',
      message: 'The requested resource was not found'
    });
  }

  // Send error response
  return res.status(status).json({
    error: message,
    // Only include stack in development
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};