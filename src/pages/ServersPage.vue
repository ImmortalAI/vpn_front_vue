<template>
  <Card>
    <template #title>Servers</template>
    <template #content>
      <DataTable :value="servers.items" dataKey="id" editMode="cell" :loading="servers.loading"
        @cell-edit-complete="cellEdit" paginator lazy v-model:rows="servers.rows" :rows-per-page-options="[5, 10, 20]"
        :first="servers.first" :total-records="servers.totalRecords" paginator-position="both">
        <template #loading>
          <div class="flex gap-2">
            <Icon width="2rem" icon="line-md:loading-loop"></Icon>
            <span class="text-2xl">Loading server list...</span>
          </div>
        </template>
        <template #header>
          <div class="flex w-full justify-end">
            <Button label="Add Server" icon="pi pi-plus" class="mr-2" @click="onCreateServer" />
          </div>
        </template>
        <Column field="id" header="Id">
          <template #body="slotProps">
            <span class="cursor-pointer" @click="copyGuid(slotProps.data.id as string)">{{
              (slotProps.data.id as string).slice(0, 8) +
              ' *** ' +
              (slotProps.data.id as string).slice(-4)
            }}</span>
          </template>
        </Column>
        <Column field="ip" header="IP Address">
          <template #editor="{ data, field }">
            <IpInput v-model:ip="data[field]" />
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
        <Column header="Manage">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" size="small" severity="secondary"
              @click="onEditServer(slotProps.data as Server)" />
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
  <ServerEditDialog v-model:visible="editDialogVisible" :server="serverInEdit" @save-server="onServerUpdate" />
</template>

<script setup lang="ts">
// #region Imports

import type { Server } from '@/api/server/schema';
import { onMounted, ref, watch } from 'vue';
import { Icon } from '@iconify/vue';
import IpInput from '@/components/IpInput.vue';
import ServerEditDialog from '@/components/Dialogs/ServerEditDialog.vue';
import useCopyGuid from '@/composables/useCopyGuid';
import { useServersStore } from '@/stores/servers';
import { useToast } from 'primevue/usetoast';
import type { DataTableCellEditCompleteEvent } from 'primevue/datatable';

// #endregion

// #region Composables

const { copyGuid } = useCopyGuid();
const servers = useServersStore();
const toast = useToast();

// #endregion

const editDialogVisible = ref(false);
const serverInEdit = ref<Server | null>(null);

const onCreateServer = async () => {
  serverInEdit.value = null;
  editDialogVisible.value = true;
};

const onEditServer = async (server: Server) => {
  serverInEdit.value = server;
  editDialogVisible.value = true;
};

const onServerUpdate = async (updated: Server) => {
  if (updated.id !== '') {
    await servers.update(updated)
  } else {
    await servers.create(updated)
  }
};

const cellEdit = async (e: DataTableCellEditCompleteEvent<Server>) => {
  await servers.update({
    id: e.data.id,
    [e.field]: e.newValue
  } as Server);
}

onMounted(async () => {
  await servers.initialize();
});

watch(() => servers.error, (error) => {
  if (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error,
      life: 3000,
    })

    servers.error = null;
  }
});
</script>
