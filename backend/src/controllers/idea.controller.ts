import { Request, Response } from 'express';
import { IdeaService } from '../services/idea.service';

const ideaService = new IdeaService();

export class IdeaController {
  async createIdea(req: Request, res: Response) {
    const idea = await ideaService.createIdea(req.body);
    res.status(201).json({
      success: true,
      message: 'Idea created successfully',
      data: idea,
    });
  }

  async getIdeas(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;

    const result = await ideaService.getIdeas(page, limit, search);
    res.status(200).json({
      success: true,
      message: 'Ideas retrieved successfully',
      data: result,
    });
  }

  async getIdeaById(req: Request, res: Response) {
    const idea = await ideaService.getIdeaById(req.params.id as string);
    res.status(200).json({
      success: true,
      message: 'Idea retrieved successfully',
      data: idea,
    });
  }

  async updateIdea(req: Request, res: Response) {
    const idea = await ideaService.updateIdea(req.params.id as string, req.body);
    res.status(200).json({
      success: true,
      message: 'Idea updated successfully',
      data: idea,
    });
  }

  async deleteIdea(req: Request, res: Response) {
    await ideaService.deleteIdea(req.params.id as string);
    res.status(200).json({
      success: true,
      message: 'Idea deleted successfully',
      data: null,
    });
  }
}
