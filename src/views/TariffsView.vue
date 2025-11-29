<template>
  <div>
    <Card>
      <template #header>
        <h2>Tariffs</h2>
      </template>
      <template #content>
        <DataTable editMode="cell" :value="tariffs" dataKey="id" @cellEditComplete="onUpdateTariff"
          :loading="dataTableLoading">
          <template #header>
            <div class="flex w-full justify-end">
              <Button label="Add Tariff" icon="pi pi-plus" class="mr-2" @click="apiCreateTariff" />
            </div>
          </template>
          <template #loading>
            <Skeleton width="100%" height="400px" />
          </template>
          <Column field="id" header="Id" />
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
              <InputNumber v-model="(data as Tariff).traffic" :useGrouping="false" :min="0" suffix=" GiB" />
            </template>
          </Column>
          <Column field="price_of_traffic_reset" header="Price (Reset)">
            <template #editor="{ data }">
              <InputNumber v-model="(data as Tariff).price_of_traffic_reset" mode="currency" currency="RUB" />
            </template>
          </Column>
          <Column field="is_special" header="Is Special">
            <template #body="slotProps">
              <Checkbox v-model="(slotProps.data as Tariff).is_special" @change="onUpdateTariff({
                data: slotProps.data as Tariff,
                field: 'is_special',
                index: slotProps.index,
                newValue: (slotProps.data as Tariff).is_special,
              } as DataTableCellEditCompleteEvent<Tariff>)" binary />
            </template>
          </Column>
          <Column header="Manage">
            <template #body="slotProps">
              <Button icon="pi pi-trash" class="p-button-danger" size="small"
                @click="apiDeleteTariff((slotProps.data as Tariff).id)" />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
// #region Imports
import type { Tariff, TariffPatchRq } from '@/api/tariff/schema';
import { tariffAll, tariffDelete, tariffGet, tariffPatch, tariffPost } from '@/api/tariff/service';
import useErrorToast from '@/composables/useErrorToast';
import type { DataTableCellEditCompleteEvent } from 'primevue/datatable';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
// #endregion

const errorToast = useErrorToast();
const router = useRouter();

const tariffs = ref<Tariff[]>([]);
const dataTableLoading = ref(true);

onMounted(async () => {
  await errorToast.safeExecute(async () => await tariffAll()).then((response) => {
    if (response) tariffs.value = response;
    else router.push({ name: 'dashboard' });
  });

  dataTableLoading.value = false;
});

const onUpdateTariff = async (event: DataTableCellEditCompleteEvent<Tariff>) => {
  dataTableLoading.value = true;
  await errorToast.safeExecute(async () => {
    await tariffPatch(event.data.id, {
      [event.field as keyof TariffPatchRq]: event.newValue,
    });
  });

  await refreshTariff(event.data.id, event.index);
  dataTableLoading.value = false;
};

const apiCreateTariff = async () => {
  dataTableLoading.value = true;

  await errorToast.safeExecute(async () => {
    await tariffPost({
      name: 'New Tariff',
      description: '',
      duration: 1,
      price: 0,
      traffic: 1,
      price_of_traffic_reset: 0,
      is_special: false,
    });
  });

  await refreshAllTariffs();
  dataTableLoading.value = false;
};

const apiDeleteTariff = async (tariffId: string) => {
  dataTableLoading.value = true;

  await errorToast.safeExecute(async () => {
    await tariffDelete(tariffId);
  });

  await refreshAllTariffs();
  dataTableLoading.value = false;
};

const refreshTariff = async (tariffId: string, replaceTariffIdx: number) => {
  const newTariff = await errorToast.safeExecute(async () => {
    return await tariffGet(tariffId);
  });
  if (newTariff) {
    tariffs.value.splice(replaceTariffIdx, 1, newTariff);
  }
};

const refreshAllTariffs = async () => {
  const newTariffs = await errorToast.safeExecute(async () => {
    return await tariffAll();
  });
  if (newTariffs) {
    tariffs.value = newTariffs;
  }
};

</script>
