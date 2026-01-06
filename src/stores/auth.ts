import { userSelf } from '@/api/user/service';
import type { User } from '@/api/user/schema';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { AuthLoginRq } from '@/api/auth/schema';
import { authLogin, authLogout } from '@/api/auth/service';
import { isAxiosError } from 'axios';
import type { ErrorRs } from '@/api/base/schema';
import { ZodError } from 'zod';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);

  const isAuthenticated = computed(() => user.value !== null);

  const isInitialized = ref(false);

  const initialize = async () => {
    if (isInitialized.value) return;

    isInitialized.value = true;
    try {
      const userReturned = await userSelf();
      user.value = userReturned;
    } catch {}
  };

  const refresh = async (): Promise<null | string> => {
    try {
      const userReturned = await userSelf();
      user.value = userReturned;
      return null;
    } catch {
      if (user.value) {
        user.value = null;
        return 'Session expired, please log in again';
      }
      return 'User not logged in';
    }
  };

  const login = async (loginData: AuthLoginRq): Promise<{ isOk: boolean; message: string }> => {
    try {
      const result = await authLogin(loginData);
      await refresh();
      return { isOk: true, message: result.message };
    } catch (e) {
      if (isAxiosError(e))
        return { isOk: true, message: (e.response?.data as ErrorRs).detail ?? 'Error logging in' };
      if (e instanceof ZodError) return { isOk: true, message: e.message };
      return { isOk: true, message: 'Unable to log in: unknown error' };
    }
  };

  const logout = async () => {
    try {
      await authLogout();
      user.value = null;
    } catch {}
  };

  return { user, isAuthenticated, isInitialized, initialize, login, logout, refresh };
});
