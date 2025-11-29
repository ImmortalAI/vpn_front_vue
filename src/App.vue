<template>
  <header>
    <div>
      <nav></nav>
    </div>
  </header>

  <RouterView />

  <Button icon="pi pi-chevron-left" @click="router.push({ name: 'dashboard' })" v-if="route.meta.canRedirectHome"
    class="absolute! bottom-8 right-8" />
  <Toast position="bottom-right" />
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
</script>
