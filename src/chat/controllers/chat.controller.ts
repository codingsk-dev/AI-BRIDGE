import { Request, Response, NextFunction } from 'express';
import { createChatSessionSchema, createChatMessageSchema } from '../validators/chat.validator';
import { chatService } from './services/chat.service';
import { logger } from '../../utils/logger';
import { authenticate } from '../../middleware/auth.middleware';

// Chat controller
export class ChatController {
  async createSession(...args: any[]) { return null as any; }
  async getBySessionToken(...args: any[]) { return null as any; }
  async createMessage(...args: any[]) { return null as any; }
  async getMessages(...args: any[]) { return null as any; }
  async endSession(...args: any[]) { return null as any; }
  async getByBusinessId(...args: any[]) { return null as any; }
  async getByVisitorId(...args: any[]) { return null as any; }
  async getActiveSessions(...args: any[]) { return null as any; }

  // Create chat session
  async createSession(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate input
      const validatedData = createChatSessionSchema.parse(req.body);

      // Get user ID from authenticated request (for business owner)
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Get business for user
      const business = await req.context.businessRepository.findByUserId(userId);
      if (!business) {
        return res.status(404).json({ error: 'Business not found' });
      }

      // Visitor ID would come from cookie or header in real implementation
      // For now, we'll generate a temporary visitor ID or use a dummy one
      // In a real implementation, this would be handled via middleware that tracks visitors
      const visitorId = validatedData.visitorId || `temp-visitor-${Date.now()}`;

      // Create chat session
      const chatSession = await chatService.createChatSession(visitorId, business.id);

      return res.status(201).json({
        message: 'Chat session created successfully',
        chatSession: {
          id: chatSession.id,
          sessionToken: chatSession.sessionToken,
          startedAt: chatSession.startedAt
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get chat session by session token (used by widget)
  async getBySessionToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionToken } = req.params;

      // Get chat session
      const chatSession = await chatService.getChatSessionBySessionToken(sessionToken);

      return res.status(200).json({
        chatSession
      });
    } catch (error) {
      next(error);
    }
  }

  // Get chat sessions by business ID
  async getByBusinessId(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Get business for user
      const business = await req.context.businessRepository.findByUserId(userId);
      if (!business) {
        return res.status(404).json({ error: 'Business not found' });
      }

      // Get chat sessions
      const chatSessions = await chatService.getChatSessionsByBusinessId(business.id);

      return res.status(200).json({
        chatSessions
      });
    } catch (error) {
      next(error);
    }
  }

  // Get chat sessions by visitor ID
  async getByVisitorId(req: Request, res: Response, next: NextFunction) {
    try {
      const { visitorId } = req.params;

      // Get chat sessions
      const chatSessions = await chatService.getChatSessionsByVisitorId(visitorId);

      return res.status(200).json({
        chatSessions
      });
    } catch (error) {
      next(error);
    }
  }

  // Create message
  async createMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { chatSessionId } = req.params;

      // Validate input
      const validatedData = createChatMessageSchema.parse(req.body);

      // Create message
      const message = await chatService.createMessage(
        chatSessionId,
        validatedData.content,
        validatedData.isFromUser
      );

      return res.status(201).json({
        message: 'Message created successfully',
        message
      });
    } catch (error) {
      next(error);
    }
  }

  // Get messages for chat session
  async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const { chatSessionId } = req.params;

      // Get messages
      const messages = await chatService.getMessagesByChatSessionId(chatSessionId);

      return res.status(200).json({
        messages
      });
    } catch (error) {
      next(error);
    }
  }

  // End chat session
  async endSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { chatSessionId } = req.params;
      const { satisfactionScore, feedback } = req.body;

      // Validate satisfactionScore if provided
      if (satisfactionScore !== undefined && (satisfactionScore < 1 || satisfactionScore > 5 || !Number.isInteger(satisfactionScore))) {
        return res.status(400).json({ error: 'Satisfaction score must be an integer between 1 and 5' });
      }

      // End chat session
      const chatSession = await chatService.endChatSession(chatSessionId, satisfactionScore, feedback);

      return res.status(200).json({
        message: 'Chat session ended successfully',
        chatSession
      });
    } catch (error) {
      next(error);
    }
  }

  // Get active chat sessions for business
  async getActiveSessions(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Get business for user
      const business = await req.context.businessRepository.findByUserId(userId);
      if (!business) {
        return res.status(404).json({ error: 'Business not found' });
      }

      // Get active chat sessions
      const activeSessions = await chatService.getActiveChatSessionsByBusinessId(business.id);

      return res.status(200).json({
        activeSessions
      });
    } catch (error) {
      next(error);
    }
  }
}

// Export singleton instance
export const chatController = new ChatController();