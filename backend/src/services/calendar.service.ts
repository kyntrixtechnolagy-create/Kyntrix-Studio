import { CalendarRepository } from '../repositories/calendar.repository';
import { Prisma } from '@prisma/client';
import { AppError } from '../middlewares/errorHandler';

const calendarRepository = new CalendarRepository();

export class CalendarService {
  async createCalendar(data: Prisma.CalendarEventCreateInput) {
    return calendarRepository.create(data);
  }

  async getCalendars(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;
    const { calendars, total } = await calendarRepository.findAll(skip, limit, search);
    
    return {
      calendars,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getCalendarById(id: string) {
    const calendar = await calendarRepository.findById(id);
    if (!calendar) {
      throw new AppError('Calendar not found', 404);
    }
    return calendar;
  }

  async updateCalendar(id: string, data: Prisma.CalendarEventUpdateInput) {
    await this.getCalendarById(id);
    return calendarRepository.update(id, data);
  }

  async deleteCalendar(id: string) {
    await this.getCalendarById(id);
    return calendarRepository.delete(id);
  }
}
