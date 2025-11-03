// #region imports
import apiClient from '@/utils/apiClient';
import {
  UserCountRsSchema,
  UserGetByIdRqSchema,
  UserGetByIdRsSchema,
  UserGetRqSchema,
  UserGetRsSchema,
  UserPatchRqSchema,
  UserPatchRsSchema,
  UserSelfGetRsSchema,
  type UserCountRs,
  type UserGetByIdRq,
  type UserGetByIdRs,
  type UserGetRq,
  type UserGetRs,
  type UserPatchRq,
  type UserPatchRs,
  type UserSelfGetRs,
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
  const response = await apiClient.get('/users', {
    params: data ?? {},
  });
  return UserGetRsSchema.parse(response.data);
}

/**
 * Gets the count of all users.
 *
 * @returns {Promise<UserCountRs>} The count of users.
 * @throws {AxiosError | ZodError} If the request fails.
 */
export async function userCount(): Promise<UserCountRs> {
  const response = await apiClient.get(`/users/count`);
  return UserCountRsSchema.parse(response.data);
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
  const response = await apiClient.patch(`/users/${userId}`, request);
  return UserPatchRsSchema.parse(response.data);
}

export async function getUserById(data: UserGetByIdRq): Promise<UserGetByIdRs> {
  UserGetByIdRqSchema.parse(data);
  const response = await apiClient.get(`/users/${data.user_id}`);
  return UserGetByIdRsSchema.parse(response.data);
}

/**
 * Get the data of the current authorized user.
 *
 * @returns {Promise<UserSelfGetRs>} The user data.
 * @throws {AxiosError | ZodError} If the request fails.
 */
export async function userSelf(): Promise<UserSelfGetRs> {
  const response = await apiClient.get('/users/me');
  return UserSelfGetRsSchema.parse(response.data);
}
