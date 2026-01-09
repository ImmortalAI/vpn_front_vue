<template>
  <Card>
    <template #title>Servers</template>
    <template #content>
      <DataTable v-model:expandedRows="expandedRows" v-model:editingRows="rowsInEdit" editMode="row" :value="servers"
        dataKey="id" :loading="loadingTable" @row-edit-init="editRowInit" @row-edit-save="console.log">
        <template #loading>
          <div class="flex gap-2">
            <Icon width="2rem" icon="line-md:loading-loop"></Icon>
            <span class="text-2xl">Loading server list...</span>
          </div>
        </template>
        <template #header>
          <div class="flex w-full justify-end">
            <Button label="Add Server" icon="pi pi-plus" class="mr-2" @click="createServer" />
          </div>
        </template>
        <Column expander style="width: 5rem" />
        <Column field="id" header="Id" />
        <Column field="ip" header="IP Address">
          <template #editor="{ data, field }">
            <IpInput v-model="data[field]" />
          </template>
        </Column>
        <Column field="country_code" header="Country">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" />
          </template>
        </Column>
        <Column field="display_name" header="Display Name">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" />
          </template>
        </Column>
        <Column :rowEditor="true" />
        <template #expansion="slotProps">
          <Fluid v-if="rowsInEdit.includes(slotProps.data)" class="flex flex-col gap-4">
            <div class="flex flex-col">
              <span class="text-xl p-2 border-b border-neutral-600">Main Settings</span>
              <FloatLabel class="float-label-spacer">
                <InputText :inputId="'description-input-' + slotProps.index"
                  v-model="rowsInEdit.find(row => row.id === slotProps.data.id)!.description" />
                <label :for="'description-input-' + slotProps.index">Description</label>
              </FloatLabel>
              <div class="flex gap-4">
                <FloatLabel class="float-label-spacer">
                  <DatePicker v-model="rowsInEdit.find(row => row.id === slotProps.data.id)!.starting_date"
                    :inputId="'start-date-input-' + slotProps.index" showTime hourFormat="24" dateFormat="dd.mm.yy" />
                  <label :for="'start-date-input-' + slotProps.index">Starting Date</label>
                </FloatLabel>
                <FloatLabel class="float-label-spacer">
                  <DatePicker v-model="rowsInEdit.find(row => row.id === slotProps.data.id)!.closing_date"
                    :inputId="'close-date-input-' + slotProps.index" showTime hourFormat="24" dateFormat="dd.mm.yy" />
                  <label :for="'close-date-input-' + slotProps.index">Closing Date</label>
                </FloatLabel>
              </div>
            </div>
            <div class="flex flex-col">
              <span class="text-xl p-2 border-b border-neutral-600">Panel Settings</span>
              <div class="flex gap-4">
                <FloatLabel class="float-label-spacer">
                  <InputNumber :inputId="'port-input-' + slotProps.index"
                    v-model="rowsInEdit.find(row => row.id === slotProps.data.id)!.panel_port" :useGrouping="false"
                    :min="0" :max="65535" />
                  <label :for="'port-input-' + slotProps.index">Port</label>
                </FloatLabel>
                <FloatLabel class="float-label-spacer">
                  <InputText :inputId="'web-path-input-' + slotProps.index"
                    v-model="rowsInEdit.find(row => row.id === slotProps.data.id)!.panel_web_path" />
                  <label :for="'web-path-input-' + slotProps.index">Web Path</label>
                </FloatLabel>
              </div>
              <div class="flex gap-4">
                <FloatLabel class="float-label-spacer">
                  <InputText :inputId="'login-input-' + slotProps.index"
                    v-model="rowsInEdit.find(row => row.id === slotProps.data.id)!.panel_login" />
                  <label :for="'login-input-' + slotProps.index">Panel Login</label>
                </FloatLabel>
                <FloatLabel class="float-label-spacer">
                  <InputText :inputId="'password-input-' + slotProps.index"
                    v-model="rowsInEdit.find(row => row.id === slotProps.data.id)!.panel_password" />
                  <label :for="'password-input-' + slotProps.index">Panel Password</label>
                </FloatLabel>
              </div>
            </div>
          </Fluid>
          <div v-else class="flex flex-col gap-4">
            <div class="flex flex-col">
              <span class="text-xl p-2 border-b border-neutral-600">Main Settings</span>
              <div class="static-data-container">
                <p class="underline">Description</p>
                <p>{{ (slotProps.data as Server).description }}</p>
              </div>
              <div class="flex gap-8">
                <div class="static-data-container">
                  <p class="underline">Starting Date</p>
                  <p>{{ formatRuDateTime((slotProps.data as Server).starting_date) }}</p>
                </div>
                <div class="static-data-container">
                  <p class="underline">Closing Date</p>
                  <p>{{ formatRuDateTime((slotProps.data as Server).closing_date) }}</p>
                </div>
              </div>
            </div>
            <div class="flex flex-col">
              <span class="text-xl p-2 border-b border-neutral-600">Panel Settings</span>
              <div class="flex gap-8">
                <div class="static-data-container">
                  <p class="underline">Port</p>
                  <p>{{ (slotProps.data as Server).panel_port }}</p>
                </div>
                <div class="static-data-container">
                  <p class="underline">Web Path</p>
                  <p>{{ (slotProps.data as Server).panel_web_path }}</p>
                </div>
              </div>
              <div class="flex gap-8">
                <div class="static-data-container">
                  <p class="underline">Panel Login</p>
                  <p>{{ (slotProps.data as Server).panel_login }}</p>
                </div>
                <div class="static-data-container">
                  <p class="underline">Panel Password</p>
                  <p>{{ (slotProps.data as Server).panel_password }}</p>
                </div>
              </div>
            </div>
          </div>
        </template>
      </DataTable>
    </template>
  </Card>
</template>

<script setup lang="ts">
// #region Imports

import type { Server, ServerPatchRq } from '@/api/server/schema';
import { serverGet, serverIdPatch, serverPost } from '@/api/server/service';
import useErrorToast from '@/composables/useErrorToast';
import {
  type DataTableCellEditCompleteEvent,
  type DataTableEditingRows,
  type DataTableExpandedRows,
  type DataTableRowEditInitEvent,
} from 'primevue/datatable';
import { onMounted, ref } from 'vue';
import { Icon } from '@iconify/vue';
import formatRuDateTime from '@/utils/formatRuDateTime';
import IpInput from '@/components/IpInput.vue';

// #endregion

// #region Composables

const errorToast = useErrorToast();

// #endregion

// FUN FACT:
// Docs says that editingRows prop uses DataTableEditingRows type
// Typescript says same thing
// BUT in reality it doesn't, it just contains an array of objects from value prop
// So if you read this, please NEVER use a PrimeVue as your component library
// It's a piece of garbage made by fools for other fools (imho, don't judge me)
const rowsInEdit = ref<Server[]>([]);

const editRowInit = (event: DataTableRowEditInitEvent<Server>) => {
  console.log(event);
}

const updateDataTable = async (event: DataTableCellEditCompleteEvent<Server>) => {
  //const result = await errorToast.safeExecute(async () => {
  //   return await serverIdPatch(event.data.id, {
  //     [event.field as keyof ServerPatchRq]: event.newValue,
  //   });
  // });

  console.log(event);
};

const createServer = async () => {
  const result = await errorToast.safeExecute(async () => {
    return 1;
  });

  if (result) {
    servers.value.push({
      id: `aboba${Math.round(Math.random() * 1000)}`,
      ip: '127.0.0.1',
      country_code: 'RU',
      starting_date: new Date(),
      closing_date: new Date(),
      secured: true,
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla eget ipsum consequat fringilla. Donec id elit non mi porta gravida at eget metus. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.',
      panel_login: 'ABOBA',
      panel_password: 'aboba',
      panel_port: 25565,
      panel_web_path: '/aboba',
      display_name: `TEST SERVER ${Math.round(Math.random() * 1000)}`,
    });
  }
};

const expandedRows = ref<DataTableExpandedRows>({});

const servers = ref<Server[]>([]);
const loadingTable = ref<boolean>(true);
onMounted(async () => {
  // await errorToast.safeExecute(async () => {
  //   await serverGet().then((response) => {
  //     servers.value = response;
  //   });
  // });

  servers.value = [
    {
      id: 'aaa',
      ip: '127.0.0.1',
      country_code: 'RU',
      starting_date: new Date(),
      closing_date: new Date(),
      secured: true,
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla eget ipsum consequat fringilla. Donec id elit non mi porta gravida at eget metus. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.',
      panel_login: 'ABOBA',
      panel_password: 'aboba',
      panel_port: 25565,
      panel_web_path: '/aboba',
      display_name: 'TEST SERVER',
    },
  ];

  await new Promise((resolve) => setTimeout(resolve, 500)); // Artificial delay for better UX

  loadingTable.value = false;
});
</script>

<style lang="css" scoped>
@reference '@/assets/styles.css';

.float-label-spacer {
  @apply mt-8 w-64;
}

.static-data-container {
  @apply flex flex-col gap-2
}
</style>
