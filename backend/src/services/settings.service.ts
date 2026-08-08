import { SettingsRepository } from '../repositories/settings.repository';

export class SettingsService {
  private settingsRepository: SettingsRepository;

  constructor() {
    this.settingsRepository = new SettingsRepository();
  }

  async getSettings() {
    return this.settingsRepository.get();
  }

  async updateSettings(data: {
    name?: string;
    studioName?: string;
    email?: string;
    currency?: string;
    theme?: string;
  }) {
    return this.settingsRepository.update(data);
  }
}
