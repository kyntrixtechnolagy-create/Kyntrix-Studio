import { Router } from 'express';
import { SettingsController } from '../controllers/settings.controller';
import { validate } from '../middlewares/validate';
import { updateSettingsSchema } from '../validators/settings.validator';

const router = Router();
const settingsController = new SettingsController();

router.get('/', settingsController.getSettings.bind(settingsController));
router.patch('/', validate(updateSettingsSchema), settingsController.updateSettings.bind(settingsController));

export default router;
