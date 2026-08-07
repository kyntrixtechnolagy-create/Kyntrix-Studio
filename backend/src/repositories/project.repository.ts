import { prisma } from '../database/prisma';
import { Prisma } from '@prisma/client';

export class ProjectRepository {
  async create(data: Prisma.ProjectCreateInput) {
    return prisma.project.create({ data });
  }

  async findAll(skip?: number, take?: number, search?: string) {
    const where: Prisma.ProjectWhereInput = search
      ? {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } },
          ],
        }
      : {};

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          client: { select: { id: true, name: true } },
          _count: { select: { tasks: true } },
          payments: { select: { amount: true, advancePaid: true } }
        },
      }),
      prisma.project.count({ where }),
    ]);

    return { projects, total };
  }

  async findById(id: string) {
    return prisma.project.findUnique({
      where: { id },
      include: {
        client: true,
        tasks: true,
        payments: true,
        calendarEvents: true
      },
    });
  }

  async update(id: string, data: Prisma.ProjectUpdateInput) {
    return prisma.project.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.project.delete({
      where: { id },
    });
  }
}
