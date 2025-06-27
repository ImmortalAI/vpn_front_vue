<template>
  <h1>Страница не найдена</h1>
  <p>
    Путь:
    {{
      typeof route.params.pathMatch === 'string'
        ? route.params.pathMatch
        : route.params.pathMatch.join('/')
    }}
  </p>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
</script>
