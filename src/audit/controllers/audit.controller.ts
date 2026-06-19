import { Request, Response, NextFunction } from 'express';

export class AuditController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    return res.json({ message: 'audit works' });
  }
}
export const auditController = new AuditController();
