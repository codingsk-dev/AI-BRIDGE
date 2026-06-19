import { Request, Response, NextFunction } from 'express';

export class BusinessSettingsController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    return res.json({ message: 'business-settings works' });
  }
}
export const businessSettingsController = new BusinessSettingsController();
