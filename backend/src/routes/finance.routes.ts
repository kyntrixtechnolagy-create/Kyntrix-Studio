import { Router } from 'express';
import { FinanceController } from '../controllers/finance.controller';
import { validate } from '../middlewares/validate';
import { createTransactionSchema, updateTransactionSchema, getTransactionSchema } from '../validators/finance.validator';

const router = Router();
const financeController = new FinanceController();

router.post('/', validate(createTransactionSchema), financeController.createTransaction.bind(financeController));
router.get('/', financeController.getTransactions.bind(financeController));
router.get('/:id', validate(getTransactionSchema), financeController.getTransactionById.bind(financeController));
router.patch('/:id', validate(updateTransactionSchema), financeController.updateTransaction.bind(financeController));
router.delete('/:id', validate(getTransactionSchema), financeController.deleteTransaction.bind(financeController));

export default router;
