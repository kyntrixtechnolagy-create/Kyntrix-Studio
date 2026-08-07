import { prisma } from '../database/prisma';

export class AnalyticsRepository {
  async getTransactions() {
    return prisma.transaction.findMany({
      select: { amount: true, type: true, date: true }
    });
  }

  async getClients() {
    return prisma.client.findMany({
      select: { createdAt: true }
    });
  }

  async getProjectsByStatus() {
    return prisma.project.groupBy({
      by: ['status'],
      _count: { status: true }
    });
  }

  async getPayments() {
    return prisma.payment.findMany({
      include: {
        project: {
          include: {
            client: {
              select: { name: true }
            }
          }
        }
      }
    });
  }

  async getRecentTasks() {
    // Get tasks completed in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return prisma.task.findMany({
      where: {
        status: 'COMPLETED',
        updatedAt: { gte: sevenDaysAgo }
      },
      select: { updatedAt: true }
    });
  }
}
