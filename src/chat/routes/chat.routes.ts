import { Router } from 'express';
import { chatController } from './controllers/chat.controller';
import { validateRequest } from '../../middleware/validation.middleware';
import { createChatSessionSchema, createChatMessageSchema } from './validators/chat.validator';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

// Routes that don't require authentication (used by widget/public)
router.post(
  '/session',
  validateRequest(createChatSessionSchema),
  chatController.createSession
);

router.get(
  '/session/:sessionToken',
  chatController.getBySessionToken
);

router.post(
  '/:chatSessionId/message',
  validateRequest(createChatMessageSchema),
  chatController.createMessage
);

router.get(
  '/:chatSessionId/messages',
  chatController.getMessages
);

router.post(
  '/:chatSessionId/end',
  chatController.endSession
);

// Routes that require authentication (business owner only)
router.use(authenticate);

router.get(
  '/business',
  chatController.getByBusinessId
);

router.get(
  '/visitor/:visitorId',
  chatController.getByVisitorId
);

router.get(
  '/active-sessions',
  chatController.getActiveSessions
);

export default router;