<template>
  <header>
    <img alt="Vue logo" src="@/assets/logo.svg" width="125" height="125" />

    <div>
      <nav></nav>
    </div>
  </header>

  <RouterView />

  <Toast position="bottom-right" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import apiClient from './utils/apiClient';
import { useUserStore } from './stores/user';
import { useRouter } from 'vue-router';
import { isAxiosError } from 'axios';
import useErrorToast from './composables/useErrorToast';

onMounted(async () => {
  const user = useUserStore();
  const router = useRouter();
  const errorToast = useErrorToast();

  try {
    await apiClient.post('/auth/refresh');
    await user.refreshUser();
    router.push('/dashboard');
  } catch (e) {
    if (isAxiosError(e)) {
      errorToast.error(e);
    } else {
      throw e;
    }
  }
})
</script>
