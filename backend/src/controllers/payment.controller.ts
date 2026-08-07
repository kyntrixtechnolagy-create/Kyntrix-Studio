import { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service';

const paymentService = new PaymentService();

export class PaymentController {
  async createPayment(req: Request, res: Response) {
    const payment = await paymentService.createPayment(req.body);
    res.status(201).json({
      success: true,
      message: 'Payment created successfully',
      data: payment,
    });
  }

  async getPayments(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;

    const result = await paymentService.getPayments(page, limit, search);
    res.status(200).json({
      success: true,
      message: 'Payments retrieved successfully',
      data: result,
    });
  }

  async getPaymentById(req: Request, res: Response) {
    const payment = await paymentService.getPaymentById(req.params.id as string);
    res.status(200).json({
      success: true,
      message: 'Payment retrieved successfully',
      data: payment,
    });
  }

  async updatePayment(req: Request, res: Response) {
    const payment = await paymentService.updatePayment(req.params.id as string, req.body);
    res.status(200).json({
      success: true,
      message: 'Payment updated successfully',
      data: payment,
    });
  }

  async deletePayment(req: Request, res: Response) {
    await paymentService.deletePayment(req.params.id as string);
    res.status(200).json({
      success: true,
      message: 'Payment deleted successfully',
      data: null,
    });
  }
}
