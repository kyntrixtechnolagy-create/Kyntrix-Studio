import { Request, Response } from 'express';
import { CalendarService } from '../services/calendar.service';

const calendarService = new CalendarService();

export class CalendarController {
  async createCalendar(req: Request, res: Response) {
    const calendar = await calendarService.createCalendar(req.body);
    res.status(201).json({
      success: true,
      message: 'Calendar created successfully',
      data: calendar,
    });
  }

  async getCalendars(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;

    const result = await calendarService.getCalendars(page, limit, search);
    res.status(200).json({
      success: true,
      message: 'Calendars retrieved successfully',
      data: result,
    });
  }

  async getCalendarById(req: Request, res: Response) {
    const calendar = await calendarService.getCalendarById(req.params.id as string);
    res.status(200).json({
      success: true,
      message: 'Calendar retrieved successfully',
      data: calendar,
    });
  }

  async updateCalendar(req: Request, res: Response) {
    const calendar = await calendarService.updateCalendar(req.params.id as string, req.body);
    res.status(200).json({
      success: true,
      message: 'Calendar updated successfully',
      data: calendar,
    });
  }

  async deleteCalendar(req: Request, res: Response) {
    await calendarService.deleteCalendar(req.params.id as string);
    res.status(200).json({
      success: true,
      message: 'Calendar deleted successfully',
      data: null,
    });
  }
}
