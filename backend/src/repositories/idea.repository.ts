import { prisma } from '../database/prisma';
import { Prisma } from '@prisma/client';

export class IdeaRepository {
  async create(data: Prisma.IdeaCreateInput) {
    return prisma.idea.create({ data });
  }

  async findAll(skip?: number, take?: number, search?: string) {
    const where: any = search
      ? {
          OR: [
            { title: { contains: search } },
          ],
        }
      : {};

    const [ideas, total] = await Promise.all([
      prisma.idea.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { category: { select: { name: true } } }
      }),
      prisma.idea.count({ where }),
    ]);

    return { ideas, total };
  }

  async findById(id: string) {
    return prisma.idea.findUnique({
      where: { id }
    });
  }

  async update(id: string, data: Prisma.IdeaUpdateInput) {
    return prisma.idea.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.idea.delete({
      where: { id },
    });
  }
}
