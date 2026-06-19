import { documentRepository } from './repositories/document.repository';
import { businessRepository } from '../business/repositories/business.repository';
import { logger } from '../../utils/logger';
import { DocumentEvent } from './events/document.event';
import { documentListener } from './listeners/document.listener';
import multer from 'multer';
import path from 'path';
import { config } from '../../config';
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = config.uploadDir || './uploads';
    // Ensure upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = path.basename(file.originalname, ext) + '-' + uniqueSuffix + ext;
    cb(null, filename);
  }
});

// File filter
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Allow specific file types
  const allowedTypes = ['.pdf', '.docx', '.txt'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOCX, and TXT files are allowed.'));
  }
};

// Multer instance
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Document service
export class DocumentService {
  async uploadDocument(...args: any[]) { return null as any; }
  async getDocumentById(...args: any[]) { return null as any; }
  async getDocumentsByBusinessId(...args: any[]) { return null as any; }
  async updateDocument(...args: any[]) { return null as any; }
  async deleteDocument(...args: any[]) { return null as any; }
  async markAsProcessed(...args: any[]) { return null as any; }
  async getDocumentCount(...args: any[]) { return null as any; }

  // Upload document
  async uploadDocument(businessId: string, file: Express.Multer.File, description?: string) {
    // Verify business exists
    const business = await businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    // Determine document type from file extension
    const ext = path.extname(file.originalname).toLowerCase();
    let type: string;
    switch (ext) {
      case '.pdf':
        type = 'PDF';
        break;
      case '.docx':
        type = 'DOCX';
        break;
      case '.txt':
        type = 'TXT';
        break;
      default:
        throw new Error('Unsupported file type');
    }

    // Create document record
    const document = await documentRepository.createDocument({
      businessId,
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      type,
      url: `/uploads/${file.filename}`, // Relative URL for serving
      description
    });

    // Emit document uploaded event
    const documentUploadedEvent = new DocumentEvent.DocumentUploadedEvent(
      document.id,
      businessId,
      file.originalname,
      file.size,
      type
    );

    // TODO: Emit event to event bus
    // For now, handle synchronously
    await documentListener.onDocumentUploaded(documentUploadedEvent);

    // AI SERVICE PROXY LOGIC
    try {
      const aiServiceUrl = process.env.EXTERNAL_DOCUMENT_SERVICE_URL || 'http://localhost:8000';
      const fileStream = fs.createReadStream(file.path);
      
      const formData = new FormData();
      formData.append('file', fileStream);
      formData.append('document_id', document.id);
      formData.append('business_id', businessId);
      
      // Forward to FastAPI for processing, chunking, and embedding
      await axios.post(`${aiServiceUrl}/process-document`, formData, {
        headers: {
          ...formData.getHeaders()
        }
      });
      
      // Mark as processed in local DB
      await this.markAsProcessed(document.id);
    } catch (err) {
      logger.error('Failed to communicate with AI Service for document processing', err);
    }

    return document;
  }

  // Get document by ID
  async getDocumentById(id: string) {
    const document = await documentRepository.findById(id);
    if (!document) {
      throw new Error('Document not found');
    }
    return document;
  }

  // Get documents by business ID
  async getDocumentsByBusinessId(businessId: string) {
    // Verify business exists
    const business = await businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    return documentRepository.findByBusinessId(businessId);
  }

  // Update document
  async updateDocument(id: string, data: {
    description?: string;
    isProcessed?: boolean;
  }) {
    // Check if document exists
    const existing = await documentRepository.findById(id);
    if (!existing) {
      throw new Error('Document not found');
    }

    return documentRepository.updateDocument(id, data);
  }

  // Delete document
  async deleteDocument(id: string) {
    // Check if document exists
    const existing = await documentRepository.findById(id);
    if (!existing) {
      throw new Error('Document not found');
    }

    return documentRepository.deleteDocument(id);
  }

  // Mark document as processed
  async markAsProcessed(id: string, extractedText?: string, chunkCount?: number) {
    // Check if document exists
    const existing = await documentRepository.findById(id);
    if (!existing) {
      throw new Error('Document not found');
    }

    return documentRepository.markAsProcessed(id, extractedText, chunkCount);
  }

  // Get document count for business
  async getDocumentCount(businessId: string) {
    // Verify business exists
    const business = await businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    return documentRepository.countByBusinessId(businessId);
  }
}

// Export singleton instance
export const documentService = new DocumentService();