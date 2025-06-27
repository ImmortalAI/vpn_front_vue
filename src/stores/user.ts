import { userGet } from '@/api/user/service';
import type { User } from '@/api/user/schema';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null);

  const refreshUser = async () => {
    try {
      const res = await userGet();
      user.value = res;
    } catch (error) {
      throw error;
    }
  };

  return { user, refreshUser };
});
