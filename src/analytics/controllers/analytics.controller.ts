import { Request, Response, NextFunction } from 'express';

export class AnalyticsController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    return res.json({ message: 'analytics works' });
  }
}
export const analyticsController = new AnalyticsController();
