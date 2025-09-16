import apiClient from '@/utils/apiClient';
import {
  NotificationPostRqSchema,
  NotificationPostRsSchema,
  type NotificationPostRq,
  type NotificationPostRs,
} from '@/api/notifications/schema';

/**
 * Creates a new notification with the given data (with different languages).
 *
 * @param {NotificationPostRq} request - The request object containing the notification data.
 * @returns {Promise<NotificationPostRs>} The response message with the created notification data.
 * @throws If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function notificationPost(request: NotificationPostRq): Promise<NotificationPostRs> {
  try {
    NotificationPostRqSchema.parse(request);
    const response = await apiClient.post('/notifications', request);
    return NotificationPostRsSchema.parse(response.data);
  } catch (e) {
    throw e;
  }
}
