import apiClient from '@/utils/apiClient';
import type { AuthLoginRq, AuthTgCodeRq } from './schema';

/**
 * Send a Telegram login code to the user.
 *
 * @param request - The request object, which must contain the Telegram ID.
 * @throws {Error} - If the API call fails.
 */
export async function authTgCode(request: AuthTgCodeRq) {
  try {
    await apiClient.post('/auth/tg_code', request);
  } catch (error) {
    throw error;
  }
}

/**
 * Login the user with the provided Telegram ID and code.
 *
 * @param request - The request object, which must contain the Telegram ID and code.
 * @throws {Error} - If the API call fails.
 */
export async function authLogin(request: AuthLoginRq) {
  try {
    await apiClient.post('/auth/login', request);
  } catch (error) {
    throw error;
  }
}
