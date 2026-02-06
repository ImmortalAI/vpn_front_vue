<template>
  <div class="flex flex-col min-h-screen">
    <AppHeader />
    <div class="grow pt-28">
      <RouterView />
    </div>
    <AppFooter />
    <Toast position="bottom-right" />
  </div>
</template>

<script setup lang="ts"></script>
