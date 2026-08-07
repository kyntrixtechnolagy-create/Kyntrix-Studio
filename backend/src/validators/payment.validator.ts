import { z } from 'zod';

export const createPaymentSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Title is required'),
    amount: z.number().min(0, 'Amount must be positive'),
    advancePaid: z.number().min(0).optional(),
    status: z.enum(['PENDING', 'PARTIAL', 'PAID']).optional(),
    dueDate: z.string().datetime().optional(),
    projectId: z.string().uuid('Invalid project ID'),
  }),
});

export const updatePaymentSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid payment ID'),
  }),
  body: z.object({
    title: z.string().min(2).optional(),
    amount: z.number().min(0).optional(),
    advancePaid: z.number().min(0).optional(),
    status: z.enum(['PENDING', 'PARTIAL', 'PAID']).optional(),
    dueDate: z.string().datetime().optional(),
    projectId: z.string().uuid().optional(),
  }),
});

export const getPaymentSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid payment ID'),
  }),
});
