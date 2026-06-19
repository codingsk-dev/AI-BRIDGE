import { Router } from 'express';
import { knowledgeBaseController } from './controllers/knowledge-base.controller';
import { validateRequest } from '../../middleware/validation.middleware';
import { updateKnowledgeBaseSchema } from './validators/knowledge-base.validator';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get knowledge base for business
router.get(
  '/',
  knowledgeBaseController.getByBusinessId
);

// Create knowledge base for business
router.post(
  '/',
  validateRequest(updateKnowledgeBaseSchema),
  knowledgeBaseController.create
);

// Update knowledge base
router.put(
  '/',
  validateRequest(updateKnowledgeBaseSchema),
  knowledgeBaseController.update
);

// Delete knowledge base
router.delete(
  '/',
  knowledgeBaseController.delete
);

// Add document to knowledge base
router.post(
  '/document',
  knowledgeBaseController.addDocument
);

// Remove document from knowledge base
router.delete(
  '/document',
  knowledgeBaseController.removeDocument
);

// Add page to knowledge base
router.post(
  '/page',
  knowledgeBaseController.addPage
);

// Remove page from knowledge base
router.delete(
  '/page',
  knowledgeBaseController.removePage
);

// Set knowledge base as ready
router.post(
  '/ready',
  knowledgeBaseController.setReady
);

// Get knowledge base stats
router.get(
  '/stats',
  knowledgeBaseController.getStats
);

export default router;