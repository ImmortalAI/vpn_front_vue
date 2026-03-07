// #region imports
import * as z from 'zod';
// #endregion

export const TransactionTypeSchema = z.enum(['refund', 'replenishment', 'withdrawal']);

export type TransactionType = z.infer<typeof TransactionTypeSchema>;

export const TransactionSchema = z.object({
  user_id: z.uuid(),
  amount: z.int().min(1),
  description: z.string(),
  transaction_type: TransactionTypeSchema,
  date: z.coerce.date(),
});

export type Transaction = z.infer<typeof TransactionSchema>;

export const TransactionQuerySchema = z.object({
  user_id: z.uuid().optional(),
  limit: z.number().int().optional(),
  offset: z.number().int().optional(),
});

export type TransactionQuery = z.infer<typeof TransactionQuerySchema>;
