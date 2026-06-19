import { Router } from 'express';
import { websiteController } from './controllers/website.controller';
import { validateRequest } from '../../middleware/validation.middleware';
import { websiteUrlSchema, updateWebsiteSchema } from './validators/website.validator';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Set website URL
router.post(
  '/url',
  validateRequest(websiteUrlSchema),
  websiteController.setUrl
);

// Get website by business ID
router.get(
  '/',
  websiteController.getByBusinessId
);

// Update website information
router.put(
  '/',
  validateRequest(updateWebsiteSchema),
  websiteController.update
);

// Delete website
router.delete(
  '/',
  websiteController.delete
);

// Crawl website
router.post(
  '/crawl',
  websiteController.crawl
);

// Recrawl website
router.post(
  '/recrawl',
  websiteController.recrawl
);

// Get website pages
router.get(
  '/pages',
  websiteController.getPages
);

export default router;