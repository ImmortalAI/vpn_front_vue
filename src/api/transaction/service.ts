// #region imports
import apiClient from '@/utils/apiClient';
import {
  TransactionPaginationSchema,
  TransactionSchema,
  type Transaction,
  type TransactionPagination,
} from '@/api/transaction/schema';
import { UuidSchema, type Uuid } from '../base/schema';
import z from 'zod';
// #endregion

const coerceTransaction = (transaction: Transaction): Transaction => {
  return {
    ...transaction,
    date: z.coerce.date().parse(transaction.date),
  };
};

/**
 * Creates a new transaction with the given data.
 *
 * @param {Transaction} transactionData - The transaction data.
 * @returns {Promise<Transaction>} The response message with the created transaction data.
 * @throws {AxiosError | ZodError} If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function transactionPost(transactionData: Transaction): Promise<Transaction> {
  TransactionSchema.parse(transactionData);
  const response = await apiClient.post<Transaction>('/transactions', transactionData);
  return coerceTransaction(response.data);
}

/**
 * Fetches the list of all transactions (optionally, for a specific user, limit, and offset).
 *
 * @param {TransactionQuery | undefined} data - The parameters to filter the transactions.
 * @returns {Promise<Transaction[]>} An array of transaction data.
 * @throws {AxiosError | ZodError} If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function transactionGet(data?: TransactionPagination): Promise<Transaction[]> {
  TransactionPaginationSchema.parse(data ?? {});
  const response = await apiClient.get<Transaction[]>('/transactions', {
    params: data ?? {},
  });
  return response.data.map(coerceTransaction);
}

/**
 * Gets the count of transactions with the given parameters (optionally, for a specific user).
 *
 * @param {Uuid | undefined} userId - The parameters to filter the transactions by user.
 * @returns {Promise<number>} The count of transactions.
 * @throws {AxiosError | ZodError} If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function transactionCount(userId?: Uuid): Promise<number> {
  if (userId) UuidSchema.parse(userId);
  const response = await apiClient.get<number>('/transactions/count', {
    params: {
      user_id: userId,
    },
  });
  return response.data;
}
