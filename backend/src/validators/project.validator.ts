import { z } from 'zod';

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is required'),
    description: z.string().optional(),
    status: z.enum(['PLANNING', 'ACTIVE', 'COMPLETED', 'ON_HOLD']).optional(),
    progress: z.number().min(0).max(100).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    requirements: z.string().optional(),
    notes: z.string().optional(),
    clientId: z.string().uuid('Invalid client ID'),
  }),
});

export const updateProjectSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid project ID'),
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    status: z.enum(['PLANNING', 'ACTIVE', 'COMPLETED', 'ON_HOLD']).optional(),
    progress: z.number().min(0).max(100).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    requirements: z.string().optional(),
    notes: z.string().optional(),
    clientId: z.string().uuid().optional(),
  }),
});

export const getProjectSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid project ID'),
  }),
});
