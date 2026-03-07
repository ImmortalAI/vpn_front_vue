<template>
  <Dialog v-model:visible="visible" modal :header="header">
    <div v-for="dataKey in Object.keys(dataInEdit)" :key="dataKey" class="flex items-center gap-2">
      <Checkbox binary v-model="dataInEdit[dataKey]" :inputId="dataKey" />
      <label :for="dataKey">{{ locale[dataKey] || 'Unknown' }}</label>
    </div>
    <div class="flex justify-end">
      <Button @click="save">Save</Button>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

const visible = defineModel<boolean>('visible', { required: true });

const props = defineProps<{
  header: string;
  data: Record<string, boolean>;
  locale: Record<string, string>;
}>();

const emits = defineEmits<{
  save: [value: Record<string, boolean>];
}>();

const dataInEdit = ref<Record<string, boolean>>(props.data);

watch(
  () => props.data,
  () => {
    dataInEdit.value = { ...props.data };
  },
);

const save = (e: PointerEvent) => {
  e.preventDefault();
  emits('save', dataInEdit.value);
  visible.value = false;
};
</script>
