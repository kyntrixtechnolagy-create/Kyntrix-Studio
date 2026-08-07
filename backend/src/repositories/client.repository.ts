import { prisma } from '../database/prisma';
import { Prisma } from '@prisma/client';

export class ClientRepository {
  async create(data: Prisma.ClientCreateInput) {
    return prisma.client.create({ data });
  }

  async findAll(skip?: number, take?: number, search?: string) {
    const where: Prisma.ClientWhereInput = search
      ? {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
            { company: { contains: search } },
          ],
        }
      : {};

    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { projects: true },
          },
          projects: {
            include: { payments: true }
          }
        },
      }),
      prisma.client.count({ where }),
    ]);

    return { clients, total };
  }

  async findById(id: string) {
    return prisma.client.findUnique({
      where: { id },
      include: {
        projects: {
          include: {
            payments: true,
          },
        },
      },
    });
  }

  async update(id: string, data: Prisma.ClientUpdateInput) {
    return prisma.client.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.client.delete({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return prisma.client.findUnique({ where: { email } });
  }
}
