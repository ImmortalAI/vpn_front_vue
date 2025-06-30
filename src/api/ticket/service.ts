import apiClient from '@/utils/apiClient';
import {
  TicketCloseTicketPatchRsSchema,
  TicketGetByIdRsSchema,
  TicketGetRsSchema,
  TicketNewMessageRsSchema,
  type TicketCloseTicketPatchRs,
  type TicketGetByIdRs,
  type TicketGetRs,
  type TicketNewMessageRq,
  type TicketNewMessageRs,
} from './schema';

/**
 * Get the list of all tickets and return their data.
 *
 * @returns {Promise<TicketGetRs>} A list of tickets data.
 * @throws If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function ticketGet(): Promise<TicketGetRs> {
  try {
    const response = await apiClient.get('/ticket');
    return TicketGetRsSchema.parse(response.data);
  } catch (error) {
    throw error;
  }
}

/**
 * Get the data of a specific ticket.
 *
 * @param {string} ticketID - The UUID of the ticket to get.
 * @returns {Promise<TicketGetByIdRs>} The response data with the ticket data.
 * @throws  If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function ticketGetById(ticketID: string): Promise<TicketGetByIdRs> {
  try {
    const response = await apiClient.get(`/ticket/${ticketID}`);
    return TicketGetByIdRsSchema.parse(response.data);
  } catch (error) {
    throw error;
  }
}

/**
 * Send a new message to a specific ticket.
 *
 * @param {string} ticketID - The UUID of the ticket to send the message.
 * @param {TicketNewMessageRq} message - Message to send.
 * @returns {Promise<TicketNewMessageRs>} The response data with status message.
 * @throws If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function ticketNewMessage(
  ticketID: string,
  message: TicketNewMessageRq,
): Promise<TicketNewMessageRs> {
  try {
    const response = await apiClient.post(`/ticket/new_message/${ticketID}`, message);
    return TicketNewMessageRsSchema.parse(response.data);
  } catch (error) {
    throw error;
  }
}

/**
 * Close a specific ticket.
 *
 * @param {string} ticketID - The UUID of the ticket to close.
 * @returns {Promise<TicketCloseTicketPatchRs>} The response data with status message.
 * @throws If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function ticketCloseTicket(ticketID: string): Promise<TicketCloseTicketPatchRs> {
  try {
    const response = await apiClient.patch(`/ticket/close_ticket/${ticketID}`);
    return TicketCloseTicketPatchRsSchema.parse(response.data);
  } catch (error) {
    throw error;
  }
}
