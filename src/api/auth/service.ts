import apiClient from '@/utils/apiClient';
import {
  type AuthTgCodeRs,
  type AuthLoginRq,
  type AuthTgCodeRq,
  AuthLoginRsSchema,
  AuthTgCodeRsSchema,
  type AuthLoginRs,
  AuthLogoutRsSchema,
  AuthRefreshRsSchema,
  type AuthRefreshRs,
  type AuthLogoutRs,
  AuthTgCodeRqSchema,
  AuthLoginRqSchema,
} from '@/api/auth/schema';

/**
 * Send a Telegram code to the user.
 *
 * @param {AuthTgCodeRq} request - Object with Telegram ID.
 * @returns {Promise<AuthTgCodeRs>} The response data with status message.
 * @throws If the request fails.
 */
export async function authTgCode(request: AuthTgCodeRq): Promise<AuthTgCodeRs> {
  try {
    AuthTgCodeRqSchema.parse(request);
    const response = await apiClient.post('/auth/tg_code', request);
    return AuthTgCodeRsSchema.parse(response.data);
  } catch (error) {
    console.error('Error occurred while trying to send Telegram code', error);
    throw error;
  }
}

/**
 * Log in the user with the provided Telegram ID and Telegram code.
 *
 * @param {AuthLoginRq} request - Object with Telegram ID and Telegram code.
 * @returns {Promise<AuthLoginRs>} The response data with status message.
 * @throws If the request fails.
 */
export async function authLogin(request: AuthLoginRq): Promise<AuthLoginRs> {
  try {
    AuthLoginRqSchema.parse(request);
    const response = await apiClient.post('/auth/login', request);
    return AuthLoginRsSchema.parse(response.data);
  } catch (error) {
    console.error('Error occurred while trying to log in', error);
    throw error;
  }
}

/**
 * Refreshes the user's token.
 *
 * @returns {Promise<AuthRefreshRs>} The response data with status message.
 * @throws If the request fails.
 */
export async function authRefresh(): Promise<AuthRefreshRs> {
  try {
    const response = await apiClient.get('/auth/refresh');
    return AuthRefreshRsSchema.parse(response.data);
  } catch (error) {
    console.error('Error occurred while trying to refresh token', error);
    throw error;
  }
}

/**
 * Log out the current user.
 *
 * @returns {Promise<AuthLogoutRs>} The response data with status message.
 * @throws If the request fails.
 */
export async function authLogout(): Promise<AuthLogoutRs> {
  try {
    const response = await apiClient.post('/auth/logout');
    return AuthLogoutRsSchema.parse(response.data);
  } catch (error) {
    console.error('Error occurred while trying to log out', error);
    throw error;
  }
}
