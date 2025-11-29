<template>
  <h1>Страница не найдена</h1>
  <p>
    Путь:
    {{
      typeof route.params.pathMatch === 'string'
        ? route.params.pathMatch
        : typeof route.params.pathMatch === 'object' ?
          route.params.pathMatch.join('/') : 'UNKNOWN'
    }}
  </p>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
</script>
