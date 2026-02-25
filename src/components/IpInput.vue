<template>
  <FloatLabel variant="in" class="float-label-spacer">
    <InputText :model-value="ip" @update:model-value="updateInput" :class="props.class" placeholder="127.0.0.1"
      :invalid="!isValidIp" :id="id" />
    <label :for="id">{{ label }}</label>
  </FloatLabel>
</template>

<script setup lang="ts">
import { computed, nextTick, useId } from 'vue';
import * as z from 'zod';

const props = defineProps<{
  class?: string;
}>();

const id = useId();

const ip = defineModel<string>('ip', { required: true });
const label = defineModel<string>('label', { default: '' });

const isValidIp = computed(() => z.ipv4().safeParse(ip.value).success);

const ipv4ProgressRegex = /^$|^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])((\.((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9]))?){0,3})$/;

const updateInput = (newValue?: string) => {
  if (!newValue) return;

  const oldValue = ip.value;

  if (newValue.match(ipv4ProgressRegex) == null) {
    newValue = oldValue;
  }
  else if (newValue.match(/^(\d{1,3}\.){0,2}\d{3}$/g) != null && !oldValue.endsWith('.')) {
    newValue += '.';
  }

  ip.value = '';
  nextTick(() => ip.value = newValue);
};
</script>
