// #region imports
import * as z from 'zod';
import { type MessageRs, MessageRsSchema } from '@/api/base/schema';
// #endregion

// request post /auth/tg_code
export const AuthTgCodeRqSchema = z.object({
  tg_id: z.coerce.number(),
});

export type AuthTgCodeRq = z.infer<typeof AuthTgCodeRqSchema>;

export { MessageRsSchema as AuthTgCodeRsSchema, type MessageRs as AuthTgCodeRs };

// request post /auth/login
export const AuthLoginRqSchema = z.object({
  tg_id: z.coerce.number(),
  tg_code: z.string().regex(/^\d+$/),
});

export type AuthLoginRq = z.infer<typeof AuthLoginRqSchema>;

export { MessageRsSchema as AuthLoginRsSchema, type MessageRs as AuthLoginRs };

export { MessageRsSchema as AuthLogoutRsSchema, type MessageRs as AuthLogoutRs };

export { MessageRsSchema as AuthRefreshRsSchema, type MessageRs as AuthRefreshRs };
