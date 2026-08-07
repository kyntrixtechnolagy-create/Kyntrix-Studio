import { Request, Response } from 'express';
import { DocumentService } from '../services/document.service';

const documentService = new DocumentService();

export class DocumentController {
  async createDocument(req: Request, res: Response) {
    const document = await documentService.createDocument(req.body);
    res.status(201).json({
      success: true,
      message: 'Document created successfully',
      data: document,
    });
  }

  async getDocuments(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;

    const result = await documentService.getDocuments(page, limit, search);
    res.status(200).json({
      success: true,
      message: 'Documents retrieved successfully',
      data: result,
    });
  }

  async getDocumentById(req: Request, res: Response) {
    const document = await documentService.getDocumentById(req.params.id as string);
    res.status(200).json({
      success: true,
      message: 'Document retrieved successfully',
      data: document,
    });
  }

  async updateDocument(req: Request, res: Response) {
    const document = await documentService.updateDocument(req.params.id as string, req.body);
    res.status(200).json({
      success: true,
      message: 'Document updated successfully',
      data: document,
    });
  }

  async deleteDocument(req: Request, res: Response) {
    await documentService.deleteDocument(req.params.id as string);
    res.status(200).json({
      success: true,
      message: 'Document deleted successfully',
      data: null,
    });
  }
}
