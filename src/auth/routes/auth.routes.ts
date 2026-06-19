import { Router } from 'express';
import { authController } from '../controllers/auth.controller';

const router = Router();

router.get('/', authController.getAll || ((req, res) => res.json({})));

export default router;
