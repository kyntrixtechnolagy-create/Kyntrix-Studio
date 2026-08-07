import { Router } from 'express';
import { DocumentController } from '../controllers/document.controller';

const router = Router();
const documentController = new DocumentController();

router.post('/', documentController.createDocument.bind(documentController));
router.get('/', documentController.getDocuments.bind(documentController));
router.get('/:id', documentController.getDocumentById.bind(documentController));
router.put('/:id', documentController.updateDocument.bind(documentController));
router.delete('/:id', documentController.deleteDocument.bind(documentController));

export default router;
