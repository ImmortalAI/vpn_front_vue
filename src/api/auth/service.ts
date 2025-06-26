import apiClient from '@/utils/apiClient';
import {
  // ts-ignore
  type AuthTgCodeRs,
  type AuthLoginRq,
  type AuthTgCodeRq,
  AuthLoginRsSchema,
  AuthTgCodeRsSchema,
  type AuthLoginRs,
} from './schema';

/**
 * Send a Telegram code to the user.
 *
 * @param {AuthTgCodeRq} request - Object with Telegram ID.
 * @returns {Promise<AuthTgCodeRs>} The response data with status message.
 * @throws If the request fails.
 */
export async function authTgCode(request: AuthTgCodeRq): Promise<AuthTgCodeRs> {
  try {
    const response = await apiClient.post('/auth/tg_code', request);
    return AuthTgCodeRsSchema.parse(response.data);
  } catch (error) {
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
    const response = await apiClient.post('/auth/login', request);
    return AuthLoginRsSchema.parse(response.data);
  } catch (error) {
    throw error;
  }
}
