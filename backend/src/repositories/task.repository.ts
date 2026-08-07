import { prisma } from '../database/prisma';
import { Prisma } from '@prisma/client';

export class TaskRepository {
  async create(data: Prisma.TaskCreateInput) {
    return prisma.task.create({ data });
  }

  async findAll(skip?: number, take?: number, search?: string) {
    const where: Prisma.TaskWhereInput = search
      ? {
          OR: [
            { title: { contains: search } },
            { description: { contains: search } },
          ],
        }
      : {};

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          project: { select: { id: true, name: true } }
        },
      }),
      prisma.task.count({ where }),
    ]);

    return { tasks, total };
  }

  async findById(id: string) {
    return prisma.task.findUnique({
      where: { id },
      include: {
        project: true,
        calendarEvents: true
      },
    });
  }

  async update(id: string, data: Prisma.TaskUpdateInput) {
    return prisma.task.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.task.delete({
      where: { id },
    });
  }
}
