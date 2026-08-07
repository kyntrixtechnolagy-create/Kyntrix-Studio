import { Router } from 'express';
import { CalendarController } from '../controllers/calendar.controller';

const router = Router();
const calendarController = new CalendarController();

router.post('/', calendarController.createCalendar.bind(calendarController));
router.get('/', calendarController.getCalendars.bind(calendarController));
router.get('/:id', calendarController.getCalendarById.bind(calendarController));
router.put('/:id', calendarController.updateCalendar.bind(calendarController));
router.delete('/:id', calendarController.deleteCalendar.bind(calendarController));

export default router;
