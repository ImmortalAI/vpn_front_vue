// #region imports
import apiClient from '@/utils/apiClient';
import {
  InboundsCountRqSchema,
  InboundsGetRqSchema,
  InboundsPatchRqSchema,
  ServerGetByIdRqSchema,
  ServerGetRqSchema,
  ServerPatchRqSchema,
  ServerPostRqSchema,
  type InboundsCountRq,
  type InboundsCountRs,
  type InboundsGetByIdRs,
  type InboundsGetRq,
  type InboundsGetRs,
  type InboundsPatchRq,
  type InboundsPatchRs,
  type InboundsPostRq,
  type InboundsPostRs,
  type ServerCountRs,
  type ServerGetByIdRq,
  type ServerGetByIdRs,
  type ServerGetRq,
  type ServerGetRs,
  type ServerPatchRq,
  type ServerPatchRs,
  type ServerPostRq,
  type ServerPostRs,
} from '@/api/server/schema';
import { UuidSchema, type Uuid } from '@/api/base/schema';
// #endregion

/**
 * Fetches the list of all servers and returns their data.
 *
 * @returns {Promise<ServerGetRs>} An array of server data.
 * @throws {AxiosError | ZodError} If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function serverGet(data?: ServerGetRq): Promise<ServerGetRs> {
  ServerGetRqSchema.parse(data ?? {});
  const response = await apiClient.get<ServerGetRs>('/servers', {
    params: data,
  });
  return response.data;
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
  const response = await apiClient.post<ServerPostRs>('/servers', data);
  return response.data;
}

/**
 * Gets the count of all servers.
 *
 * @returns {Promise<ServerCountRs>} The count of servers.
 * @throws {AxiosError | ZodError} If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function serverCount(): Promise<ServerCountRs> {
  const response = await apiClient.get<ServerCountRs>('/servers/count');
  return response.data;
}

/**
 * Gets the data of a specific server.
 *
 * @param {ServerGetByIdRq} data - Object with server_id.
 * @returns {Promise<ServerGetByIdRs>} The response data with the server data.
 * @throws {AxiosError | ZodError} If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function serverGetById(data: ServerGetByIdRq): Promise<ServerGetByIdRs> {
  ServerGetByIdRqSchema.parse(data);
  const response = await apiClient.get<ServerGetByIdRs>(`/servers/${data.server_id}`);
  return response.data;
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
  const response = await apiClient.patch<ServerPatchRs>(`/servers/${serverID}`, newData);
  return response.data;
}

/**
 * Gets the list of all server inbounds (optionally, for a specific server or with pagination).
 *
 * @param {InboundsGetRq | undefined} data - The parameters to filter the server inbounds.
 * @returns {Promise<InboundsGetRs>} The response data with the server inbounds data.
 * @throws {AxiosError | ZodError} If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function inboundGet(data?: InboundsGetRq): Promise<InboundsGetRs> {
  InboundsGetRqSchema.parse(data ?? {});
  const response = await apiClient.get<InboundsGetRs>('/servers/inbounds', {
    params: data,
  });
  return response.data;
}

/**
 * Gets the count of all server inbounds (optionally, for a specific server).
 *
 * @param {InboundsCountRq | undefined} data - The parameters to filter the server inbounds.
 * @returns {Promise<InboundsCountRs>} The count of server inbounds.
 * @throws {AxiosError | ZodError} If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function inboundCount(data?: InboundsCountRq): Promise<InboundsCountRs> {
  InboundsCountRqSchema.parse(data ?? {});
  const response = await apiClient.get<InboundsCountRs>('/servers/inbounds/count', {
    params: data,
  });
  return response.data;
}

/**
 * Creates a new server inbound with the given data for the server with the given UUID.
 *
 * @param {Uuid} server_id - The UUID of the server to create the inbound for.
 * @param {InboundsPostRq} data - The server inbound data.
 * @returns {Promise<InboundsPostRs>} The response message with the created server inbound data.
 * @throws {AxiosError | ZodError} If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function inboundPost(server_id: Uuid, data: InboundsPostRq): Promise<InboundsPostRs> {
  UuidSchema.parse(server_id);
  const response = await apiClient.post<InboundsPostRs>(`/servers/inbounds/${server_id}`, data);
  return response.data;
}

/**
 * Gets the data of a specific server inbound by his UUID.
 *
 * @param {Uuid} server_inbound_id - The UUID of the server inbound to get.
 * @returns {Promise<InboundsGetByIdRs>} The response data with the server inbound data.
 * @throws {AxiosError | ZodError} If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function inboundGetById(server_inbound_id: Uuid): Promise<InboundsGetByIdRs> {
  UuidSchema.parse(server_inbound_id);
  const response = await apiClient.get<InboundsGetByIdRs>(`/servers/inbounds/${server_inbound_id}`);
  return response.data;
}

/**
 * Updates the server inbound with the given UUID with the given new data.
 *
 * @param {string} server_inbound_id - The UUID of the server inbound to update.
 * @param {InboundsPatchRq} data - The new server inbound data.
 * @returns {Promise<InboundsPatchRs>} The response message with the updated server inbound data.
 * @throws {AxiosError | ZodError} If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function inboundPatch(
  server_inbound_id: Uuid,
  data: InboundsPatchRq,
): Promise<InboundsPatchRs> {
  UuidSchema.parse(server_inbound_id);
  InboundsPatchRqSchema.parse(data);
  const response = await apiClient.patch<InboundsPatchRs>(
    `/servers/inbounds/${server_inbound_id}`,
    data,
  );
  return response.data;
}
