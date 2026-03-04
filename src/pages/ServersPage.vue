<template>
  <Card>
    <template #title>Servers</template>
    <template #content>
      <DataTable :value="servers.pages[currentPage] ?? []" dataKey="id" editMode="cell" :loading="loadingTable"
        @cell-edit-complete="(e) => console.log(e)" paginator lazy v-model:rows="rowsPerPageNumber"
        :rows-per-page-options="[5, 10, 20]" :first="firstItemOnPage" :total-records="servers.count"
        paginator-position="both" @page="changePage">
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
import useErrorToast from '@/composables/useErrorToast';
import {
  type DataTablePageEvent,
} from 'primevue/datatable';
import { computed, onMounted, ref, watch } from 'vue';
import { Icon } from '@iconify/vue';
import IpInput from '@/components/IpInput.vue';
import ServerEditDialog from '@/components/Dialogs/ServerEditDialog.vue';
import useCopyGuid from '@/composables/useCopyGuid';
import { useServersStore } from '@/stores/servers';

// #endregion

// #region Composables

const errorToast = useErrorToast();
const { copyGuid } = useCopyGuid();
const servers = useServersStore();

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
    await errorToast.safeExecute(async () => {
      await servers.update(currentPage.value, updated)
    });
  } else {
    await errorToast.safeExecute(async () => {
      await servers.create(updated)
    });
  }
};

/* const refreshServer = (updatedServer: Server) => {
  const replaceTariffIdx = servers.value.findIndex((srv) => srv.id === updatedServer.id);
  if (replaceTariffIdx === -1) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Updated server was not found in the data table',
    });
    return;
  }
  servers.value.splice(replaceTariffIdx, 1, updatedServer);
}; */

const loadingTable = ref<boolean>(true);

onMounted(async () => {
  await errorToast.safeExecute(async () => {
    await servers.init();
  })

  loadingTable.value = false;
});

const currentPage = ref(0);

const firstItemOnPage = computed(() => currentPage.value * servers.pageSize);

const rowsPerPageNumber = ref(5);

watch(rowsPerPageNumber, async (newVal) => {
  loadingTable.value = true;

  await errorToast.safeExecute(async () => {
    await servers.init(newVal);
  })
  currentPage.value = 0;

  loadingTable.value = false;
})

const changePage = async (event: DataTablePageEvent) => {
  if (event.rows !== servers.pageSize) return;

  loadingTable.value = true;

  await errorToast.safeExecute(async () => {
    await servers.loadPage(event.page);
    currentPage.value = event.page;
  })

  loadingTable.value = false;
}
</script>
