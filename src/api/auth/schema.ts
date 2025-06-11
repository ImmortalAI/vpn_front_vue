import { z } from 'zod';

// request post auth/tg_code
export const AuthTgCodeRqSchema = z.object({
  tg_id: z.coerce.number(),
});

export type AuthTgCodeRq = z.infer<typeof AuthTgCodeRqSchema>;

// request post auth/login
export const AuthLoginRqSchema = z.object({
  tg_id: z.coerce.number(),
  tg_code: z.string(),
});

export type AuthLoginRq = z.infer<typeof AuthLoginRqSchema>;
