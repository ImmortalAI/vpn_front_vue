<template>
  <div class="flex flex-col gap-4 h-screen w-screen">
    <HeaderComponent />
    <RouterView class="h-full scroll-auto" />
    <Toast position="bottom-right" />
  </div>
</template>

<script setup lang="ts">
</script>
