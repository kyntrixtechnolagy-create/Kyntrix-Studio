import { Request, Response } from 'express';
import { SettingsService } from '../services/settings.service';

const settingsService = new SettingsService();

export class SettingsController {
  async getSettings(req: Request, res: Response) {
    const settings = await settingsService.getSettings();
    res.status(200).json({
      success: true,
      message: 'Settings retrieved successfully',
      data: settings,
    });
  }

  async updateSettings(req: Request, res: Response) {
    const settings = await settingsService.updateSettings(req.body);
    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: settings,
    });
  }
}
