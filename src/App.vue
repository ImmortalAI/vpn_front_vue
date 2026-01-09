<template>
  <div class="flex flex-col gap-4 h-screen w-screen">
    <HeaderComponent />
    <div class="w-full h-full scroll-auto">
      <RouterView />
    </div>
    <Toast position="bottom-right" />
  </div>
</template>

<script setup lang="ts"></script>
