<template>
  <header class="p-4 border-b border-neutral-800 flex justify-between">
    <span class="text-2xl text-emerald-500 cursor-pointer" @click="router.push('/')"
      >VPN Manager</span
    >
    <div>
      <Button v-if="auth.isAuthenticated" @click="logout" icon="pi pi-sign-out" size="small" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const logout = async () => {
  await auth.logout();
  router.push({ name: 'login' });
};
</script>
