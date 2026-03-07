// #region imports
import apiClient from '@/utils/apiClient';
import { NotificationSchema, type Notification } from '@/api/notifications/schema';
import type { MessageRs } from '../base/schema';
// #endregion

/**
 * Creates a new notification with the given data (with different languages).
 *
 * @param {NotificationPostRq} request - The request object containing the notification data.
 * @returns {Promise<NotificationPostRs>} The response message with the created notification data.
 * @throws {AxiosError | ZodError} If the API request fails or the response data cannot be parsed to the expected schema.
 */
export async function notificationPost(request: Notification): Promise<MessageRs> {
  NotificationSchema.parse(request);
  const response = await apiClient.post<MessageRs>('/notifications', request);
  return response.data;
}
