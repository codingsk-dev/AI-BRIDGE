import { Request, Response, NextFunction } from 'express';
import { createWidgetSchema, updateWidgetSchema } from '../validators/widget.validator';
import { widgetService } from './services/widget.service';
import { logger } from '../../utils/logger';
import { authenticate } from '../../middleware/auth.middleware';

// Widget controller
export class WidgetController {
  async getByBusinessId(...args: any[]) { return null as any; }
  async create(...args: any[]) { return null as any; }
  async update(...args: any[]) { return null as any; }
  async delete(...args: any[]) { return null as any; }

  // Get widget for business
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

      // Get widget
      const widget = await widgetService.getWidgetByBusinessId(business.id);

      return res.status(200).json({
        widget
      });
    } catch (error) {
      next(error);
    }
  }

  // Create widget for business
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
      const validatedData = createWidgetSchema.parse(req.body);

      // Create widget
      const widget = await widgetService.createWidget(business.id, validatedData);

      return res.status(201).json({
        message: 'Widget created successfully',
        widget
      });
    } catch (error) {
      next(error);
    }
  }

  // Update widget
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
      const validatedData = updateWidgetSchema.parse(req.body);

      // Update widget
      const widget = await widgetService.updateWidget(business.id, validatedData);

      return res.status(200).json({
        message: 'Widget updated successfully',
        widget
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete widget
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

      // Delete widget
      await widgetService.deleteWidget(business.id);

      return res.status(200).json({
        message: 'Widget deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

// Export singleton instance
export const widgetController = new WidgetController();