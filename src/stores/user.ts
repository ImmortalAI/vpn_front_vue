import { userSelf } from '@/api/user/service';
import type { User } from '@/api/user/schema';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { AuthLoginRq } from '@/api/auth/schema';
import { authLogin, authLogout } from '@/api/auth/service';

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null);

  const loggedIn = computed(() => user.value !== null);

  const refreshUserData = async (): Promise<boolean> => {
    return await userSelf()
      .then((response) => {
        user.value = response;
        return true;
      })
      .catch(() => {
        if (user.value) {
          user.value = null;
          console.warn('User was logged out');
        }
        console.log('User not logged in');
        return false;
      });
  };

  const logMeIn = async (loginData: AuthLoginRq) => {
    await authLogin(loginData)
      .then(async () => {
        await refreshUserData();
      })
      .catch((error) => {
        console.error('Error occurred while trying to log in', error);
      });
  };

  const logMeOut = async () => {
    await authLogout()
      .then(() => {
        user.value = null;
      })
      .catch((e) => {
        console.error('Error occurred while trying to log out', e);
      });
  };

  return { user, loggedIn, refreshUser: refreshUserData, logMeIn, logMeOut };
});
