import { prisma } from '../database/prisma';
import { Prisma } from '@prisma/client';

export class PaymentRepository {
  async create(data: Prisma.PaymentCreateInput) {
    return prisma.payment.create({ data });
  }

  async findAll(skip?: number, take?: number, search?: string) {
    const where: Prisma.PaymentWhereInput = search
      ? {
          OR: [
            { title: { contains: search } },
          ],
        }
      : {};

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          project: { select: { id: true, name: true, client: { select: { name: true } } } }
        },
      }),
      prisma.payment.count({ where }),
    ]);

    return { payments, total };
  }

  async findById(id: string) {
    return prisma.payment.findUnique({
      where: { id },
      include: {
        project: true,
      },
    });
  }

  async update(id: string, data: Prisma.PaymentUpdateInput) {
    return prisma.payment.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.payment.delete({
      where: { id },
    });
  }
}
