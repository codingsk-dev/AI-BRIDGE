import { Router } from 'express';
import { auditController } from '../controllers/audit.controller';

const router = Router();

router.get('/', auditController.getAll || ((req, res) => res.json({})));

export default router;
