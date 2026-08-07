import { prisma } from '../database/prisma';
import { Prisma } from '@prisma/client';

export class FinanceRepository {
  async createTransaction(data: Prisma.TransactionCreateInput) {
    return prisma.transaction.create({ data });
  }

  async findAll(skip?: number, take?: number, search?: string) {
    const where: Prisma.TransactionWhereInput = search
      ? { title: { contains: search } }
      : {};

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        skip,
        take,
        orderBy: { date: 'desc' },
        include: { category: true },
      }),
      prisma.transaction.count({ where }),
    ]);

    return { transactions, total };
  }

  async findById(id: string) {
    return prisma.transaction.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  async updateTransaction(id: string, data: Prisma.TransactionUpdateInput) {
    return prisma.transaction.update({
      where: { id },
      data,
    });
  }

  async deleteTransaction(id: string) {
    return prisma.transaction.delete({
      where: { id },
    });
  }
}
