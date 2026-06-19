import { Request, Response, NextFunction } from 'express';

export class BusinessController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    return res.json({ message: 'business works' });
  }
}
export const businessController = new BusinessController();
