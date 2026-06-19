import { Router } from 'express';
import { businessController } from '../controllers/business.controller';

const router = Router();

router.get('/', businessController.getAll || ((req, res) => res.json({})));

export default router;
