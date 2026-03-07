// #region imports
import * as z from 'zod';
import { PaginationSchema } from '../base/schema';
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

export const TransactionPaginationSchema = PaginationSchema.extend({
  user_id: z.uuid().optional(),
});

export type TransactionPagination = z.infer<typeof TransactionPaginationSchema>;
