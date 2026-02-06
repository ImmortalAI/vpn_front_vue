// #region imports
import apiClient from '@/utils/apiClient';
import {
  UserGetByIdRqSchema,
  UserGetRqSchema,
  UserPatchRqSchema,
  type UserCountRs,
  type UserGetByIdRq,
  type UserGetByIdRs,
  type UserGetRq,
  type UserGetRs,
  type UserPatchRq,
  type UserPatchRs,
  type UserSelfGetRs,
  type UserSettings,
} from '@/api/user/schema';
import { UuidSchema, type Uuid } from '@/api/base/schema';
// #endregion

/**
 * Get the data of all users.
 *
 * @param {UserGetRq} data - The request data.
 * @returns {Promise<UserGetRs>} The response data with the user data.
 * @throws {AxiosError | ZodError} If the request fails.
 */
export async function userGet(data?: UserGetRq): Promise<UserGetRs> {
  UserGetRqSchema.parse(data ?? {});
  const response = await apiClient.get<UserGetRs>('/users', {
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
 * @returns {Promise<UserCountRs>} The count of users.
 * @throws {AxiosError | ZodError} If the request fails.
 */
export async function userCount(): Promise<UserCountRs> {
  const response = await apiClient.get<UserCountRs>(`/users/count`);
  return response.data;
}

/**
 * Update the user data for a specific user UUID.
 *
 * @param {Uuid} userId - The UUID of the user to update.
 * @param {UserPatchRq} request - The request object containing the user data to update.
 * @returns {Promise<UserPatchRs>} The response data with status message.
 * @throws {AxiosError | ZodError} If the request fails.
 */
export async function userPatch(userId: Uuid, request: UserPatchRq): Promise<UserPatchRs> {
  UuidSchema.parse(userId);
  UserPatchRqSchema.parse(request);
  const response = await apiClient.patch<UserPatchRs>(`/users/${userId}`, request);
  return response.data;
}

/**
 * Gets the data of a specific user by their UUID.
 *
 * @param {UserGetByIdRq} data - The request data containing the user UUID.
 * @returns {Promise<UserGetByIdRs>} The response data with the user data.
 * @throws {AxiosError | ZodError} If the request fails.
 */
export async function userGetById(data: UserGetByIdRq): Promise<UserGetByIdRs> {
  UserGetByIdRqSchema.parse(data);
  const response = await apiClient.get<UserGetByIdRs>(`/users/${data.user_id}`);
  return response.data;
}

/**
 * Get the data of the current authorized user.
 *
 * @returns {Promise<UserSelfGetRs>} The user data.
 * @throws {AxiosError | ZodError} If the request fails.
 */
export async function userSelf(): Promise<UserSelfGetRs> {
  const response = await apiClient.get<UserSelfGetRs>('/users/me');
  return response.data;
}
