// #region imports
import apiClient from '@/utils/apiClient';
import {
  NotificationPostRqSchema,
  type NotificationPostRq,
  type NotificationPostRs,
} from '@/api/notifications/schema';
// #endregion

/**
 * Creates a new notification with the given data (with different languages).
 *
 * @param {NotificationPostRq} request - The request object containing the notification data.
 * @returns {Promise<NotificationPostRs>} The response message with the created notification data.
 * @throws {AxiosError | ZodError} If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function notificationPost(request: NotificationPostRq): Promise<NotificationPostRs> {
  NotificationPostRqSchema.parse(request);
  const response = await apiClient.post<NotificationPostRs>('/notifications', request);
  return response.data;
}
