<template>
  <div>
    <Card>
      <template #title>Tariffs </template>
      <template #content>
        <DataTable
          editMode="cell"
          :value="tariffs"
          dataKey="id"
          @cellEditComplete="onUpdateFieldTariff"
          :loading="dataTableLoading"
        >
          <template #loading>
            <div class="flex gap-2">
              <Icon width="2rem" icon="line-md:loading-loop"></Icon>
              <span class="text-2xl">Loading tariff list...</span>
            </div>
          </template>
          <template #header>
            <div class="flex w-full justify-end">
              <Button label="Add Tariff" icon="pi pi-plus" class="mr-2" @click="onCreateTariff" />
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
          <Column field="name" header="Name">
            <template #editor="{ data }">
              <InputText v-model="(data as Tariff).name" />
            </template>
          </Column>
          <Column field="duration" header="Duration (days)">
            <template #editor="{ data }">
              <InputNumber v-model="(data as Tariff).duration" :useGrouping="false" :min="0" />
            </template>
          </Column>
          <Column field="price" header="Price">
            <template #editor="{ data }">
              <InputNumber v-model="(data as Tariff).price" mode="currency" currency="RUB" />
            </template>
          </Column>
          <Column field="traffic" header="Traffic (GiB)">
            <template #editor="{ data }">
              <InputNumber
                v-model="(data as Tariff).traffic"
                :useGrouping="false"
                :min="0"
                suffix=" GiB"
              />
            </template>
          </Column>
          <Column field="price_of_traffic_reset" header="Price (Reset)">
            <template #editor="{ data }">
              <InputNumber
                v-model="(data as Tariff).price_of_traffic_reset"
                mode="currency"
                currency="RUB"
              />
            </template>
          </Column>
          <Column header="Manage">
            <template #body="slotProps">
              <div class="flex gap-4">
                <Button
                  icon="pi pi-pencil"
                  class="p-button-success"
                  size="small"
                  @click="onEditTariff(slotProps.data as Tariff)"
                />
                <Button
                  icon="pi pi-trash"
                  class="p-button-danger"
                  size="small"
                  @click="apiDeleteTariff((slotProps.data as Tariff).id)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
    <TariffEditDialog
      v-model:visible="editDialogVisible"
      :tariff="tariffInEdit"
      @saveTariff="onTariffUpdate"
    />
  </div>
</template>

<script setup lang="ts">
// #region Imports
import type { Tariff, TariffPatchRq } from '@/api/tariff/schema';
import { tariffAll, tariffDelete, tariffPatch, tariffPost } from '@/api/tariff/service';
import useErrorToast from '@/composables/useErrorToast';
import type { DataTableCellEditCompleteEvent } from 'primevue/datatable';
import { onMounted, ref } from 'vue';
import { Icon } from '@iconify/vue';
import useCopyGuid from '@/composables/useCopyGuid';
import TariffEditDialog from '@/components/Dialogs/TariffEditDialog.vue';
import { useToast } from 'primevue/usetoast';
// #endregion

const errorToast = useErrorToast();
const toast = useToast();

const editDialogVisible = ref(false);
const tariffInEdit = ref<Tariff | null>(null);

const onUpdateFieldTariff = async (event: DataTableCellEditCompleteEvent<Tariff>) => {
  const result = await errorToast.safeExecute(async () => {
    return await tariffPatch(event.data.id, {
      [event.field as keyof TariffPatchRq]: event.newValue,
    });
  });

  if (result) refreshTariff(result);
};

const onCreateTariff = async () => {
  editDialogVisible.value = true;
  tariffInEdit.value = null;
};

const onEditTariff = async (tariff: Tariff) => {
  editDialogVisible.value = true;
  tariffInEdit.value = tariff;
};

const onTariffUpdate = async (updated: Tariff) => {
  if (updated.id !== '') {
    const result = await errorToast.safeExecute(async () => {
      return await tariffPatch(updated.id, updated);
    });

    if (result) refreshTariff(result);
  } else {
    const result = await errorToast.safeExecute(async () => {
      return await tariffPost(updated);
    });

    if (result) tariffs.value.push(result);
  }
};

const apiDeleteTariff = async (tariffId: string) => {
  const result = await errorToast.safeExecute(async () => {
    return await tariffDelete(tariffId);
  });

  if (result) await refreshAllTariffs();
};

/* const refreshTariff = async (tariffId: string, replaceTariffIdx: number) => {
  const newTariff = await errorToast.safeExecute(async () => {
    return await tariffGet(tariffId);
  });
  if (newTariff) {
    tariffs.value.splice(replaceTariffIdx, 1, newTariff);
  }
}; */

const refreshTariff = (updatedTariff: Tariff) => {
  const replaceTariffIdx = tariffs.value.findIndex((tariff) => tariff.id === updatedTariff.id);
  if (replaceTariffIdx === -1) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Updated tariff was not found in the data table',
    });
    return;
  }
  tariffs.value.splice(replaceTariffIdx, 1, updatedTariff);
};

const refreshAllTariffs = async () => {
  const newTariffs = await errorToast.safeExecute(async () => {
    return await tariffAll();
  });
  if (newTariffs) {
    tariffs.value = newTariffs;
  }
};

const tariffs = ref<Tariff[]>([]);
const dataTableLoading = ref(true);

onMounted(async () => {
  await errorToast.safeExecute(async () => {
    await tariffAll().then((response) => {
      tariffs.value = response;
    });
  });

  await new Promise((resolve) => setTimeout(resolve, 500)); // Artificial delay for better UX

  dataTableLoading.value = false;
});

const { copyGuid } = useCopyGuid();
</script>
