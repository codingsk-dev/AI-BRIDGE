import { Router } from 'express';
import { jobController } from './controllers/job.controller';
import { validateRequest } from '../../middleware/validation.middleware';
import { createJobSchema, updateJobSchema } from './validators/job.validator';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorization.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Create job
router.post(
  '/',
  validateRequest(createJobSchema),
  jobController.create
);

// Get job by ID
router.get(
  '/:id',
  jobController.getById
);

// Get jobs by business ID
router.get(
  '/business',
  jobController.getByBusinessId
);

// Get jobs by type
router.get(
  '/type/:type',
  jobController.getByType
);

// Get jobs by status
router.get(
  '/status/:status',
  jobController.getByStatus
);

// Get pending jobs
router.get(
  '/pending',
  jobController.getPending
);

// Update job
router.put(
  '/:id',
  validateRequest(updateJobSchema),
  jobController.update
);

// Delete job
router.delete(
  '/:id',
  jobController.delete
);

// Start job
router.post(
  '/:id/start',
  jobController.start
);

// Complete job
router.post(
  '/:id/complete',
  jobController.complete
);

// Fail job
router.post(
  '/:id/fail',
  jobController.fail
);

// Get job count
router.get(
  '/count',
  authorize(['ADMIN']),
  jobController.getCount
);

// Get job count by business ID
router.get(
  '/business/count',
  jobController.getCountByBusinessId
);

// Get job count by type
router.get(
  '/type/:type/count',
  jobController.getCountByType
);

// Get job count by status
router.get(
  '/status/:status/count',
  jobController.getCountByStatus
);

export default router;