<template>
  <div class="flex justify-center items-center mb-[10%]">
    <div class="flex flex-col gap-4 border-2 border-neutral-600 rounded-2xl w-fit h-fit p-8">
      <h1 class="text-4xl font-bold">Dashboard</h1>
      <RouterLink to="/users" class="router-link-btn">Users</RouterLink>
      <RouterLink to="/tariffs" class="router-link-btn">Tariffs</RouterLink>
      <RouterLink to="/servers" class="router-link-btn">Servers</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="css" scoped>
@reference '@/assets/styles.css';

.router-link-btn {
  @apply border-2 border-surface-500 rounded-2xl p-2 w-48 text-center;
}
</style>
