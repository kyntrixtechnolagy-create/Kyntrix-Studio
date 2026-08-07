import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller';
import { validate } from '../middlewares/validate';
import { createProjectSchema, updateProjectSchema, getProjectSchema } from '../validators/project.validator';

const router = Router();
const projectController = new ProjectController();

router.post('/', validate(createProjectSchema), projectController.createProject.bind(projectController));
router.get('/', projectController.getProjects.bind(projectController));
router.get('/:id', validate(getProjectSchema), projectController.getProjectById.bind(projectController));
router.patch('/:id', validate(updateProjectSchema), projectController.updateProject.bind(projectController));
router.delete('/:id', validate(getProjectSchema), projectController.deleteProject.bind(projectController));

export default router;
