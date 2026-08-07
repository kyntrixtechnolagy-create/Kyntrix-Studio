import { FinanceRepository } from '../repositories/finance.repository';
import { Prisma } from '@prisma/client';
import { AppError } from '../utils/AppError';

export class FinanceService {
  private financeRepository: FinanceRepository;

  constructor() {
    this.financeRepository = new FinanceRepository();
  }

  async createTransaction(data: Prisma.TransactionCreateInput) {
    return this.financeRepository.createTransaction(data);
  }

  async getTransactions(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;
    const { transactions, total } = await this.financeRepository.findAll(skip, limit, search);

    return {
      data: transactions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTransactionById(id: string) {
    const transaction = await this.financeRepository.findById(id);
    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }
    return transaction;
  }

  async updateTransaction(id: string, data: Prisma.TransactionUpdateInput) {
    const transaction = await this.financeRepository.findById(id);
    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }
    return this.financeRepository.updateTransaction(id, data);
  }

  async deleteTransaction(id: string) {
    const transaction = await this.financeRepository.findById(id);
    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }
    return this.financeRepository.deleteTransaction(id);
  }
}
