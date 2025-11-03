// #region imports
import * as z from 'zod';
import { MessageRsSchema, type MessageRs } from '@/api/base/schema';
// #endregion

export const TransactionTypeSchema = z.enum(['refund', 'replenishment', 'withdrawal']);

export type TransactionType = z.infer<typeof TransactionTypeSchema>;

export const TransactionSchema = z.object({
  user_id: z.uuid(),
  amount: z.number(),
  description: z.string(),
  transaction_type: TransactionTypeSchema,
  date: z.coerce.date(),
});

export type Transaction = z.infer<typeof TransactionSchema>;

// request post /transactions
export { TransactionSchema as TransactionPostRqSchema, type Transaction as TransactionPostRq };

// response post /transactions
export { MessageRsSchema as TransactionPostRsSchema, type MessageRs as TransactionPostRs };

// request get /transactions
export const TransactionGetRqSchema = z.object({
  user_id: z.uuid().optional(),
  limit: z.number().int().optional(),
  offset: z.number().int().optional(),
});

export type TransactionGetRq = z.infer<typeof TransactionGetRqSchema>;

// response get /transactions
export const TransactionAllGetRsSchema = z.array(TransactionSchema);

export type TransactionAllGetRs = z.infer<typeof TransactionAllGetRsSchema>;

// request get /transactions/count
export const TransactionCountRqSchema = z.object({
  user_id: z.uuid().optional(),
});

export type TransactionCountRq = z.infer<typeof TransactionCountRqSchema>;

// response get /transactions/count
export const TransactionCountRsSchema = z.number().int();

export type TransactionCountRs = z.infer<typeof TransactionCountRsSchema>;
