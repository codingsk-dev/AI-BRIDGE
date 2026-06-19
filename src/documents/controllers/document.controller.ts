import { Request, Response, NextFunction } from 'express';
import { uploadDocumentSchema, updateDocumentSchema } from '../validators/document.validator';
import { documentService } from './services/document.service';
import { logger } from '../../utils/logger';
import { authenticate } from '../../middleware/auth.middleware';
import { upload } from './services/document.service';

// Document controller
export class DocumentController {
  async upload(...args: any[]) { return null as any; }
  async getById(...args: any[]) { return null as any; }
  async getByUser(...args: any[]) { return null as any; }
  async update(...args: any[]) { return null as any; }
  async delete(...args: any[]) { return null as any; }
  async markAsProcessed(...args: any[]) { return null as any; }
  async getCount(...args: any[]) { return null as any; }

  // Upload document
  async upload(req: Request, res: Response, next: NextFunction) {
    try {
      // Use multer middleware for file upload
      upload.single('file')(req, res, async (err: any) => {
        if (err) {
          if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: `File upload error: ${err.message}` });
          } else {
            return res.status(400).json({ error: err.message });
          }
        }

        try {
          // Get user ID from authenticated request
          const userId = req.user?.id;
          if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
          }

          // Get business for user
          const business = await req.context.businessRepository.findByUserId(userId);
          if (!business) {
            return res.status(404).json({ error: 'Business not found' });
          }

          // Validate metadata
          const validatedData = uploadDocumentSchema.parse(req.body);

          // Upload document
          const document = await documentService.uploadDocument(
            business.id,
            req.file,
            validatedData.description
          );

          return res.status(201).json({
            message: 'Document uploaded successfully',
            document
          });
        } catch (error) {
          next(error);
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get document by ID
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Get document
      const document = await documentService.getDocumentById(id);

      // Optional: Check if user owns the document's business
      // const userId = req.user?.id;
      // if (userId) {
      //   const business = await req.context.businessRepository.findByUserId(userId);
      //   if (!business || document.businessId !== business.id) {
      //     return res.status(403).json({ error: 'Forbidden' });
      //   }
      // }

      return res.status(200).json({
        document
      });
    } catch (error) {
      next(error);
    }
  }

  // Get documents by user (business)
  async getByUser(req: Request, res: Response, next: NextFunction) {
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

      const documents = await documentService.getDocumentsByBusinessId(business.id);

      return res.status(200).json({
        documents
      });
    } catch (error) {
      next(error);
    }
  }

  // Update document
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Validate input
      const validatedData = updateDocumentSchema.parse(req.body);

      // Update document
      const document = await documentService.updateDocument(id, validatedData);

      return res.status(200).json({
        message: 'Document updated successfully',
        document
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete document
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Delete document
      await documentService.deleteDocument(id);

      return res.status(200).json({
        message: 'Document deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Mark document as processed
  async markAsProcessed(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { extractedText, chunkCount } = req.body;

      // Mark document as processed
      const document = await documentService.markAsProcessed(id, extractedText, chunkCount);

      return res.status(200).json({
        message: 'Document marked as processed successfully',
        document
      });
    } catch (error) {
      next(error);
    }
  }

  // Get document count for user
  async getCount(req: Request, res: Response, next: NextFunction) {
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

      const count = await documentService.getDocumentCount(business.id);

      return res.status(200).json({
        count
      });
    } catch (error) {
      next(error);
    }
  }
}

// Export singleton instance
export const documentController = new DocumentController();