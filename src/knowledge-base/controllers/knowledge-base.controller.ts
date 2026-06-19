import { Request, Response, NextFunction } from 'express';
import { updateKnowledgeBaseSchema } from '../validators/knowledge-base.validator';
import { knowledgeBaseService } from './services/knowledge-base.service';
import { logger } from '../../utils/logger';
import { authenticate } from '../../middleware/auth.middleware';

// Knowledge base controller
export class KnowledgeBaseController {
  async getByBusinessId(...args: any[]) { return null as any; }
  async create(...args: any[]) { return null as any; }
  async update(...args: any[]) { return null as any; }
  async delete(...args: any[]) { return null as any; }
  async addDocument(...args: any[]) { return null as any; }
  async removeDocument(...args: any[]) { return null as any; }
  async addPage(...args: any[]) { return null as any; }
  async removePage(...args: any[]) { return null as any; }
  async setReady(...args: any[]) { return null as any; }
  async getStats(...args: any[]) { return null as any; }

  // Get knowledge base for business
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

      // Get knowledge base
      const knowledgeBase = await knowledgeBaseService.getKnowledgeBaseByBusinessId(business.id);

      return res.status(200).json({
        knowledgeBase
      });
    } catch (error) {
      next(error);
    }
  }

  // Create knowledge base for business
  async create(req: Request, res: Response, next: NextFunction) {
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
      const validatedData = updateKnowledgeBaseSchema.parse(req.body);

      // Create knowledge base
      const knowledgeBase = await knowledgeBaseService.createKnowledgeBase(business.id, validatedData);

      return res.status(201).json({
        message: 'Knowledge base created successfully',
        knowledgeBase
      });
    } catch (error) {
      next(error);
    }
  }

  // Update knowledge base
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
      const validatedData = updateKnowledgeBaseSchema.parse(req.body);

      // Update knowledge base
      const knowledgeBase = await knowledgeBaseService.updateKnowledgeBase(business.id, validatedData);

      return res.status(200).json({
        message: 'Knowledge base updated successfully',
        knowledgeBase
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete knowledge base
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

      // Delete knowledge base
      await knowledgeBaseService.deleteKnowledgeBase(business.id);

      return res.status(200).json({
        message: 'Knowledge base deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Add document to knowledge base
  async addDocument(req: Request, res: Response, next: NextFunction) {
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

      // Add document to knowledge base
      const knowledgeBase = await knowledgeBaseService.addDocumentToKnowledgeBase(business.id);

      return res.status(200).json({
        message: 'Document added to knowledge base successfully',
        knowledgeBase
      });
    } catch (error) {
      next(error);
    }
  }

  // Remove document from knowledge base
  async removeDocument(req: Request, res: Response, next: NextFunction) {
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

      // Remove document from knowledge base
      const knowledgeBase = await knowledgeBaseService.removeDocumentFromKnowledgeBase(business.id);

      return res.status(200).json({
        message: 'Document removed from knowledge base successfully',
        knowledgeBase
      });
    } catch (error) {
      next(error);
    }
  }

  // Add page to knowledge base
  async addPage(req: Request, res: Response, next: NextFunction) {
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

      // Add page to knowledge base
      const knowledgeBase = await knowledgeBaseService.addPageToKnowledgeBase(business.id);

      return res.status(200).json({
        message: 'Page added to knowledge base successfully',
        knowledgeBase
      });
    } catch (error) {
      next(error);
    }
  }

  // Remove page from knowledge base
  async removePage(req: Request, res: Response, next: NextFunction) {
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

      // Remove page from knowledge base
      const knowledgeBase = await knowledgeBaseService.removePageFromKnowledgeBase(business.id);

      return res.status(200).json({
        message: 'Page removed from knowledge base successfully',
        knowledgeBase
      });
    } catch (error) {
      next(error);
    }
  }

  // Set knowledge base as ready
  async setReady(req: Request, res: Response, next: NextFunction) {
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

      const { isReady } = req.body;

      // Validate isReady is boolean
      if (typeof isReady !== 'boolean') {
        return res.status(400).json({ error: 'isReady must be a boolean' });
      }

      // Set knowledge base as ready
      const knowledgeBase = await knowledgeBaseService.setKnowledgeBaseReady(business.id, isReady);

      return res.status(200).json({
        message: `Knowledge base marked as ${isReady ? 'ready' : 'not ready'} successfully`,
        knowledgeBase
      });
    } catch (error) {
      next(error);
    }
  }

  // Get knowledge base stats
  async getStats(req: Request, res: Response, next: NextFunction) {
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

      // Get knowledge base stats
      const stats = await knowledgeBaseService.getKnowledgeBaseStats(business.id);

      return res.status(200).json({
        knowledgeBase: stats
      });
    } catch (error) {
      next(error);
    }
  }
}

// Export singleton instance
export const knowledgeBaseController = new KnowledgeBaseController();