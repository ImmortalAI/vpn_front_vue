import * as z from 'zod';
import { zodResolver } from '@primevue/forms/resolvers/zod';

export const resolver = zodResolver(
  z.object({
    telegramId: z.coerce.number(),
    telegramCode: z.string(),
  }),
);
