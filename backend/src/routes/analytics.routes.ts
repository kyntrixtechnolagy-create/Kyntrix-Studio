import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';

const router = Router();
const analyticsController = new AnalyticsController();

router.get('/', analyticsController.getAnalytics.bind(analyticsController));

export default router;
