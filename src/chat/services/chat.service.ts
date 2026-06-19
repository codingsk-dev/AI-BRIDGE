import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { chatRepository } from './repositories/chat.repository';
import { businessRepository } from '../business/repositories/business.repository';
import { logger } from '../../utils/logger';
import { ChatEvent } from './events/chat.event';
import { chatListener } from './listeners/chat.listener';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

// Chat service
export class ChatService {
  async createChatSession(...args: any[]) { return null as any; }
  async getChatSessionBySessionToken(...args: any[]) { return null as any; }
  async getChatSessionsByBusinessId(...args: any[]) { return null as any; }
  async getChatSessionsByVisitorId(...args: any[]) { return null as any; }
  async createMessage(...args: any[]) { return null as any; }
  async getMessagesByChatSessionId(...args: any[]) { return null as any; }
  async endChatSession(...args: any[]) { return null as any; }
  async getActiveChatSessionsByBusinessId(...args: any[]) { return null as any; }

  // Create visitor (for anonymous users)
  async createVisitor(data: {
    sessionId: string;
    ipAddress?: string;
    userAgent?: string;
    country?: string;
    city?: string;
  }) {
    // Check if visitor already exists
    const existingVisitor = await chatRepository.findVisitorBySessionId(data.sessionId);
    if (existingVisitor) {
      // Update last visit
      await prisma.visitor.update({
        where: { id: existingVisitor.id },
        data: {
          lastVisit: new Date(),
          visitCount: {
            increment: 1
          }
        }
      });
      return existingVisitor;
    }

    // Create new visitor
    const visitor = await chatRepository.createVisitor(data);

    // Emit visitor created event (if needed)
    // TODO: Emit event to event bus
    // For now, handle synchronously

    return visitor;
  }

  // Create chat session
  async createChatSession(visitorId: string, businessId: string) {
    // Verify business exists
    const business = await businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    // Generate unique session token
    const sessionToken = uuidv4();

    // Create chat session
    const chatSession = await chatRepository.createChatSession({
      visitorId,
      businessId,
      sessionToken
    });

    // Emit chat session created event
    const chatSessionCreatedEvent = new ChatEvent.ChatSessionCreatedEvent(
      chatSession.id,
      visitorId,
      businessId,
      sessionToken
    );

    // TODO: Emit event to event bus
    // For now, handle synchronously
    await chatListener.onChatSessionCreated(chatSessionCreatedEvent);

    return chatSession;
  }

  // Get chat session by ID
  async getChatSessionById(id: string) {
    const chatSession = await chatRepository.findById(id);
    if (!chatSession) {
      throw new Error('Chat session not found');
    }
    return chatSession;
  }

  // Get chat session by session token
  async getChatSessionBySessionToken(sessionToken: string) {
    const chatSession = await chatRepository.findBySessionToken(sessionToken);
    if (!chatSession) {
      throw new Error('Chat session not found');
    }
    return chatSession;
  }

  // Get chat sessions by business ID
  async getChatSessionsByBusinessId(businessId: string) {
    // Verify business exists
    const business = await businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    return chatRepository.findByBusinessId(businessId);
  }

  // Get chat sessions by visitor ID
  async getChatSessionsByVisitorId(visitorId: string) {
    return chatRepository.findByVisitorId(visitorId);
  }

  // Create message
  async createMessage(chatSessionId: string, content: string, isFromUser: boolean = true) {
    // Check if chat session exists
    const chatSession = await chatRepository.findById(chatSessionId);
    if (!chatSession) {
      throw new Error('Chat session not found');
    }

    // Create message
    const message = await chatRepository.createMessage({
      chatSessionId,
      content,
      isFromUser
    });

    // Update message count for chat session
    const messageCount = await chatRepository.getMessageCountByChatSessionId(chatSessionId);
    await chatRepository.updateMessageCount(chatSessionId, messageCount);

    // Emit message created event
    const messageCreatedEvent = new ChatEvent.MessageCreatedEvent(
      message.id,
      chatSessionId,
      content,
      isFromUser
    );

    // TODO: Emit event to event bus
    // For now, handle synchronously
    await chatListener.onMessageCreated(messageCreatedEvent);

    // AI SERVICE PROXY LOGIC
    if (isFromUser) {
      try {
        const aiServiceUrl = process.env.EXTERNAL_LLM_SERVICE_URL || 'http://localhost:8000';
        // Forward message to FastAPI AI Service
        const aiResponse = await axios.post(`${aiServiceUrl}/chat`, {
          session_id: chatSessionId,
          message: content
        });
        
        // Save AI response as a new message
        if (aiResponse.data && aiResponse.data.response) {
          await chatRepository.createMessage({
            chatSessionId,
            content: aiResponse.data.response,
            isFromUser: false
          });
          // Update count again
          const newCount = await chatRepository.getMessageCountByChatSessionId(chatSessionId);
          await chatRepository.updateMessageCount(chatSessionId, newCount);
        }
      } catch (err) {
        logger.error('Failed to communicate with AI Service', err);
      }
    }

    return message;
  }

  // Get messages for chat session
  async getMessagesByChatSessionId(chatSessionId: string) {
    return chatRepository.getMessagesByChatSessionId(chatSessionId);
  }

  // End chat session
  async endChatSession(chatSessionId: string, satisfactionScore?: number, feedback?: string) {
    // Check if chat session exists
    const chatSession = await chatRepository.findById(chatSessionId);
    if (!chatSession) {
      throw new Error('Chat session not found');
    }

    // End chat session
    const endedSession = await chatRepository.endChatSession(chatSessionId, satisfactionScore, feedback);

    // Emit chat session ended event
    const chatSessionEndedEvent = new ChatEvent.ChatSessionEndedEvent(
      chatSessionId,
      satisfactionScore,
      feedback
    );

    // TODO: Emit event to event bus
    // For now, handle synchronously
    await chatListener.onChatSessionEnded(chatSessionEndedEvent);

    return endedSession;
  }

  // Get active chat sessions for business (sessions that haven't ended)
  async getActiveChatSessionsByBusinessId(businessId: string) {
    // Verify business exists
    const business = await businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    return prisma.chatSession.findMany({
      where: {
        businessId,
        endedAt: null
      },
      orderBy: { startedAt: 'desc' }
    });
  }
}

// Export singleton instance
export const chatService = new ChatService();