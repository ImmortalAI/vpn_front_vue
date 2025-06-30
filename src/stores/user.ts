import { userGet } from '@/api/user/service';
import type { User } from '@/api/user/schema';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null);

  const loggedIn = computed(() => user.value !== null);

  const refreshUser = async () => {
    try {
      const response = await userGet();
      user.value = response;
    } catch (error) {
      throw error;
    }
  };

  return { user, loggedIn, refreshUser };
});
