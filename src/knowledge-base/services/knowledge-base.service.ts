import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { knowledgeBaseRepository } from './repositories/knowledge-base.repository';
import { businessRepository } from '../business/repositories/business.repository';
import { documentRepository } from '../documents/repositories/document.repository';
import { websiteRepository } from '../website/repositories/website.repository';
import { logger } from '../../utils/logger';
import { KnowledgeBaseEvent } from './events/knowledge-base.event';
import { knowledgeBaseListener } from './listeners/knowledge-base.listener';

// Knowledge base service
export class KnowledgeBaseService {
  async getKnowledgeBaseByBusinessId(...args: any[]) { return null as any; }
  async createKnowledgeBase(...args: any[]) { return null as any; }
  async updateKnowledgeBase(...args: any[]) { return null as any; }
  async deleteKnowledgeBase(...args: any[]) { return null as any; }
  async addDocumentToKnowledgeBase(...args: any[]) { return null as any; }
  async removeDocumentFromKnowledgeBase(...args: any[]) { return null as any; }
  async addPageToKnowledgeBase(...args: any[]) { return null as any; }
  async removePageFromKnowledgeBase(...args: any[]) { return null as any; }
  async setKnowledgeBaseReady(...args: any[]) { return null as any; }
  async getKnowledgeBaseStats(...args: any[]) { return null as any; }

  // Get knowledge base for business
  async getKnowledgeBaseByBusinessId(businessId: string) {
    // Verify business exists
    const business = await businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    let knowledgeBase = await knowledgeBaseRepository.findByBusinessId(businessId);

    // If knowledge base doesn't exist, create a default one
    if (!knowledgeBase) {
      knowledgeBase = await knowledgeBaseRepository.createKnowledgeBase({
        businessId
      });
    }

    return knowledgeBase;
  }

  // Create knowledge base for business
  async createKnowledgeBase(businessId: string, data: {
    name?: string;
    description?: string;
  }) {
    // Verify business exists
    const business = await businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    // Check if knowledge base already exists
    const existing = await knowledgeBaseRepository.findByBusinessId(businessId);
    if (existing) {
      throw new Error('Knowledge base already exists for this business');
    }

    // Create knowledge base
    const knowledgeBase = await knowledgeBaseRepository.createKnowledgeBase({
      businessId,
      name: data.name,
      description: data.description
    });

    // Emit knowledge base created event
    const knowledgeBaseCreatedEvent = new KnowledgeBaseEvent.KnowledgeBaseCreatedEvent(
      knowledgeBase.id,
      businessId
    );

    // TODO: Emit event to event bus
    // For now, handle synchronously
    await knowledgeBaseListener.onKnowledgeBaseCreated(knowledgeBaseCreatedEvent);

    return knowledgeBase;
  }

  // Update knowledge base
  async updateKnowledgeBase(businessId: string, data: {
    name?: string;
    description?: string;
  }) {
    // Get knowledge base for business
    const knowledgeBase = await knowledgeBaseRepository.findByBusinessId(businessId);
    if (!knowledgeBase) {
      throw new Error('Knowledge base not found for business');
    }

    // Update knowledge base
    const updatedKnowledgeBase = await knowledgeBaseRepository.updateKnowledgeBase(knowledgeBase.id, data);

    // Emit knowledge base updated event
    const knowledgeBaseUpdatedEvent = new KnowledgeBaseEvent.KnowledgeBaseUpdatedEvent(
      knowledgeBase.id,
      data
    );

    // TODO: Emit event to event bus
    // For now, handle synchronously
    await knowledgeBaseListener.onKnowledgeBaseUpdated(knowledgeBaseUpdatedEvent);

    return updatedKnowledgeBase;
  }

  // Delete knowledge base
  async deleteKnowledgeBase(businessId: string) {
    // Get knowledge base for business
    const knowledgeBase = await knowledgeBaseRepository.findByBusinessId(businessId);
    if (!knowledgeBase) {
      throw new Error('Knowledge base not found for business');
    }

    // Delete knowledge base
    const deletedKnowledgeBase = await knowledgeBaseRepository.deleteKnowledgeBase(knowledgeBase.id);

    // Emit knowledge base deleted event
    const knowledgeBaseDeletedEvent = new KnowledgeBaseEvent.KnowledgeBaseDeletedEvent(
      knowledgeBase.id
    );

    // TODO: Emit event to event bus
    // For now, handle synchronously
    await knowledgeBaseListener.onKnowledgeBaseDeleted(knowledgeBaseDeletedEvent);

    return deletedKnowledgeBase;
  }

  // Update knowledge base counts when document is added
  async addDocumentToKnowledgeBase(businessId: string) {
    // Get knowledge base for business
    const knowledgeBase = await knowledgeBaseRepository.findByBusinessId(businessId);
    if (!knowledgeBase) {
      throw new Error('Knowledge base not found for business');
    }

    // Update document count
    const updatedKnowledgeBase = await knowledgeBaseRepository.incrementDocumentCount(knowledgeBase.id);

    // Emit knowledge base updated event
    const knowledgeBaseUpdatedEvent = new KnowledgeBaseEvent.KnowledgeBaseUpdatedEvent(
      knowledgeBase.id,
      { documentCount: updatedKnowledgeBase.documentCount }
    );

    // TODO: Emit event to event bus
    // For now, handle synchronously
    await knowledgeBaseListener.onKnowledgeBaseUpdated(knowledgeBaseUpdatedEvent);

    return updatedKnowledgeBase;
  }

  // Update knowledge base counts when document is removed
  async removeDocumentFromKnowledgeBase(businessId: string) {
    // Get knowledge base for business
    const knowledgeBase = await knowledgeBaseRepository.findByBusinessId(businessId);
    if (!knowledgeBase) {
      throw new Error('Knowledge base not found for business');
    }

    // Update document count
    const updatedKnowledgeBase = await knowledgeBaseRepository.decrementDocumentCount(knowledgeBase.id);

    // Emit knowledge base updated event
    const knowledgeBaseUpdatedEvent = new KnowledgeBaseEvent.KnowledgeBaseUpdatedEvent(
      knowledgeBase.id,
      { documentCount: updatedKnowledgeBase.documentCount }
    );

    // TODO: Emit event to event bus
    // For now, handle synchronously
    await knowledgeBaseListener.onKnowledgeBaseUpdated(knowledgeBaseUpdatedEvent);

    return updatedKnowledgeBase;
  }

  // Update knowledge base counts when page is added
  async addPageToKnowledgeBase(businessId: string) {
    // Get knowledge base for business
    const knowledgeBase = await knowledgeBaseRepository.findByBusinessId(businessId);
    if (!knowledgeBase) {
      throw new Error('Knowledge base not found for business');
    }

    // Update page count
    const updatedKnowledgeBase = await knowledgeBaseRepository.incrementPageCount(knowledgeBase.id);

    // Emit knowledge base updated event
    const knowledgeBaseUpdatedEvent = new KnowledgeBaseEvent.KnowledgeBaseUpdatedEvent(
      knowledgeBase.id,
      { pageCount: updatedKnowledgeBase.pageCount }
    );

    // TODO: Emit event to event bus
    // For now, handle synchronously
    await knowledgeBaseListener.onKnowledgeBaseUpdated(knowledgeBaseUpdatedEvent);

    return updatedKnowledgeBase;
  }

  // Update knowledge base counts when page is removed
  async removePageFromKnowledgeBase(businessId: string) {
    // Get knowledge base for business
    const knowledgeBase = await knowledgeBaseRepository.findByBusinessId(businessId);
    if (!knowledgeBase) {
      throw new Error('Knowledge base not found for business');
    }

    // Update page count
    const updatedKnowledgeBase = await knowledgeBaseRepository.decrementPageCount(knowledgeBase.id);

    // Emit knowledge base updated event
    const knowledgeBaseUpdatedEvent = new KnowledgeBaseEvent.KnowledgeBaseUpdatedEvent(
      knowledgeBase.id,
      { pageCount: updatedKnowledgeBase.pageCount }
    );

    // TODO: Emit event to event bus
    // For now, handle synchronously
    await knowledgeBaseListener.onKnowledgeBaseUpdated(knowledgeBaseUpdatedEvent);

    return updatedKnowledgeBase;
  }

  // Set knowledge base as ready
  async setKnowledgeBaseReady(businessId: string, isReady: boolean) {
    // Get knowledge base for business
    const knowledgeBase = await knowledgeBaseRepository.findByBusinessId(businessId);
    if (!knowledgeBase) {
      throw new Error('Knowledge base not found for business');
    }

    // Set knowledge base as ready
    const updatedKnowledgeBase = await knowledgeBaseRepository.setReady(knowledgeBase.id, isReady);

    // Emit knowledge base updated event
    const knowledgeBaseUpdatedEvent = new KnowledgeBaseEvent.KnowledgeBaseUpdatedEvent(
      knowledgeBase.id,
      { isReady }
    );

    // TODO: Emit event to event bus
    // For now, handle synchronously
    await knowledgeBaseListener.onKnowledgeBaseUpdated(knowledgeBaseUpdatedEvent);

    return updatedKnowledgeBase;
  }

  // Get knowledge base stats
  async getKnowledgeBaseStats(businessId: string) {
    // Get knowledge base for business
    const knowledgeBase = await knowledgeBaseRepository.findByBusinessId(businessId);
    if (!knowledgeBase) {
      throw new Error('Knowledge base not found for business');
    }

    // Get document count
    const documentCount = await documentRepository.countByBusinessId(businessId);

    // Get page count
    const website = await websiteRepository.findByBusinessId(businessId);
    const pageCount = website ? await prisma.websitePage.count({
      where: { websiteId: website.id }
    }) : 0;

    return {
      id: knowledgeBase.id,
      name: knowledgeBase.name,
      description: knowledgeBase.description,
      documentCount,
      pageCount,
      chunkCount: knowledgeBase.chunkCount,
      isReady: knowledgeBase.isReady,
      createdAt: knowledgeBase.createdAt,
      updatedAt: knowledgeBase.updatedAt
    };
  }
}

// Export singleton instance
export const knowledgeBaseService = new KnowledgeBaseService();