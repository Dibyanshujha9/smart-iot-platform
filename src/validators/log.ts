import { z } from 'zod';

export const logCreateSchema = z.object({
  event: z.string().min(1),
  value: z.number(),
  timestamp: z.coerce.date().optional(),
});
