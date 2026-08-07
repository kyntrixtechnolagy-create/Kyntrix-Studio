import { PaymentRepository } from '../repositories/payment.repository';
import { Prisma } from '@prisma/client';
import { AppError } from '../utils/AppError';
import { prisma } from '../database/prisma';

export class PaymentService {
  private paymentRepository: PaymentRepository;

  constructor() {
    this.paymentRepository = new PaymentRepository();
  }

  async createPayment(data: Prisma.PaymentCreateInput) {
    return this.paymentRepository.create(data);
  }

  async getPayments(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;
    const { payments, total } = await this.paymentRepository.findAll(skip, limit, search);

    return {
      data: payments,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPaymentById(id: string) {
    const payment = await this.paymentRepository.findById(id);
    if (!payment) {
      throw new AppError('Payment not found', 404);
    }
    return payment;
  }

  async updatePayment(id: string, data: Prisma.PaymentUpdateInput) {
    const payment = await this.paymentRepository.findById(id);
    if (!payment) {
      throw new AppError('Payment not found', 404);
    }
    const updatedPayment = await this.paymentRepository.update(id, data);
    
    // Check if advancePaid was updated to create a transaction
    if (data.advancePaid !== undefined) {
      const newAdvance = Number(data.advancePaid);
      const oldAdvance = payment.advancePaid || 0;
      
      if (newAdvance > oldAdvance) {
        const diff = newAdvance - oldAdvance;
        await prisma.transaction.create({
          data: {
            title: payment.title || 'Payment collected',
            amount: diff,
            type: 'INCOME',
          }
        });
      }
    }

    return updatedPayment;
  }

  async deletePayment(id: string) {
    const payment = await this.paymentRepository.findById(id);
    if (!payment) {
      throw new AppError('Payment not found', 404);
    }
    return this.paymentRepository.delete(id);
  }
}
