import apiClient from '@/utils/apiClient';
import {
  TransactionAllGetRsSchema,
  TransactionPostRsSchema,
  type TransactionAllGetRs,
  type TransactionPostRq,
  type TransactionPostRs,
} from './schema';

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
    const response = await apiClient.post('/transaction', transactionData);
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
    const response = await apiClient.get('/transaction/all');
    return TransactionAllGetRsSchema.parse(response.data);
  } catch (error) {
    throw error;
  }
}
