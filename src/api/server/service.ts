import apiClient from '@/utils/apiClient';
import {
  ServerAllGetRsSchema,
  ServerPatchRsSchema,
  ServerPostRsSchema,
  type ServerAllGetRs,
  type ServerPatchRq,
  type ServerPatchRs,
  type ServerPostRq,
  type ServerPostRs,
} from './schema';

/**
 * Fetches the list of all servers and returns their data.
 *
 * @returns {Promise<ServerAllGetRs>} An array of server data.
 * @throws If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function serverAll(): Promise<ServerAllGetRs> {
  try {
    const response = await apiClient.get('/server/all');
    return ServerAllGetRsSchema.parse(response.data);
  } catch (error) {
    throw error;
  }
}

/**
 * Creates a new server with the given data.
 *
 * @param {ServerPostRq} data - The server data.
 * @returns {Promise<ServerPostRs>} The response message with the created server data.
 * @throws If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function serverPost(data: ServerPostRq): Promise<ServerPostRs> {
  try {
    const response = await apiClient.post('/server', data);
    return ServerPostRsSchema.parse(response.data);
  } catch (error) {
    throw error;
  }
}

/**
 * Updates the server with the given UUID with the given new data.
 *
 * @param {string} serverID - The UUID of the server to update.
 * @param {ServerPatchRq} newData - The new server data.
 * @returns {Promise<ServerPatchRs>} The response message with the updated server data.
 * @throws If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function serverPatch(
  serverID: string,
  newData: ServerPatchRq,
): Promise<ServerPatchRs> {
  try {
    const response = await apiClient.patch(`/server/${serverID}`, newData);
    return ServerPatchRsSchema.parse(response.data);
  } catch (error) {
    throw error;
  }
}
