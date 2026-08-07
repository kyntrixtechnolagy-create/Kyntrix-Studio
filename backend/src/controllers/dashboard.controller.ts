import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service';

const dashboardService = new DashboardService();

export class DashboardController {
  async getDashboard(req: Request, res: Response) {
    const stats = await dashboardService.getDashboardStats();
    res.status(200).json({
      success: true,
      message: 'Dashboard data retrieved successfully',
      data: stats,
    });
  }
}
