import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { validate } from '../middlewares/validate';
import { createTaskSchema, updateTaskSchema, getTaskSchema } from '../validators/task.validator';

const router = Router();
const taskController = new TaskController();

router.post('/', validate(createTaskSchema), taskController.createTask.bind(taskController));
router.get('/', taskController.getTasks.bind(taskController));
router.get('/:id', validate(getTaskSchema), taskController.getTaskById.bind(taskController));
router.patch('/:id', validate(updateTaskSchema), taskController.updateTask.bind(taskController));
router.delete('/:id', validate(getTaskSchema), taskController.deleteTask.bind(taskController));

export default router;
