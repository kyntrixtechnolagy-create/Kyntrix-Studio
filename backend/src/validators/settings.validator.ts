import { z } from 'zod';

export const updateSettingsSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').optional(),
    studioName: z.string().optional(),
    email: z.string().email('Invalid email').optional(),
    currency: z.string().min(1).max(10).optional(),
    theme: z.enum(['light', 'dark']).optional(),
  }),
});
