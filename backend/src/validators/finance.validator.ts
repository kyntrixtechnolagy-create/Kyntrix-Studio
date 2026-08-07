import { z } from 'zod';

export const createTransactionSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Title is required'),
    amount: z.number().min(0, 'Amount must be positive'),
    type: z.enum(['INCOME', 'EXPENSE', 'SAVINGS']),
    date: z.string().datetime().optional(),
    categoryId: z.string().uuid().optional(),
    notes: z.string().optional(),
  }),
});

export const updateTransactionSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid transaction ID'),
  }),
  body: z.object({
    title: z.string().min(2).optional(),
    amount: z.number().min(0).optional(),
    type: z.enum(['INCOME', 'EXPENSE', 'SAVINGS']).optional(),
    date: z.string().datetime().optional(),
    categoryId: z.string().uuid().optional(),
    notes: z.string().optional(),
  }),
});

export const getTransactionSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid transaction ID'),
  }),
});
