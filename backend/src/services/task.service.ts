import { TaskRepository } from '../repositories/task.repository';
import { Prisma } from '@prisma/client';
import { AppError } from '../utils/AppError';

export class TaskService {
  private taskRepository: TaskRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
  }

  async createTask(data: Prisma.TaskCreateInput) {
    return this.taskRepository.create(data);
  }

  async getTasks(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;
    const { tasks, total } = await this.taskRepository.findAll(skip, limit, search);

    return {
      data: tasks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTaskById(id: string) {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new AppError('Task not found', 404);
    }
    return task;
  }

  async updateTask(id: string, data: Prisma.TaskUpdateInput) {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new AppError('Task not found', 404);
    }
    return this.taskRepository.update(id, data);
  }

  async deleteTask(id: string) {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new AppError('Task not found', 404);
    }
    return this.taskRepository.delete(id);
  }
}
