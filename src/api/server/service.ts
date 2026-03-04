// #region imports
import apiClient from '@/utils/apiClient';
import {
  InboundPaginationSchema,
  NewInboundSchema,
  NewServerSchema,
  UpdateInboundSchema,
  PartialServerSchema,
  type Inbound,
  type InboundPagination,
  type NewInbound,
  type NewServer,
  type Server,
  type UpdateInbound,
  type PartialServer,
} from '@/api/server/schema';
import { PaginationSchema, UuidSchema, type Pagination, type Uuid } from '@/api/base/schema';
import z from 'zod';
// #endregion

/**
 * Coerces a server object into a new server object with parsed dates.
 * @param server - The server object to coerce.
 * @returns A new server object with parsed dates.
 */
export function coerceServer(server: Server): Server {
  return {
    ...server,
    starting_date: z.coerce.date().parse(server.starting_date),
    closing_date: z.coerce.date().parse(server.closing_date),
  };
}

/**
 * Gets the list of all servers (optionally, with pagination).
 *
 * @param {Pagination | undefined} data - The parameters to filter the servers.
 * @returns {Promise<Server[]>} The response data with the server data.
 * @throws {AxiosError | ZodError} If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function serverGet(data?: Pagination): Promise<Server[]> {
  PaginationSchema.parse(data ?? {});
  const response = await apiClient.get<Server[]>('/servers', {
    params: data,
  });

  return response.data.map((server) => coerceServer(server));
}

/**
 * Creates a new server on the backend.
 *
 * @param {NewServer} data - The data of the server to create.
 * @returns {Promise<Server>} The response message with the created server data.
 * @throws {AxiosError | ZodError} If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function serverPost(data: NewServer): Promise<Server> {
  NewServerSchema.parse(data);
  const response = await apiClient.post<Server>('/servers', data);

  return coerceServer(response.data);
}

/**
 * Gets the count of all servers.
 *
 * @returns {Promise<number>} The count of servers.
 * @throws {AxiosError} If the API request fails.
 */
export async function serverCount(): Promise<number> {
  const response = await apiClient.get<number>('/servers/count');

  return response.data;
}

/**
 * Gets the data of a specific server by its UUID.
 *
 * @param {Uuid} server_id - The UUID of the server to get.
 * @returns {Promise<Server>} The response data with the server data.
 * @throws {AxiosError | ZodError} If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function serverGetById(server_id: Uuid): Promise<Server> {
  UuidSchema.parse(server_id);
  const response = await apiClient.get<Server>(`/servers/${server_id}`);

  return coerceServer(response.data);
}

/**
 * Patches an existing server with only the fields that have changed.
 *
 * @param {Uuid} serverID - The UUID of the server to patch.
 * @param {PartialServer} newData - The new server data.
 * @returns {Promise<Server>} The response message with the updated server data.
 * @throws {AxiosError | ZodError} If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function serverIdPatch(serverID: Uuid, newData: PartialServer): Promise<Server> {
  UuidSchema.parse(serverID);
  PartialServerSchema.parse(newData);
  const response = await apiClient.patch<Server>(`/servers/${serverID}`, newData);

  return coerceServer(response.data);
}

/**
 * Fetches the list of server inbounds (optionally, with pagination or for a specific server).
 *
 * @param {InboundPagination | undefined} data - The parameters to filter the server inbounds.
 * @returns {Promise<Inbound[]>} An array of server inbound data.
 * @throws {AxiosError | ZodError} If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function inboundGet(data?: InboundPagination): Promise<Inbound[]> {
  InboundPaginationSchema.parse(data ?? {});
  const response = await apiClient.get<Inbound[]>('/servers/inbounds', {
    params: data,
  });

  return response.data;
}

/**
 * Gets the count of server inbounds for the given server UUID (if specified) or all servers.
 *
 * @param {Uuid | undefined} server_id - The UUID of the server to get the count of inbounds for.
 * @returns {Promise<number>} The count of server inbounds.
 * @throws {AxiosError | ZodError} If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function inboundCount(server_id?: Uuid): Promise<number> {
  if (server_id) UuidSchema.parse(server_id);
  const response = await apiClient.get<number>('/servers/inbounds/count', {
    params: {
      server_id,
    },
  });

  return response.data;
}

/**
 * Creates a new server inbound with the given data.
 *
 * @param {Uuid} server_id - The UUID of the server to create the inbound for.
 * @param {NewInbound} data - The data of the server inbound to create.
 * @returns {Promise<Inbound>} The response message with the created server inbound data.
 * @throws {AxiosError | ZodError} If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function inboundPost(server_id: Uuid, data: NewInbound): Promise<Inbound> {
  UuidSchema.parse(server_id);
  NewInboundSchema.parse(data);
  const response = await apiClient.post<Inbound>(`/servers/inbounds/${server_id}`, data);

  return response.data;
}

/**
 * Gets the data of a specific server inbound by his UUID.
 *
 * @param {Uuid} server_inbound_id - The UUID of the server inbound to get.
 * @returns {Promise<Inbound>} The response data with the server inbound data.
 * @throws {AxiosError | ZodError} If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function inboundGetById(server_inbound_id: Uuid): Promise<Inbound> {
  UuidSchema.parse(server_inbound_id);
  const response = await apiClient.get<Inbound>(`/servers/inbounds/${server_inbound_id}`);

  return response.data;
}

/**
 * Patches an existing server inbound with the given data.
 *
 * @param {Uuid} server_inbound_id - The UUID of the server inbound to patch.
 * @param {UpdateInbound} data - The data of the server inbound to patch.
 * @returns {Promise<Inbound>} The response message with the patched server inbound data.
 * @throws {AxiosError | ZodError} If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function inboundPatch(server_inbound_id: Uuid, data: UpdateInbound): Promise<Inbound> {
  UuidSchema.parse(server_inbound_id);
  UpdateInboundSchema.parse(data);
  const response = await apiClient.patch<Inbound>(`/servers/inbounds/${server_inbound_id}`, data);

  return response.data;
}
