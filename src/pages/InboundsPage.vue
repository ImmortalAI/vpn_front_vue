<template>
  <Card>
    <template #title>Inbounds</template>
    <template #content>
      <DataTable :value="inbounds.items" dataKey="id" editMode="cell" :loading="inbounds.loading"
        @cell-edit-complete="cellEdit" paginator lazy v-model:rows="inbounds.rows" :rows-per-page-options="[5, 10, 20]"
        :first="inbounds.first" :total-records="inbounds.totalRecords" paginator-position="both">
        <template #loading>
          <div class="flex gap-2">
            <Icon width="2rem" icon="line-md:loading-loop"></Icon>
            <span class="text-2xl">Loading inbounds list...</span>
          </div>
        </template>
        <template #header>
          <div class="flex w-full justify-end">
            <Button label="Add Inbound" icon="pi pi-plus" class="mr-2" @click="onCreateInbound" />
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
        <Column field="inbound_id" header="Internal Id">
          <template #editor="{ data, field }">
            <InputNumber v-model="data[field]" :min="0" />
          </template>
        </Column>
        <Column field="name" header="Name">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" />
          </template>
        </Column>
        <Column field="protocol" header="Protocol">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" />
          </template>
        </Column>
        <Column header="Manage">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" size="small" severity="secondary"
              @click="onEditInbound(slotProps.data as Inbound)" />
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
  <InboundEditDialog v-model:visible="editDialogVisible" :inbound="inboundInEdit" @saveInbound="onInboundUpdate" />
</template>

<script setup lang="ts">
import type { Inbound } from '@/api/server/schema';
import InboundEditDialog from '@/components/Dialogs/InboundEditDialog.vue';
import useCopyGuid from '@/composables/useCopyGuid';
import { useInboundsStore } from '@/stores/inbounds';
import type { DataTableCellEditCompleteEvent } from 'primevue/datatable';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const inbounds = useInboundsStore();
const { copyGuid } = useCopyGuid();

const { serverId } = route.params;

const editDialogVisible = ref(false);
const inboundInEdit = ref<Inbound | null>(null);

const onCreateInbound = async () => {
  inboundInEdit.value = null;
  editDialogVisible.value = true;
};

const onEditInbound = async (inbound: Inbound) => {
  inboundInEdit.value = inbound;
  editDialogVisible.value = true;
};

const onInboundUpdate = async (updated: Inbound) => {
  if (updated.id !== '') {
    await inbounds.update(updated);
  } else {
    await inbounds.create(updated);
  }
};

const cellEdit = async (e: DataTableCellEditCompleteEvent<Inbound>) => {
  await inbounds.update({
    id: e.data.id,
    [e.field]: e.newValue,
  } as Inbound);
};

watch(() => inbounds.error, (err) => {
  if (err) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: err,
      life: 3000
    })

    inbounds.error = null;
  }
})

onMounted(async () => {
  if (typeof serverId !== 'string') {
    router.push({ name: 'not-found' });
    return;
  }

  inbounds.serverId = serverId as string;
})
</script>
