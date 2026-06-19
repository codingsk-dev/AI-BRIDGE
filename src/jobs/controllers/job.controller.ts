import { Request, Response, NextFunction } from 'express';
import { createJobSchema, updateJobSchema } from '../validators/job.validator';
import { jobService } from './services/job.service';
import { logger } from '../../utils/logger';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorization.middleware';

// Job controller
export class JobController {
  async create(...args: any[]) { return null as any; }
  async getById(...args: any[]) { return null as any; }
  async getByBusinessId(...args: any[]) { return null as any; }
  async getByType(...args: any[]) { return null as any; }
  async getByStatus(...args: any[]) { return null as any; }
  async getPending(...args: any[]) { return null as any; }
  async update(...args: any[]) { return null as any; }
  async delete(...args: any[]) { return null as any; }
  async start(...args: any[]) { return null as any; }
  async complete(...args: any[]) { return null as any; }
  async fail(...args: any[]) { return null as any; }
  async getCount(...args: any[]) { return null as any; }
  async getCountByBusinessId(...args: any[]) { return null as any; }
  async getCountByType(...args: any[]) { return null as any; }
  async getCountByStatus(...args: any[]) { return null as any; }

  // Create job
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate input
      const validatedData = createJobSchema.parse(req.body);

      // Get user ID from authenticated request
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Create job
      const job = await jobService.createJob({
        ...validatedData,
        businessId: req.context.business?.id // Associate with user's business if available
      });

      return res.status(201).json({
        message: 'Job created successfully',
        job
      });
    } catch (error) {
      next(error);
    }
  }

  // Get job by ID
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Get job
      const job = await jobService.getJobById(id);

      // Optional: Check if user owns the job's business
      // const userId = req.user?.id;
      // if (userId && job.businessId) {
      //   const business = await req.context.businessRepository.findByUserId(userId);
      //   if (!business || job.businessId !== business.id) {
      //     return res.status(403).json({ error: 'Forbidden' });
      //   }
      // }

      return res.status(200).json({
        job
      });
    } catch (error) {
      next(error);
    }
  }

  // Get jobs by business ID
  async getByBusinessId(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Get business for user
      const business = await req.context.businessRepository.findByUserId(userId);
      if (!business) {
        return res.status(404).json({ error: 'Business not found' });
      }

      // Get jobs
      const jobs = await jobService.getJobsByBusinessId(business.id);

      return res.status(200).json({
        jobs
      });
    } catch (error) {
      next(error);
    }
  }

  // Get jobs by type
  async getByType(req: Request, res: Response, next: NextFunction) {
    try {
      const { type } = req.params;

      // Get jobs
      const jobs = await jobService.getJobsByType(type);

      return res.status(200).json({
        jobs
      });
    } catch (error) {
      next(error);
    }
  }

  // Get jobs by status
  async getByStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.params;

      // Get jobs
      const jobs = await jobService.getJobsByStatus(status);

      return res.status(200).json({
        jobs
      });
    } catch (error) {
      next(error);
    }
  }

  // Get pending jobs
  async getPending(req: Request, res: Response, next: NextFunction) {
    try {
      const { limit = 10 } = req.query;

      // Get pending jobs
      const jobs = await jobService.getPendingJobs(parseInt(limit as string));

      return res.status(200).json({
        jobs
      });
    } catch (error) {
      next(error);
    }
  }

  // Update job
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Validate input
      const validatedData = updateJobSchema.parse(req.body);

      // Update job
      const job = await jobService.updateJob(id, validatedData);

      return res.status(200).json({
        message: 'Job updated successfully',
        job
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete job
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Delete job
      await jobService.deleteJob(id);

      return res.status(200).json({
        message: 'Job deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Start job
  async start(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Start job
      const job = await jobService.startJob(id);

      return res.status(200).json({
        message: 'Job started successfully',
        job
      });
    } catch (error) {
      next(error);
    }
  }

  // Complete job
  async complete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Complete job
      const job = await jobService.completeJob(id);

      return res.status(200).json({
        message: 'Job completed successfully',
        job
      });
    } catch (error) {
      next(error);
    }
  }

  // Fail job
  async fail(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { errorMessage } = req.body;

      // Fail job
      const job = await jobService.failJob(id, errorMessage);

      return res.status(200).json({
        message: 'Job marked as failed',
        job
      });
    } catch (error) {
      next(error);
    }
  }

  // Get job count
  async getCount(req: Request, res: Response, next: NextFunction) {
    try {
      const userRole = req.user?.role;

      // Only admin can get job count
      if (userRole !== 'ADMIN') {
        return res.status(403).json({ error: 'Forbidden' });
      }

      // Get job count
      const count = await jobService.getJobCount();

      return res.status(200).json({
        count
      });
    } catch (error) {
      next(error);
    }
  }

  // Get job count by business ID
  async getCountByBusinessId(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Get business for user
      const business = await req.context.businessRepository.findByUserId(userId);
      if (!business) {
        return res.status(404).json({ error: 'Business not found' });
      }

      // Get job count
      const count = await jobService.getJobCountByBusinessId(business.id);

      return res.status(200).json({
        count
      });
    } catch (error) {
      next(error);
    }
  }

  // Get job count by type
  async getCountByType(req: Request, res: Response, next: NextFunction) {
    try {
      const { type } = req.params;

      // Get job count
      const count = await jobService.getJobCountByType(type);

      return res.status(200).json({
        count
      });
    } catch (error) {
      next(error);
    }
  }

  // Get job count by status
  async getCountByStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.params;

      // Get job count
      const count = await jobService.getJobCountByStatus(status);

      return res.status(200).json({
        count
      });
    } catch (error) {
      next(error);
    }
  }
}

// Export singleton instance
export const jobController = new JobController();