<template>
  <Card>
    <template #title>Servers</template>
    <template #content>
      <DataTable :value="servers" dataKey="id" editMode="cell" :loading="loadingTable"
        @cell-edit-complete="console.log">
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
        <Column field="id" header="Id" />
        <Column field="ip" header="IP Address">
          <template #editor="{ data, field }">
            <IpInput v-model="data[field]" />
          </template>
        </Column>
        <Column field="country_code" header="Country">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" minlength="2" maxlength="2" />
          </template>
        </Column>
        <Column field="display_name" header="Display Name">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" />
          </template>
        </Column>
        <Column>
          <template #body="slotProps">
            <Button icon="pi pi-pencil" size="small" severity="secondary"
              @click="editServer(slotProps.data as Server)" />
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
  <ServerEditDialog v-model:visible="dialogEditVisible" :server="serverInEdit" @save-server="updateServer" />
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
import ServerEditDialog from '@/components/Dialogs/ServerEditDialog.vue';

// #endregion

// #region Composables

const errorToast = useErrorToast();

// #endregion

// #region Edit Server Data

const dialogEditVisible = ref(false);
const serverInEdit = ref<Server>({
  id: '',
  ip: '',
  country_code: '',
  starting_date: new Date(),
  closing_date: new Date(),
  secured: false,
  description: '',
  display_name: '',
  panel_port: 0,
  panel_login: '',
  panel_password: '',
  panel_web_path: '',
});

const editServer = (server: Server) => {
  serverInEdit.value = server;
  dialogEditVisible.value = true;
};

// #endregion

const updateServer = async (newData: Server) => {
  //const result = await errorToast.safeExecute(async () => {
  //   return await serverIdPatch(event.data.id, {
  //     [event.field as keyof ServerPatchRq]: event.newValue,
  //   });
  // });

  if (true) {
    const index = servers.value.findIndex((server) => server.id === newData.id);
    servers.value[index] = newData;
  }
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
