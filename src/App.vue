<script setup lang="ts"></script>

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
