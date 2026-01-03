<template>
  <header>
    <div class="p-4 border-b border-neutral-800 flex justify-between">
      <span class="text-2xl text-emerald-500">VPN Manager</span>
      <Button v-if="user.loggedIn" @click="logout" icon="pi pi-sign-out"></Button>
    </div>
  </header>

  <RouterView />

  <Button icon="pi pi-chevron-left" @click="router.push({ name: 'main' })" v-if="route.meta.canRedirectHome"
    class="absolute! bottom-8 right-8" />
  <Toast position="bottom-right" />
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const route = useRoute();
const user = useUserStore();

const logout = async () => {
  await user.logMeOut();
  router.push({ name: 'login' });
}
</script>
