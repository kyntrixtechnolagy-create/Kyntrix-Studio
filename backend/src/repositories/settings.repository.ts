import { prisma } from '../database/prisma';

export class SettingsRepository {
  async get() {
    return prisma.userSettings.upsert({
      where: { id: 'default' },
      create: { id: 'default' },
      update: {},
    });
  }

  async update(data: {
    name?: string;
    studioName?: string;
    email?: string;
    currency?: string;
    theme?: string;
  }) {
    return prisma.userSettings.upsert({
      where: { id: 'default' },
      create: { id: 'default', ...data },
      update: data,
    });
  }
}
