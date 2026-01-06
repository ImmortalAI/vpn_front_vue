<template>
  <div class="flex flex-col p-16 gap-2">
    <h1 class="text-4xl text-cyan-500">This is strange...</h1>
    <h2 class="text-3xl text-cyan-500">This page doesn't exist</h2>
    <h2>Double check it please</h2>
    <RouterLink to="/" class="underline text-cyan-500">Go Home</RouterLink>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="css" scoped>
@reference '@/assets/styles.css';

h1 {
  @apply text-4xl font-bold text-cyan-500;
}

h2 {
  @apply text-2xl font-semibold text-cyan-500;
}
</style>
