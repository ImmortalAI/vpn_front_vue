// #region imports
import apiClient from '@/utils/apiClient';
import {
  TransactionCountRqSchema,
  TransactionGetRqSchema,
  TransactionPostRqSchema,
  type TransactionAllGetRs,
  type TransactionCountRq,
  type TransactionCountRs,
  type TransactionGetRq,
  type TransactionPostRq,
  type TransactionPostRs,
} from '@/api/transaction/schema';
// #endregion

/**
 * Creates a new transaction with the given data.
 *
 * @param {TransactionPostRq} transactionData - The transaction data.
 * @returns {Promise<TransactionPostRs>} The response message with the created transaction data.
 * @throws {AxiosError | ZodError} If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function transactionPost(
  transactionData: TransactionPostRq,
): Promise<TransactionPostRs> {
  TransactionPostRqSchema.parse(transactionData);
  const response = await apiClient.post<TransactionPostRs>('/transactions', transactionData);
  return response.data;
}

/**
 * Fetches the list of all transactions (optionally, for a specific user, limit, and offset).
 *
 * @param {TransactionGetRq | undefined} data - The parameters to filter the transactions.
 * @returns {Promise<TransactionAllGetRs>} An array of transaction data.
 * @throws {AxiosError | ZodError} If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function transactionGet(data?: TransactionGetRq): Promise<TransactionAllGetRs> {
  TransactionGetRqSchema.parse(data ?? {});
  const response = await apiClient.get<TransactionAllGetRs>('/transactions', {
    params: data ?? {},
  });
  return response.data;
}

/**
 * Gets the count of transactions with the given parameters (optionally, for a specific user).
 *
 * @param {TransactionCountRq} data - The parameters to filter the transactions by user.
 * @returns {Promise<TransactionCountRs>} The count of transactions.
 * @throws {AxiosError | ZodError} If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function transactionCount(
  data: TransactionCountRq | undefined,
): Promise<TransactionCountRs> {
  TransactionCountRqSchema.parse(data ?? {});
  const response = await apiClient.get<TransactionCountRs>('/transactions/count', {
    params: data ?? {},
  });
  return response.data;
}
