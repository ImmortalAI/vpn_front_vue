<template>
  <Dialog v-model:visible="visible" modal :header="inboundInEdit.id == '' ? 'Create New Inbound' : 'Edit Inbound => ' + inboundInEdit.name
    " class="w-[60vw] h-[80vh]">
    <Fluid class="flex flex-col gap-4">
      <div class="flex flex-col gap-4">
        <span class="text-xl p-2 border-b border-neutral-600">Main Info</span>
        <FloatLabel class="float-label-spacer" variant="in">
          <InputText inputId="id-input" v-model="inboundInEdit.id" disabled />
          <label for="id-input">Inbound Id</label>
        </FloatLabel>
        <FloatLabel class="float-label-spacer" variant="in">
          <InputNumber inputId="name-input" v-model="inboundInEdit.inbound_id" :min="0" />
          <label for="name-input">Inbound Internal Id</label>
        </FloatLabel>
        <FloatLabel class="float-label-spacer" variant="in">
          <InputText inputId="name-input" v-model="inboundInEdit.name" />
          <label for="name-input">Display Name</label>
        </FloatLabel>
        <FloatLabel class="float-label-spacer" variant="in">
          <Textarea inputId="description-input" v-model="inboundInEdit.description" />
          <label for="description-input">Description</label>
        </FloatLabel>
      </div>
      <div class="flex flex-col gap-4">
        <span class="text-xl p-2 border-b border-neutral-600">Main Settings</span>
        <div class="flex gap-4">
          <FloatLabel class="float-label-spacer" variant="in">
            <InputText inputId="protocol-input" v-model="inboundInEdit.protocol" />
            <label for="protocol-input">Inbound Protocol</label>
          </FloatLabel>
          <FloatLabel class="float-label-spacer" variant="in">
            <InputText inputId="template-input" v-model="inboundInEdit.template" />
            <label for="template-input">Inbound Template</label>
          </FloatLabel>
        </div>
        <div class="flex gap-4 items-center">
          <Checkbox binary v-model="inboundInEdit.is_available" inputId="is-available-input" />
          <label for="is-available-input">Is Available</label>
        </div>
      </div>
      <Button label="Save" @click="saveNewData" />
    </Fluid>
  </Dialog>
</template>

<script setup lang="ts">
import { getEmptyInbound, type Inbound } from '@/api/server/schema';
import { ref, watch } from 'vue';

const props = defineProps<{
  inbound: Inbound | null;
}>();

const visible = defineModel<boolean>('visible', { required: true });

const emits = defineEmits<{
  saveInbound: [value: Inbound];
}>();

const saveNewData = () => {
  emits('saveInbound', inboundInEdit.value);
  visible.value = false;
};

const inboundInEdit = ref<Inbound>(getEmptyInbound());

watch(
  () => props.inbound,
  () => {
    if (!props.inbound) {
      inboundInEdit.value = getEmptyInbound();
    } else {
      inboundInEdit.value = { ...props.inbound };
    }
  },
);
</script>
