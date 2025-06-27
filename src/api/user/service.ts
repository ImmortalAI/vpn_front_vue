import apiClient from '@/utils/apiClient';
import {
  UserAllGetRsSchema,
  UserGetRsSchema,
  UserPatchRsSchema,
  type UserAllGetRs,
  type UserGetRs,
  type UserPatchRq,
  type UserPatchRs,
} from './schema';

/**
 * Get the data of the current authorized user
 *
 * @returns {Promise<UserGetRs>} User data.
 * @throws If the request fails.
 */
export async function userGet(): Promise<UserGetRs> {
  try {
    const res = await apiClient.get('/user');
    return UserGetRsSchema.parse(res.data);
  } catch (error) {
    throw error;
  }
}

/**
 * Update the user data for a specific user UUID.
 *
 * @param {string} userId - The UUID of the user to update.
 * @param {UserPatchRq} request - The request object containing the user data to update.
 * @returns {Promise<UserPatchRs>} The response data with status message.
 * @throws If the request fails.
 */
export async function userPatch(userId: string, request: UserPatchRq): Promise<UserPatchRs> {
  try {
    const res = await apiClient.patch(`/user/${userId}`, request);
    return UserPatchRsSchema.parse(res.data);
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
export async function userAll(): Promise<UserAllGetRs> {
  try {
    const res = await apiClient.get('/user/all');
    return UserAllGetRsSchema.parse(res.data);
  } catch (error) {
    throw error;
  }
}
