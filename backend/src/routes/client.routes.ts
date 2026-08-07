import { Router } from 'express';
import { ClientController } from '../controllers/client.controller';
import { validate } from '../middlewares/validate';
import { createClientSchema, updateClientSchema, getClientSchema } from '../validators/client.validator';

const router = Router();
const clientController = new ClientController();

router.post('/', validate(createClientSchema), clientController.createClient.bind(clientController));
router.get('/', clientController.getClients.bind(clientController));
router.get('/:id', validate(getClientSchema), clientController.getClientById.bind(clientController));
router.patch('/:id', validate(updateClientSchema), clientController.updateClient.bind(clientController));
router.delete('/:id', validate(getClientSchema), clientController.deleteClient.bind(clientController));

export default router;
