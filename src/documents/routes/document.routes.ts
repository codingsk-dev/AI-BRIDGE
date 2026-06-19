import { Router } from 'express';
import { documentController } from './controllers/document.controller';
import { validateRequest } from '../../middleware/validation.middleware';
import { uploadDocumentSchema, updateDocumentSchema } from './validators/document.validator';
import { authenticate } from '../../middleware/auth.middleware';
import { upload } from './services/document.service';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Upload document
router.post(
  '/upload',
  upload.single('file'),
  documentController.upload
);

// Get document by ID
router.get(
  '/:id',
  documentController.getById
);

// Get documents by user (business)
router.get(
  '/',
  documentController.getByUser
);

// Update document
router.put(
  '/:id',
  validateRequest(updateDocumentSchema),
  documentController.update
);

// Delete document
router.delete(
  '/:id',
  documentController.delete
);

// Mark document as processed
router.post(
  '/:id/process',
  documentController.markAsProcessed
);

// Get document count for user
router.get(
  '/count',
  documentController.getCount
);

export default router;