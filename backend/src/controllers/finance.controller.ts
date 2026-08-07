import { Request, Response } from 'express';
import { FinanceService } from '../services/finance.service';

const financeService = new FinanceService();

export class FinanceController {
  async createTransaction(req: Request, res: Response) {
    const transaction = await financeService.createTransaction(req.body);
    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: transaction,
    });
  }

  async getTransactions(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;

    const result = await financeService.getTransactions(page, limit, search);
    res.status(200).json({
      success: true,
      message: 'Transactions retrieved successfully',
      data: result,
    });
  }

  async getTransactionById(req: Request, res: Response) {
    const transaction = await financeService.getTransactionById(req.params.id as string);
    res.status(200).json({
      success: true,
      message: 'Transaction retrieved successfully',
      data: transaction,
    });
  }

  async updateTransaction(req: Request, res: Response) {
    const transaction = await financeService.updateTransaction(req.params.id as string, req.body);
    res.status(200).json({
      success: true,
      message: 'Transaction updated successfully',
      data: transaction,
    });
  }

  async deleteTransaction(req: Request, res: Response) {
    await financeService.deleteTransaction(req.params.id as string);
    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
      data: null,
    });
  }
}
