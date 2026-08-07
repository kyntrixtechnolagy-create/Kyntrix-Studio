import { Request, Response } from 'express';
import { ProjectService } from '../services/project.service';

const projectService = new ProjectService();

export class ProjectController {
  async createProject(req: Request, res: Response) {
    const project = await projectService.createProject(req.body);
    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  }

  async getProjects(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;

    const result = await projectService.getProjects(page, limit, search);
    res.status(200).json({
      success: true,
      message: 'Projects retrieved successfully',
      data: result,
    });
  }

  async getProjectById(req: Request, res: Response) {
    const project = await projectService.getProjectById(req.params.id as string);
    res.status(200).json({
      success: true,
      message: 'Project retrieved successfully',
      data: project,
    });
  }

  async updateProject(req: Request, res: Response) {
    const project = await projectService.updateProject(req.params.id as string, req.body);
    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  }

  async deleteProject(req: Request, res: Response) {
    await projectService.deleteProject(req.params.id as string);
    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
      data: null,
    });
  }
}
