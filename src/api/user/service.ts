import apiClient from '@/utils/apiClient';
import {
  UserCountRsSchema,
  UserGetRqSchema,
  UserGetRsSchema,
  UserPatchRqSchema,
  UserPatchRsSchema,
  UserSelfGetRsSchema,
  type UserCountRs,
  type UserGetRq,
  type UserGetRs,
  type UserPatchRq,
  type UserPatchRs,
  type UserSelfGetRs,
} from '@/api/user/schema';
import { UuidSchema, type Uuid } from '@/api/base/schema';

/**
 * Get the data of the current authorized user
 *
 * @returns {Promise<UserGetRs>} User data.
 * @throws If the request fails.
 */
export async function userGet(data: UserGetRq): Promise<UserGetRs> {
  try {
    UserGetRqSchema.parse(data);
    const response = await apiClient.get('/users', {
      params: data,
    });
    return UserGetRsSchema.parse(response.data);
  } catch (error) {
    throw error;
  }
}

/**
 * Gets the count of all users.
 *
 * @returns {Promise<UserCountRs>} The count of users.
 * @throws If the request fails.
 */
export async function userCount(): Promise<UserCountRs> {
  try {
    const response = await apiClient.get(`/users/count`);
    return UserCountRsSchema.parse(response.data);
  } catch (error) {
    throw error;
  }
}

/**
 * Update the user data for a specific user UUID.
 *
 * @param {Uuid} userId - The UUID of the user to update.
 * @param {UserPatchRq} request - The request object containing the user data to update.
 * @returns {Promise<UserPatchRs>} The response data with status message.
 * @throws If the request fails.
 */
export async function userPatch(userId: Uuid, request: UserPatchRq): Promise<UserPatchRs> {
  try {
    UuidSchema.parse(userId);
    UserPatchRqSchema.parse(request);
    const response = await apiClient.patch(`/users/${userId}`, request);
    return UserPatchRsSchema.parse(response.data);
  } catch (error) {
    throw error;
  }
}

/**
 * Get the list of all users data.
 *
 * @returns {Promise<UserAllGetRs>} An array of user data.
 * @throws If the request fails.
 */
export async function userSelf(): Promise<UserSelfGetRs> {
  try {
    const response = await apiClient.get('/users/me');
    return UserSelfGetRsSchema.parse(response.data);
  } catch (error) {
    throw error;
  }
}
