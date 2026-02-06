<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="
      serverInEdit.id == '' ? 'Create New Server' : 'Edit Server => ' + serverInEdit.display_name
    "
    class="w-[60vw] h-[80vh]"
  >
    <Fluid class="flex flex-col gap-4">
      <div class="flex flex-col gap-4">
        <span class="text-xl p-2 border-b border-neutral-600">Main Settings</span>
        <FloatLabel class="float-label-spacer" variant="in">
          <Textarea inputId="name-input" v-model="serverInEdit.display_name" />
          <label for="name-input">Display Name</label>
        </FloatLabel>
        <FloatLabel class="float-label-spacer" variant="in">
          <Textarea inputId="description-input" v-model="serverInEdit.description" />
          <label for="description-input">Description</label>
        </FloatLabel>
        <div class="flex gap-4">
          <FloatLabel class="float-label-spacer" variant="in">
            <DatePicker
              v-model="serverInEdit.starting_date"
              inputId="start-date-input"
              hourFormat="24"
              dateFormat="dd.mm.yy"
            />
            <label for="start-date-input">Starting Date</label>
          </FloatLabel>
          <FloatLabel class="float-label-spacer" variant="in">
            <DatePicker
              v-model="serverInEdit.closing_date"
              inputId="close-date-input"
              hourFormat="24"
              dateFormat="dd.mm.yy"
            />
            <label for="close-date-input">Closing Date</label>
          </FloatLabel>
        </div>
      </div>
      <div class="flex flex-col gap-4">
        <span class="text-xl p-2 border-b border-neutral-600">Panel Settings</span>
        <div class="flex gap-4">
          <FloatLabel class="float-label-spacer" variant="in">
            <InputNumber
              inputId="port-input"
              v-model="serverInEdit.panel_port"
              :useGrouping="false"
              :min="0"
              :max="65535"
            />
            <label for="port-input">Port</label>
          </FloatLabel>
          <FloatLabel class="float-label-spacer" variant="in">
            <InputText inputId="web-path-input" v-model="serverInEdit.panel_web_path" />
            <label for="web-path-input">Web Path</label>
          </FloatLabel>
        </div>
        <div class="flex gap-4">
          <FloatLabel class="float-label-spacer" variant="in">
            <InputText inputId="login-input" v-model="serverInEdit.panel_login" />
            <label for="login-input">Panel Login</label>
          </FloatLabel>
          <FloatLabel class="float-label-spacer" variant="in">
            <InputText inputId="password-input" v-model="serverInEdit.panel_password" />
            <label for="password-input">Panel Password</label>
          </FloatLabel>
        </div>
      </div>
      <Button label="Save" @click="saveNewData" />
    </Fluid>
  </Dialog>
</template>

<script setup lang="ts">
import type { Server } from '@/api/server/schema';
import { ref, watch } from 'vue';

const props = defineProps<{
  server?: Server;
}>();

const visible = defineModel<boolean>('visible', { required: true });

const emits = defineEmits<{
  saveServer: [value: Server];
}>();

const saveNewData = () => {
  emits('saveServer', serverInEdit.value);
  visible.value = false;
};

const serverInEdit = ref<Server>({
  id: '',
  ip: '',
  secured: false,
  description: '',
  country_code: '',
  display_name: '',
  starting_date: new Date(),
  closing_date: new Date(),
  panel_port: 0,
  panel_web_path: '',
  panel_login: '',
  panel_password: '',
});

watch(
  () => props.server,
  () => {
    if (!props.server) return;
    serverInEdit.value = { ...props.server };
  },
);
</script>
