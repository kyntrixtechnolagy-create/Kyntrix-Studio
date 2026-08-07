import { AnalyticsRepository } from '../repositories/analytics.repository';

export class AnalyticsService {
  private repo = new AnalyticsRepository();

  async getAnalytics() {
    const [transactions, clients, projects, payments, tasks] = await Promise.all([
      this.repo.getTransactions(),
      this.repo.getClients(),
      this.repo.getProjectsByStatus(),
      this.repo.getPayments(),
      this.repo.getRecentTasks()
    ]);

    // 1. Monthly Revenue
    // Group transactions by month (e.g. "Jan", "Feb")
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const revenueMap = new Map<string, { revenue: number, expenses: number, profit: number }>();
    
    // Initialize last 8 months to ensure chart looks good
    const d = new Date();
    d.setMonth(d.getMonth() - 7);
    for (let i = 0; i < 8; i++) {
      const monthStr = monthNames[d.getMonth()];
      if (!revenueMap.has(monthStr)) {
        revenueMap.set(monthStr, { revenue: 0, expenses: 0, profit: 0 });
      }
      d.setMonth(d.getMonth() + 1);
    }

    transactions.forEach(t => {
      const monthStr = monthNames[new Date(t.date).getMonth()];
      if (revenueMap.has(monthStr)) {
        const stats = revenueMap.get(monthStr)!;
        if (t.type === 'INCOME') stats.revenue += t.amount;
        if (t.type === 'EXPENSE') stats.expenses += t.amount;
        stats.profit = stats.revenue - stats.expenses;
      }
    });

    const revenueSeries = Array.from(revenueMap.entries()).map(([month, stats]) => ({
      month,
      ...stats
    }));

    // 2. Client Growth
    // Cumulative clients by month
    const clientCountMap = new Map<string, number>();
    clients.forEach(c => {
      const monthStr = monthNames[new Date(c.createdAt).getMonth()];
      clientCountMap.set(monthStr, (clientCountMap.get(monthStr) || 0) + 1);
    });

    let cumulative = 0;
    const clientGrowth = Array.from(revenueMap.keys()).map(month => {
      cumulative += clientCountMap.get(month) || 0;
      return { month, clients: cumulative };
    });

    // 3. Project Completion Rate
    const completionRate = projects.map(p => ({
      name: p.status === 'COMPLETED' ? 'Completed' : p.status === 'ACTIVE' ? 'In progress' : 'Planning',
      value: p._count.status
    }));

    // 4. Pending Payments by Client
    const pendingByClientMap = new Map<string, number>();
    payments.forEach(p => {
      const pending = p.amount - p.advancePaid;
      if (pending > 0 && p.project && p.project.client) {
        const clientName = p.project.client.name.split(" ")[0];
        pendingByClientMap.set(clientName, (pendingByClientMap.get(clientName) || 0) + pending);
      }
    });
    
    const pendingByClient = Array.from(pendingByClientMap.entries())
      .map(([client, pending]) => ({ client, pending }))
      .sort((a, b) => b.pending - a.pending)
      .slice(0, 8); // Top 8 clients with pending payments

    // 5. Productivity (Last 7 Days)
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const productivityMap = new Map<string, { tasks: number, hours: number }>();
    
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const past = new Date();
      past.setDate(today.getDate() - i);
      productivityMap.set(days[past.getDay()], { tasks: 0, hours: 0 });
    }

    tasks.forEach(t => {
      const dayStr = days[new Date(t.updatedAt).getDay()];
      if (productivityMap.has(dayStr)) {
        productivityMap.get(dayStr)!.tasks += 1;
        // Estimate: 1 task roughly equals 1.5 focus hours
        productivityMap.get(dayStr)!.hours += 1.5; 
      }
    });

    const productivity = Array.from(productivityMap.entries()).map(([day, stats]) => ({
      day,
      tasks: stats.tasks,
      hours: stats.hours
    }));

    return {
      revenueSeries,
      clientGrowth,
      completionRate,
      pendingByClient,
      productivity
    };
  }
}
