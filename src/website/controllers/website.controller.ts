import { Request, Response, NextFunction } from 'express';
import { websiteUrlSchema, updateWebsiteSchema } from '../validators/website.validator';
import { websiteService } from './services/website.service';
import { logger } from '../../utils/logger';
import { authenticate } from '../../middleware/auth.middleware';

// Website controller
export class WebsiteController {
  async setUrl(...args: any[]) { return null as any; }
  async getByBusinessId(...args: any[]) { return null as any; }
  async update(...args: any[]) { return null as any; }
  async delete(...args: any[]) { return null as any; }
  async crawl(...args: any[]) { return null as any; }
  async recrawl(...args: any[]) { return null as any; }
  async getPages(...args: any[]) { return null as any; }

  // Set website URL
  async setUrl(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate input
      const validatedData = websiteUrlSchema.parse(req.body);

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

      // Set website URL
      const website = await websiteService.setWebsiteUrl(business.id, validatedData.url);

      return res.status(200).json({
        message: 'Website URL set successfully',
        website
      });
    } catch (error) {
      next(error);
    }
  }

  // Get website by business ID
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

      // Get website
      const website = await websiteService.getWebsiteByBusinessId(business.id);

      return res.status(200).json({
        website
      });
    } catch (error) {
      next(error);
    }
  }

  // Update website information
  async update(req: Request, res: Response, next: NextFunction) {
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

      // Validate input
      const validatedData = updateWebsiteSchema.parse(req.body);

      // Update website
      const website = await websiteService.updateWebsite(business.id, validatedData);

      return res.status(200).json({
        message: 'Website updated successfully',
        website
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete website
  async delete(req: Request, res: Response, next: NextFunction) {
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

      // Delete website
      await websiteService.deleteWebsite(business.id);

      return res.status(200).json({
        message: 'Website deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Crawl website
  async crawl(req: Request, res: Response, next: NextFunction) {
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

      // Crawl website
      const result = await websiteService.crawlWebsite(business.id);

      return res.status(200).json({
        message: 'Website crawled successfully',
        website: result.website,
        pagesCrawled: result.pagesCrawled
      });
    } catch (error) {
      next(error);
    }
  }

  // Recrawl website
  async recrawl(req: Request, res: Response, next: NextFunction) {
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

      // Recrawl website
      const result = await websiteService.recrawlWebsite(business.id);

      return res.status(200).json({
        message: 'Website recrawled successfully',
        website: result.website,
        pagesCrawled: result.pagesCrawled
      });
    } catch (error) {
      next(error);
    }
  }

  // Get website pages
  async getPages(req: Request, res: Response, next: NextFunction) {
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

      // Get website pages
      const pages = await websiteService.getWebsitePages(business.id);

      return res.status(200).json({
        pages
      });
    } catch (error) {
      next(error);
    }
  }
}

// Export singleton instance
export const websiteController = new WebsiteController();