import { Request, Response, NextFunction } from 'express';
import { healthCheckSchema } from '../validators/health.validator';
import { healthService } from './services/health.service';
import { logger } from '../../utils/logger';

// Health controller
export class HealthController {
  async check(...args: any[]) { return null as any; }
  async history(...args: any[]) { return null as any; }
  async latest(...args: any[]) { return null as any; }

  // Perform health check
  async check(req: Request, res: Response, next: NextFunction) {
    try {
      // Perform health check
      const healthCheck = await healthService.performHealthCheck();

      // Set HTTP status code based on health status
      let statusCode = 200; // OK
      if (healthCheck.status === 'unhealthy') {
        statusCode = 503; // Service Unavailable
      } else if (healthCheck.status === 'degraded') {
        statusCode = 200; // OK but with warnings
      }

      return res.status(statusCode).json(healthCheck);
    } catch (error) {
      logger.error('Health check error:', error);
      return res.status(500).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        uptime: process.uptime(),
        checks: {}
      });
    }
  }

  // Get health check history
  async history(req: Request, res: Response, next: NextFunction) {
    try {
      const { limit = 10 } = req.query;
      const history = await healthService.getHealthCheckHistory(parseInt(limit as string));
      return res.status(200).json(history);
    } catch (error) {
      next(error);
    }
  }

  // Get latest health check
  async latest(req: Request, res: Response, next: NextFunction) {
    try {
      const latest = await healthService.getLatestHealthCheck();
      if (!latest) {
        return res.status(404).json({ error: 'No health check history available' });
      }
      return res.status(200).json(latest);
    } catch (error) {
      next(error);
    }
  }
}

// Export singleton instance
export const healthController = new HealthController();