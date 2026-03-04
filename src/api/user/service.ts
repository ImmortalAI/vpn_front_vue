// #region imports
import apiClient from '@/utils/apiClient';
import { type User, type UserPatch, UserPatchSchema, type UserSettings } from '@/api/user/schema';
import { PaginationSchema, UuidSchema, type Pagination, type Uuid } from '@/api/base/schema';
// #endregion

/**
 * Get the data of all users.
 *
 * @param {Pagination} data - The request data.
 * @returns {Promise<User[]>} The response data with the user data.
 * @throws {AxiosError | ZodError} If the request fails.
 */
export async function userGet(data?: Pagination): Promise<User[]> {
  PaginationSchema.parse(data ?? {});
  const response = await apiClient.get<User[]>('/users', {
    params: data ?? {},
  });
  response.data.map(
    (user) =>
      (user.settings = Object.fromEntries(
        Object.entries(user.settings).filter((v) => typeof v[1] === 'boolean'),
      ) as UserSettings),
  );
  return response.data;
}

/**
 * Gets the count of all users.
 *
 * @returns {Promise<number>} The count of users.
 * @throws {AxiosError | ZodError} If the request fails.
 */
export async function userCount(): Promise<number> {
  const response = await apiClient.get<number>(`/users/count`);
  return response.data;
}

/**
 * Update the user data for a specific user UUID.
 *
 * @param {Uuid} userId - The UUID of the user to update.
 * @param {UserPatch} request - The request object containing the user data to update.
 * @returns {Promise<User>} The response data with status message.
 * @throws {AxiosError | ZodError} If the request fails.
 */
export async function userPatch(userId: Uuid, request: UserPatch): Promise<User> {
  UuidSchema.parse(userId);
  UserPatchSchema.parse(request);
  const response = await apiClient.patch<User>(`/users/${userId}`, request);
  return response.data;
}

/**
 * Gets the data of a specific user by their UUID.
 *
 * @param {Uuid} userId - The UUID of the user to get.
 * @returns {Promise<User>} The response data with the user data.
 * @throws {AxiosError | ZodError} If the request fails.
 */
export async function userGetById(userId: Uuid): Promise<User> {
  UuidSchema.parse(userId);
  const response = await apiClient.get<User>(`/users/${userId}`);
  return response.data;
}

/**
 * Get the data of the current authorized user.
 *
 * @returns {Promise<User>} The user data.
 * @throws {AxiosError | ZodError} If the request fails.
 */
export async function userSelf(): Promise<User> {
  const response = await apiClient.get<User>('/users/me');
  return response.data;
}
