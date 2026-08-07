import { z } from 'zod';

export const createClientSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    company: z.string().optional(),
    notes: z.string().optional(),
  }),
});

export const updateClientSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid client ID'),
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    company: z.string().optional(),
    notes: z.string().optional(),
  }),
});

export const getClientSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid client ID'),
  }),
});
