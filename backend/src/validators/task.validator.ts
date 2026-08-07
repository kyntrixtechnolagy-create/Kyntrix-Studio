import { z } from 'zod';

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Title is required'),
    description: z.string().optional(),
    status: z.enum(['PENDING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    deadline: z.string().datetime().optional(),
    isRecurring: z.boolean().optional(),
    recurringRule: z.string().optional(),
    projectId: z.string().uuid().optional(),
  }),
});

export const updateTaskSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid task ID'),
  }),
  body: z.object({
    title: z.string().min(2).optional(),
    description: z.string().optional(),
    status: z.enum(['PENDING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    deadline: z.string().datetime().optional(),
    isRecurring: z.boolean().optional(),
    recurringRule: z.string().optional(),
    projectId: z.string().uuid().optional(),
  }),
});

export const getTaskSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid task ID'),
  }),
});
