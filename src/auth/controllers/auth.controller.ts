import { Request, Response, NextFunction } from 'express';

export class AuthController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    return res.json({ message: 'auth works' });
  }
}
export const authController = new AuthController();
