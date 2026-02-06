<template>
  <Dialog v-model:visible="visible" modal :header="tariffInEdit.id == '' ? 'Create New Tariff' : 'Edit Tariff => ' + tariffInEdit.name
    " class="w-[60vw] h-[80vh]">
    <Fluid class="flex flex-col gap-4">
      <div class="flex flex-col gap-4">
        <span class="text-xl p-2 border-b border-neutral-600">Main Settings</span>
        <FloatLabel class="float-label-spacer" variant="in">
          <InputText inputId="name-input" v-model="tariffInEdit.name" />
          <label for="name-input">Tariff Name</label>
        </FloatLabel>
        <FloatLabel class="float-label-spacer" variant="in">
          <Textarea inputId="description-input" v-model="tariffInEdit.description" />
          <label for="description-input">Description</label>
        </FloatLabel>
      </div>
      <div class="flex flex-col gap-4">
        <span class="text-xl p-2 border-b border-neutral-600">Parameters</span>
        <div class="flex gap-4">
          <FloatLabel class="float-label-spacer" variant="in">
            <InputNumber inputId="duration-input" v-model="tariffInEdit.duration" :useGrouping="false" :min="0"
              :max="65535" />
            <label for="duration-input">Duration in days</label>
          </FloatLabel>
          <FloatLabel class="float-label-spacer" variant="in">
            <InputNumber inputId="traffic-input" v-model="tariffInEdit.traffic" :useGrouping="false" :min="0"
              suffix=" GiB" />
            <label for="traffic-input">Traffic in GiB</label>
          </FloatLabel>
        </div>
        <div class="flex gap-4">
          <FloatLabel class="float-label-spacer" variant="in">
            <InputNumber inputId="price-input" v-model="tariffInEdit.price" mode="currency" currency="RUB" />
            <label for="price-input">Price in RUB</label>
          </FloatLabel>
          <FloatLabel class="float-label-spacer" variant="in">
            <InputNumber inputId="price-reset-input" v-model="tariffInEdit.price_of_traffic_reset" mode="currency"
              currency="RUB" />
            <label for="price-reset-input">Reset Price in RUB</label>
          </FloatLabel>
        </div>
      </div>
      <div class="flex flex-col gap-4">
        <span class="text-xl p-2 border-b border-neutral-600">Other</span>
        <div class="flex gap-4">
          <div class="flex items-center gap-2">
            <Checkbox inputId="with-access-input" v-model="tariffInEdit.with_access" binary />
            <label for="with-access-input">With access</label>
          </div>
          <div class="flex items-center gap-2">
            <Checkbox inputId="with-un-inbounds-input" v-model="tariffInEdit.with_unavailable_inbounds" binary />
            <label for="with-un-inbounds-input">With unavailable inbounds</label>
          </div>
          <div class="flex items-center gap-2">
            <Checkbox inputId="special-input" v-model="tariffInEdit.is_special" binary />
            <label for="special-input">Is special</label>
          </div>
        </div>
      </div>
      <Button label="Save" @click="saveNewData" />
    </Fluid>
  </Dialog>
</template>

<script setup lang="ts">
import { getEmptyTariff, type Tariff } from '@/api/tariff/schema';
import { ref, watch } from 'vue';

const props = defineProps<{
  tariff: Tariff | null;
}>();

const visible = defineModel<boolean>('visible', { required: true });

const emits = defineEmits<{
  saveTariff: [value: Tariff];
}>();

const saveNewData = () => {
  emits('saveTariff', tariffInEdit.value);
  visible.value = false;
};

// Create an empty Tariff object
const tariffInEdit = ref<Tariff>(getEmptyTariff());

watch(
  () => props.tariff,
  () => {
    if (!props.tariff) {
      tariffInEdit.value = getEmptyTariff();
    }
    else {
      tariffInEdit.value = { ...props.tariff };
    }
  },
);
</script>
