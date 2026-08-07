import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { validate } from '../middlewares/validate';
import { createPaymentSchema, updatePaymentSchema, getPaymentSchema } from '../validators/payment.validator';

const router = Router();
const paymentController = new PaymentController();

router.post('/', validate(createPaymentSchema), paymentController.createPayment.bind(paymentController));
router.get('/', paymentController.getPayments.bind(paymentController));
router.get('/:id', validate(getPaymentSchema), paymentController.getPaymentById.bind(paymentController));
router.patch('/:id', validate(updatePaymentSchema), paymentController.updatePayment.bind(paymentController));
router.delete('/:id', validate(getPaymentSchema), paymentController.deletePayment.bind(paymentController));

export default router;
