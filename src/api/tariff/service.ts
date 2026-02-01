// #region imports
import apiClient from '@/utils/apiClient';
import {
  TariffPatchRqSchema,
  TariffPostRqSchema,
  type TariffAllGetRs,
  type TariffDeleteRs,
  type TariffGetRs,
  type TariffPatchRq,
  type TariffPatchRs,
  type TariffPostRq,
  type TariffPostRs,
} from '@/api/tariff/schema';
import { UuidSchema } from '../base/schema';
// #endregion

/**
 * Get the list of all tariffs with their data.
 *
 * @returns {Promise<TariffAllGetRs>} An array of tariff data.
 * @throws {AxiosError | ZodError} If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function tariffAll(): Promise<TariffAllGetRs> {
  const response = await apiClient.get<TariffAllGetRs>('/tariffs');
  return response.data;
}

/**
 * Get the data of a specific tariff.
 *
 * @param {string} tariffId - The UUID of the tariff to get.
 * @returns {Promise<TariffGetRs>} The response data with the tariff data.
 * @throws {AxiosError | ZodError} If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function tariffGet(tariffId: string): Promise<TariffGetRs> {
  UuidSchema.parse(tariffId);
  const response = await apiClient.get<TariffGetRs>(`/tariffs/${tariffId}`);
  return response.data;
}

/**
 * Create a new tariff with the given data.
 *
 * @param {TariffPostRq} request - The request object containing the tariff data.
 * @returns {Promise<TariffPostRs>} The response message with the created tariff data.
 * @throws {AxiosError | ZodError} If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function tariffPost(request: TariffPostRq): Promise<TariffPostRs> {
  TariffPostRqSchema.parse(request);
  const response = await apiClient.post<TariffPostRs>('/tariffs', request);
  return response.data;
}

/**
 * Update the data of a specific tariff.
 *
 * @param {string} tariffId - The UUID of the tariff to update.
 * @param {TariffPatchRq} request - The request object containing the tariff data to update.
 * @returns {Promise<TariffPatchRs>} The response message with the updated tariff data.
 * @throws {AxiosError | ZodError} If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function tariffPatch(
  tariffId: string,
  request: TariffPatchRq,
): Promise<TariffPatchRs> {
  UuidSchema.parse(tariffId);
  TariffPatchRqSchema.parse(request);
  const response = await apiClient.patch<TariffPatchRs>(`/tariffs/${tariffId}`, request);
  return response.data;
}

/**
 * Delete a tariff by its UUID.
 *
 * @param {string} tariffId - The UUID of the tariff to delete.
 * @returns {Promise<TariffDeleteRs>} The response message with the deletion status.
 * @throws {AxiosError | ZodError} If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function tariffDelete(tariffId: string): Promise<TariffDeleteRs> {
  UuidSchema.parse(tariffId);
  const response = await apiClient.delete<TariffDeleteRs>(`/tariffs/${tariffId}`);
  return response.data;
}
