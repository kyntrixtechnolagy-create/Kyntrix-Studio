import { DocumentRepository } from '../repositories/document.repository';
import { Prisma } from '@prisma/client';
import { AppError } from '../middlewares/errorHandler';

const documentRepository = new DocumentRepository();

export class DocumentService {
  async createDocument(data: Prisma.DocumentCreateInput) {
    return documentRepository.create(data);
  }

  async getDocuments(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;
    const { documents, total } = await documentRepository.findAll(skip, limit, search);
    
    return {
      documents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getDocumentById(id: string) {
    const document = await documentRepository.findById(id);
    if (!document) {
      throw new AppError('Document not found', 404);
    }
    return document;
  }

  async updateDocument(id: string, data: Prisma.DocumentUpdateInput) {
    await this.getDocumentById(id);
    return documentRepository.update(id, data);
  }

  async deleteDocument(id: string) {
    await this.getDocumentById(id);
    return documentRepository.delete(id);
  }
}
