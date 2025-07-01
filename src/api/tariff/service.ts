import apiClient from '@/utils/apiClient';
import {
  TariffAllGetRsSchema,
  TariffDeleteRsSchema,
  TariffGetRsSchema,
  TariffPatchRsSchema,
  TariffPostRsSchema,
  type TariffAllGetRs,
  type TariffDeleteRs,
  type TariffGetRs,
  type TariffPatchRq,
  type TariffPatchRs,
  type TariffPostRq,
  type TariffPostRs,
} from '@/api/tariff/schema';

/**
 * Get the list of all tariffs with their data.
 *
 * @returns {Promise<TariffAllGetRs>} An array of tariff data.
 * @throws  If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function tariffAll(): Promise<TariffAllGetRs> {
  try {
    const response = await apiClient.get('/tariff/all');
    return TariffAllGetRsSchema.parse(response.data);
  } catch (error) {
    throw error;
  }
}

/**
 * Get the data of a specific tariff.
 *
 * @param {string} tariffId - The UUID of the tariff to get.
 * @returns {Promise<TariffGetRs>} The response data with the tariff data.
 * @throws  If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function tariffGet(tariffId: string): Promise<TariffGetRs> {
  try {
    const response = await apiClient.get(`/tariff/${tariffId}`);
    return TariffGetRsSchema.parse(response.data);
  } catch (error) {
    throw error;
  }
}

/**
 * Create a new tariff with the given data.
 *
 * @param {TariffPostRq} request - The request object containing the tariff data.
 * @returns {Promise<TariffPostRs>} The response message with the created tariff data.
 * @throws  If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function tariffPost(request: TariffPostRq): Promise<TariffPostRs> {
  try {
    const response = await apiClient.post('/tariff', request);
    return TariffPostRsSchema.parse(response.data);
  } catch (error) {
    throw error;
  }
}

/**
 * Update the data of a specific tariff.
 *
 * @param {string} tariffId - The UUID of the tariff to update.
 * @param {TariffPatchRq} request - The request object containing the tariff data to update.
 * @returns {Promise<TariffPatchRs>} The response message with the updated tariff data.
 * @throws  If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function tariffPatch(
  tariffId: string,
  request: TariffPatchRq,
): Promise<TariffPatchRs> {
  try {
    const response = await apiClient.patch(`/tariff/${tariffId}`, request);
    return TariffPatchRsSchema.parse(response.data);
  } catch (error) {
    throw error;
  }
}

/**
 * Delete a tariff by its UUID.
 *
 * @param {string} tariffId - The UUID of the tariff to delete.
 * @returns {Promise<TariffDeleteRs>} The response message with the deletion status.
 * @throws  If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function tariffDelete(tariffId: string): Promise<TariffDeleteRs> {
  try {
    const response = await apiClient.delete(`/tariff/${tariffId}`);
    return TariffDeleteRsSchema.parse(response.data);
  } catch (error) {
    throw error;
  }
}
