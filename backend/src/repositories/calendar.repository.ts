import { prisma } from '../database/prisma';
import { Prisma } from '@prisma/client';

export class CalendarRepository {
  async create(data: Prisma.CalendarEventCreateInput) {
    return prisma.calendarEvent.create({ data });
  }

  async findAll(skip?: number, take?: number, search?: string) {
    const where: any = search
      ? {
          OR: [
            { title: { contains: search } },
          ],
        }
      : {};

    const [calendars, total] = await Promise.all([
      prisma.calendarEvent.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.calendarEvent.count({ where }),
    ]);

    return { calendars, total };
  }

  async findById(id: string) {
    return prisma.calendarEvent.findUnique({
      where: { id }
    });
  }

  async update(id: string, data: Prisma.CalendarEventUpdateInput) {
    return prisma.calendarEvent.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.calendarEvent.delete({
      where: { id },
    });
  }
}
