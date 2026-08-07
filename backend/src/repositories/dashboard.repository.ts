import { prisma } from '../database/prisma';

export class DashboardRepository {
  async getDashboardStats() {
    const [
      activeProjectsCount,
      completedProjectsCount,
      pendingTasksCount,
      totalIncomeTransactions,
      totalExpenseTransactions,
      totalSavingsTransactions,
      payments,
      recentActivities
    ] = await Promise.all([
      prisma.project.count({ where: { status: { in: ['ACTIVE', 'PLANNING'] } } }),
      prisma.project.count({ where: { status: 'COMPLETED' } }),
      prisma.task.count({ where: { status: 'PENDING' } }),
      prisma.transaction.aggregate({ _sum: { amount: true }, where: { type: 'INCOME' } }),
      prisma.transaction.aggregate({ _sum: { amount: true }, where: { type: 'EXPENSE' } }),
      prisma.transaction.aggregate({ _sum: { amount: true }, where: { type: 'SAVINGS' } }),
      prisma.payment.findMany({ select: { amount: true, advancePaid: true, status: true } }),
      prisma.task.findMany({ orderBy: { updatedAt: 'desc' }, take: 5, include: { project: { select: { name: true } } } })
    ]);

    let pendingAmount = 0;
    payments.forEach(p => {
      if (p.status !== 'PAID') {
        pendingAmount += (p.amount - p.advancePaid);
      }
    });

    const revenue = totalIncomeTransactions._sum.amount || 0;
    const expenses = totalExpenseTransactions._sum.amount || 0;
    const savings = totalSavingsTransactions._sum.amount || 0;

    return {
      revenue,
      pendingAmount,
      savings,
      activeProjects: activeProjectsCount,
      completedProjects: completedProjectsCount,
      pendingTasks: pendingTasksCount,
      recentActivities,
    };
  }
}
