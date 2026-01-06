<template>
  <InputText v-model="ip" :class="props.class" placeholder="127.0.0.1" :invalid="!isValidIp" />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import * as z from 'zod';

const props = defineProps<{
  modelValue: string | null;
  class?: string;
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const ip = ref(props.modelValue || '');
const isValidIp = computed(() => z.ipv4().safeParse(ip.value).success);

watch(
  () => props.modelValue,
  () => {
    if (z.ipv4().safeParse(props.modelValue).success) {
      ip.value = props.modelValue || '';
    }
  },
);

watch(ip, () => {
  if (ip.value.match(/^(\d{1,3}\.){0,2}\d{3}$/g) != null) {
    ip.value += '.';
  }
  emits('update:modelValue', ip.value);
});
</script>
