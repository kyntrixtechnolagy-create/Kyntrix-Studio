import { Router } from 'express';
import { IdeaController } from '../controllers/idea.controller';

const router = Router();
const ideaController = new IdeaController();

router.post('/', ideaController.createIdea.bind(ideaController));
router.get('/', ideaController.getIdeas.bind(ideaController));
router.get('/:id', ideaController.getIdeaById.bind(ideaController));
router.put('/:id', ideaController.updateIdea.bind(ideaController));
router.delete('/:id', ideaController.deleteIdea.bind(ideaController));

export default router;
