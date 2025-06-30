import { z } from 'zod';
import { MessageRsSchema, type MessageRs } from '../base/schema';

export const TransactionTypeSchema = z.enum(['refund', 'replenishment', 'withdrawal']);

export type TransactionType = z.infer<typeof TransactionTypeSchema>;

export const TransactionSchema = z.object({
  user_id: z.string().uuid(),
  amount: z.number(),
  transaction_type: TransactionTypeSchema,
  date: z.string().datetime({ local: true }),
});

export type Transaction = z.infer<typeof TransactionSchema>;

// request post /transaction
export { TransactionSchema as TransactionPostRqSchema, type Transaction as TransactionPostRq };

// response post /transaction
export { MessageRsSchema as TransactionPostRsSchema, type MessageRs as TransactionPostRs };

// response get /transaction/all
export const TransactionAllGetRsSchema = z.array(TransactionSchema);

export type TransactionAllGetRs = z.infer<typeof TransactionAllGetRsSchema>;
