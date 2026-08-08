import { prisma } from '../database/prisma';

function monthRange(monthsAgo: number) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
  const end = new Date(now.getFullYear(), now.getMonth() - monthsAgo + 1, 0, 23, 59, 59, 999);
  return { gte: start, lte: end };
}

function pct(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 1000) / 10; // 1 decimal place
}

export class DashboardRepository {
  async getDashboardStats() {
    const thisMonth = monthRange(0);
    const lastMonth = monthRange(1);

    const [
      activeProjectsCount,
      completedProjectsCount,
      pendingTasksCount,
      // This month
      revenueThis,
      savingsThis,
      // Last month
      revenueLast,
      savingsLast,
      // Projects this vs last month
      activeProjectsLast,
      completedProjectsLast,
      pendingTasksLast,
      // All payments for pending amount
      payments,
      // Payments this vs last month (for pending trend)
      pendingPaymentsThis,
      pendingPaymentsLast,
    ] = await Promise.all([
      prisma.project.count({ where: { status: { in: ['ACTIVE', 'PLANNING'] } } }),
      prisma.project.count({ where: { status: 'COMPLETED' } }),
      prisma.task.count({ where: { status: 'PENDING' } }),

      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { type: 'INCOME', date: thisMonth },
      }),
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { type: 'SAVINGS', date: thisMonth },
      }),

      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { type: 'INCOME', date: lastMonth },
      }),
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { type: 'SAVINGS', date: lastMonth },
      }),

      prisma.project.count({
        where: { status: { in: ['ACTIVE', 'PLANNING'] }, createdAt: lastMonth },
      }),
      prisma.project.count({
        where: { status: 'COMPLETED', updatedAt: lastMonth },
      }),
      prisma.task.count({ where: { status: 'PENDING', createdAt: lastMonth } }),

      prisma.payment.findMany({ select: { amount: true, advancePaid: true, status: true } }),

      // Pending payments created this month vs last
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: { not: 'PAID' }, createdAt: thisMonth },
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: { not: 'PAID' }, createdAt: lastMonth },
      }),
    ]);

    let pendingAmount = 0;
    payments.forEach((p) => {
      if (p.status !== 'PAID') {
        pendingAmount += p.amount - p.advancePaid;
      }
    });

    // All-time totals for revenue and savings
    const [totalIncome, totalExpenses, totalSavings] = await Promise.all([
      prisma.transaction.aggregate({ _sum: { amount: true }, where: { type: 'INCOME' } }),
      prisma.transaction.aggregate({ _sum: { amount: true }, where: { type: 'EXPENSE' } }),
      prisma.transaction.aggregate({ _sum: { amount: true }, where: { type: 'SAVINGS' } }),
    ]);

    const revenue = totalIncome._sum.amount || 0;
    const savings = totalSavings._sum.amount || 0;

    const revThis = revenueThis._sum.amount || 0;
    const revLast = revenueLast._sum.amount || 0;
    const savThis = savingsThis._sum.amount || 0;
    const savLast = savingsLast._sum.amount || 0;
    const pendThis = pendingPaymentsThis._sum.amount || 0;
    const pendLast = pendingPaymentsLast._sum.amount || 0;

    return {
      revenue,
      pendingAmount,
      savings,
      activeProjects: activeProjectsCount,
      completedProjects: completedProjectsCount,
      pendingTasks: pendingTasksCount,
      trends: {
        revenue: pct(revThis, revLast),
        pending: pct(pendThis, pendLast),
        savings: pct(savThis, savLast),
        activeProjects: pct(activeProjectsCount, activeProjectsLast),
        completedProjects: pct(completedProjectsCount, completedProjectsLast),
        pendingTasks: pct(pendingTasksCount, pendingTasksLast),
        newLeads: 0,
      },
    };
  }
}
