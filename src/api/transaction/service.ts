import apiClient from '@/utils/apiClient';
import {
  TransactionAllGetRsSchema,
  TransactionCountRqSchema,
  TransactionCountRsSchema,
  TransactionPostRqSchema,
  TransactionPostRsSchema,
  type TransactionAllGetRs,
  type TransactionCountRq,
  type TransactionCountRs,
  type TransactionPostRq,
  type TransactionPostRs,
} from '@/api/transaction/schema';

/**
 * Creates a new transaction with the given data.
 *
 * @param {TransactionPostRq} transactionData - The transaction data.
 * @returns {Promise<TransactionPostRs>} The response message with the created transaction data.
 * @throws If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function transactionPost(
  transactionData: TransactionPostRq,
): Promise<TransactionPostRs> {
  try {
    TransactionPostRqSchema.parse(transactionData);
    const response = await apiClient.post('/transactions', transactionData);
    return TransactionPostRsSchema.parse(response.data);
  } catch (error) {
    throw error;
  }
}

/**
 * Fetches the list of all transactions.
 *
 * @returns {Promise<TransactionAllGetRs>} An array of transaction data.
 * @throws If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function transactionAll(): Promise<TransactionAllGetRs> {
  try {
    const response = await apiClient.get('/transactions');
    return TransactionAllGetRsSchema.parse(response.data);
  } catch (error) {
    throw error;
  }
}

/**
 * Gets the count of transactions with the given parameters (optionally, for a specific user, limit, and offset).
 *
 * @param {TransactionCountRq} data - The parameters to filter the transactions.
 * @returns {Promise<TransactionCountRs>} The count of transactions.
 * @throws If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function transactionCount(data: TransactionCountRq): Promise<TransactionCountRs> {
  try {
    TransactionCountRqSchema.parse(data);
    const response = await apiClient.get('/transactions/count', {
      params: data,
    });
    return TransactionCountRsSchema.parse(response.data);
  } catch (error) {
    throw error;
  }
}
