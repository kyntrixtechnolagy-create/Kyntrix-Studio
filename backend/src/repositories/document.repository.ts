import { prisma } from '../database/prisma';
import { Prisma } from '@prisma/client';

export class DocumentRepository {
  async create(data: Prisma.DocumentCreateInput) {
    return prisma.document.create({ data });
  }

  async findAll(skip?: number, take?: number, search?: string) {
    const where: any = search
      ? {
          OR: [
            { name: { contains: search } },
          ],
        }
      : {};

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.document.count({ where }),
    ]);

    return { documents, total };
  }

  async findById(id: string) {
    return prisma.document.findUnique({
      where: { id }
    });
  }

  async update(id: string, data: Prisma.DocumentUpdateInput) {
    return prisma.document.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.document.delete({
      where: { id },
    });
  }
}
