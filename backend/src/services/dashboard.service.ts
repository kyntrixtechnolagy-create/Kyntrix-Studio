import { DashboardRepository } from '../repositories/dashboard.repository';

export class DashboardService {
  private dashboardRepository: DashboardRepository;

  constructor() {
    this.dashboardRepository = new DashboardRepository();
  }

  async getDashboardStats() {
    return this.dashboardRepository.getDashboardStats();
  }
}
