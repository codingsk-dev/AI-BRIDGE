import { Request, Response, NextFunction } from 'express';
import { createSyncJobSchema, updateSyncJobSchema } from '../validators/sync.validator';
import { syncService } from './services/sync.service';
import { logger } from '../../utils/logger';
import { authenticate } from '../../middleware/auth.middleware';

// Sync controller
export class SyncController {
  // Create sync job
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate input
      const validatedData = createSyncJobSchema.parse(req.body);

      // Get user ID from authenticated request
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Get business for user
      const business = await req.context.businessRepository.findByUserId(userId);
      if (!business) {
        return res.status(404).json({ error: 'Business not found' });
      }

      // Create sync job
      const syncJob = await syncService.createSyncJob(business.id, validatedData);

      return res.status(201).json({
        message: 'Sync job created successfully',
        syncJob
      });
    } catch (error) {
      next(error);
    }
  }

  // Get sync job by ID
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Get sync job
      const syncJob = await syncService.getSyncJobById(id);

      // Optional: Check if user owns the sync job's business
      // const userId = req.user?.id;
      // if (userId) {
      //   const business = await req.context.businessRepository.findByUserId(userId);
      //   if (!business || syncJob.businessId !== business.id) {
      //     return res.status(403).json({ error: 'Forbidden' });
      //   }
      // }

      return res.status(200).json({
        syncJob
      });
    } catch (error) {
      next(error);
    }
  }

  // Get sync jobs by business ID
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

      // Get sync jobs
      const syncJobs = await syncService.getSyncJobsByBusinessId(business.id);

      return res.status(200).json({
        syncJobs
      });
    } catch (error) {
      next(error);
    }
  }

  // Get sync jobs by business ID and status
  async getByBusinessIdAndStatus(req: Request, res: Response, next: NextFunction) {
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

      const { status } = req.params;

      // Get sync jobs
      const syncJobs = await syncService.getSyncJobsByBusinessIdAndStatus(business.id, status);

      return res.status(200).json({
        syncJobs
      });
    } catch (error) {
      next(error);
    }
  }

  // Get latest sync job by business ID and type
  async getLatestByBusinessIdAndType(req: Request, res: Response, next: NextFunction) {
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

      const { type } = req.params;

      // Get latest sync job
      const syncJob = await syncService.getLatestSyncJobByBusinessIdAndType(business.id, type);

      if (!syncJob) {
        return res.status(404).json({ error: 'No sync job found for this type' });
      }

      return res.status(200).json({
        syncJob
      });
    } catch (error) {
      next(error);
    }
  }

  // Update sync job
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Validate input
      const validatedData = updateSyncJobSchema.parse(req.body);

      // Update sync job
      const syncJob = await syncService.updateSyncJob(id, validatedData);

      return res.status(200).json({
        message: 'Sync job updated successfully',
        syncJob
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete sync job
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Delete sync job
      await syncService.deleteSyncJob(id);

      return res.status(200).json({
        message: 'Sync job deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Start website sync
  async startWebsiteSync(req: Request, res: Response, next: NextFunction) {
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

      // Start website sync
      const result = await syncService.startWebsiteSync(business.id);

      return res.status(200).json({
        message: 'Website sync completed successfully',
        syncJob: result.syncJob,
        websiteResult: result.result
      });
    } catch (error) {
      next(error);
    }
  }

  // Start document sync
  async startDocumentSync(req: Request, res: Response, next: NextFunction) {
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

      // Start document sync
      const result = await syncService.startDocumentSync(business.id);

      return res.status(200).json({
        message: 'Document sync completed successfully',
        syncJob: result.syncJob,
        processedCount: result.processedCount
      });
    } catch (error) {
      next(error);
    }
  }

  // Start knowledge base sync
  async startKnowledgeBaseSync(req: Request, res: Response, next: NextFunction) {
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

      // Start knowledge base sync
      const result = await syncService.startKnowledgeBaseSync(business.id);

      return res.status(200).json({
        message: 'Knowledge base sync completed successfully',
        syncJob: result.syncJob,
        pageCountChange: result.pageCountChange,
        documentCountChange: result.documentCountChange
      });
    } catch (error) {
      next(error);
    }
  }

  // Get sync job count for business
  async getCount(req: Request, res: Response, next: NextFunction) {
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

      // Get sync job count
      const count = await syncService.getSyncJobCount(business.id);

      return res.status(200).json({
        count
      });
    } catch (error) {
      next(error);
    }
  }
}

// Export singleton instance
export const syncController = new SyncController();