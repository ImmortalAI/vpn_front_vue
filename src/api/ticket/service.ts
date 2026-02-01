// #region imports
import apiClient from '@/utils/apiClient';
import {
  TicketNewMessageRqSchema,
  type TicketCloseTicketPatchRs,
  type TicketGetByIdRs,
  type TicketGetRs,
  type TicketNewMessageRq,
  type TicketNewMessageRs,
} from '@/api/ticket/schema';
import { UuidSchema, type Uuid } from '@/api/base/schema';
// #endregion

/**
 * Get the list of all tickets and return their data.
 *
 * @returns {Promise<TicketGetRs>} A list of tickets data.
 * @throws {AxiosError | ZodError} If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function ticketGet(): Promise<TicketGetRs> {
  const response = await apiClient.get<TicketGetRs>('/tickets');
  return response.data;
}

/**
 * Get the data of a specific ticket.
 *
 * @param {string} ticketID - The UUID of the ticket to get.
 * @returns {Promise<TicketGetByIdRs>} The response data with the ticket data.
 * @throws {AxiosError | ZodError} If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function ticketGetById(ticketID: string): Promise<TicketGetByIdRs> {
  UuidSchema.parse(ticketID);
  const response = await apiClient.get<TicketGetByIdRs>(`/tickets/${ticketID}`);
  return response.data;
}

/**
 * Send a new message to a specific ticket.
 *
 * @param {string} ticketID - The UUID of the ticket to send the message.
 * @param {TicketNewMessageRq} message - Message to send.
 * @returns {Promise<TicketNewMessageRs>} The response data with status message.
 * @throws {AxiosError | ZodError} If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function ticketNewMessage(
  ticketID: string,
  message: TicketNewMessageRq,
): Promise<TicketNewMessageRs> {
  UuidSchema.parse(ticketID);
  TicketNewMessageRqSchema.parse(message);
  const response = await apiClient.post<TicketNewMessageRs>(
    `/tickets/${ticketID}/messages`,
    message,
  );
  return response.data;
}

/**
 * Close a specific ticket.
 *
 * @param {Uuid} ticketID - The UUID of the ticket to close.
 * @returns {Promise<TicketCloseTicketPatchRs>} The response data with status message.
 * @throws {AxiosError | ZodError} If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function ticketCloseTicket(ticketID: Uuid): Promise<TicketCloseTicketPatchRs> {
  UuidSchema.parse(ticketID);
  const response = await apiClient.patch<TicketCloseTicketPatchRs>(`/tickets/${ticketID}/close`);
  return response.data;
}
