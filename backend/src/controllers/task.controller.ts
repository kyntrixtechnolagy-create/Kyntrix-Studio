import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';

const taskService = new TaskService();

export class TaskController {
  async createTask(req: Request, res: Response) {
    const task = await taskService.createTask(req.body);
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  }

  async getTasks(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;

    const result = await taskService.getTasks(page, limit, search);
    res.status(200).json({
      success: true,
      message: 'Tasks retrieved successfully',
      data: result,
    });
  }

  async getTaskById(req: Request, res: Response) {
    const task = await taskService.getTaskById(req.params.id as string);
    res.status(200).json({
      success: true,
      message: 'Task retrieved successfully',
      data: task,
    });
  }

  async updateTask(req: Request, res: Response) {
    const task = await taskService.updateTask(req.params.id as string, req.body);
    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  }

  async deleteTask(req: Request, res: Response) {
    await taskService.deleteTask(req.params.id as string);
    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: null,
    });
  }
}
