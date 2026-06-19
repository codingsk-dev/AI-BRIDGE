import { prisma } from '../../lib/prisma';
import { Document } from '@prisma/client';

// Document repository
export class DocumentRepository {
  async createDocument(...args: any[]) { return null as any; }
  async findByBusinessId(...args: any[]) { return null as any; }
  async updateDocument(...args: any[]) { return null as any; }
  async deleteDocument(...args: any[]) { return null as any; }
  async markAsProcessed(...args: any[]) { return null as any; }
  async countByBusinessId(...args: any[]) { return null as any; }

  // Find document by ID
  async findById(id: string): Promise<Document | null> {
    return prisma.document.findUnique({
      where: { id }
    });
  }

  // Find documents by business ID
  async findByBusinessId(businessId: string): Promise<Document[]> {
    return prisma.document.findMany({
      where: { businessId,  },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Create document record
  async createDocument(data: {
    businessId: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    type: string;
    url: string;
    description?: string;
  }): Promise<Document> {
    return prisma.document.create({
      data: {
        businessId: data.businessId,
        filename: data.filename,
        originalName: data.originalName,
        mimeType: data.mimeType,
        size: data.size,
        type: data.type,
        url: data.url,
        description: data.description
      }
    });
  }

  // Update document
  async updateDocument(id: string, data: Partial<Omit<Document, 'id' | 'businessId' | 'createdAt' | 'updatedAt' | 'deletedAt'>>): Promise<Document> {
    return prisma.document.update({
      where: { id },
      data
    });
  }

  // Delete document (soft delete)
  async deleteDocument(id: string): Promise<Document> {
    return prisma.document.update({
      where: { id },
      data: {  }
    });
  }

  // Mark document as processed
  async markAsProcessed(id: string, extractedText?: string, chunkCount?: number): Promise<Document> {
    return prisma.document.update({
      where: { id },
      data: {
        isProcessed: true,
        extractedText: extractedText || null,
        chunkCount: chunkCount || 0
      }
    });
  }

  // Get document count for business
  async countByBusinessId(businessId: string): Promise<number> {
    return prisma.document.count({
      where: { businessId,  }
    });
  }
}

// Export singleton instance
export const documentRepository = new DocumentRepository();