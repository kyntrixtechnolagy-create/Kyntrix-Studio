import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service';

const analyticsService = new AnalyticsService();

export class AnalyticsController {
  async getAnalytics(req: Request, res: Response) {
    const data = await analyticsService.getAnalytics();
    res.status(200).json({
      success: true,
      message: 'Analytics data retrieved successfully',
      data,
    });
  }
}
