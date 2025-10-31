import apiClient from '@/utils/apiClient';
import {
  ServerGetRsSchema,
  ServerPatchRqSchema,
  ServerPatchRsSchema,
  ServerPostRqSchema,
  ServerPostRsSchema,
  type ServerGetRs,
  type ServerPatchRq,
  type ServerPatchRs,
  type ServerPostRq,
  type ServerPostRs,
} from '@/api/server/schema';
import { UuidSchema } from '@/api/base/schema';

/**
 * Fetches the list of all servers and returns their data.
 *
 * @returns {Promise<ServerGetRs>} An array of server data.
 * @throws {AxiosError | ZodError} If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function serverGet(): Promise<ServerGetRs> {
  const response = await apiClient.get('/servers');
  return ServerGetRsSchema.parse(response.data);
}

/**
 * Creates a new server with the given data.
 *
 * @param {ServerPostRq} data - The server data.
 * @returns {Promise<ServerPostRs>} The response message with the created server data.
 * @throws {AxiosError | ZodError} If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function serverPost(data: ServerPostRq): Promise<ServerPostRs> {
  ServerPostRqSchema.parse(data);
  const response = await apiClient.post('/servers', data);
  return ServerPostRsSchema.parse(response.data);
}

/**
 * Updates the server with the given UUID with the given new data.
 *
 * @param {string} serverID - The UUID of the server to update.
 * @param {ServerPatchRq} newData - The new server data.
 * @returns {Promise<ServerPatchRs>} The response message with the updated server data.
 * @throws {AxiosError | ZodError} If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function serverIdPatch(
  serverID: string,
  newData: ServerPatchRq,
): Promise<ServerPatchRs> {
  UuidSchema.parse(serverID);
  ServerPatchRqSchema.parse(newData);
  const response = await apiClient.patch(`/servers/${serverID}`, newData);
  return ServerPatchRsSchema.parse(response.data);
}
