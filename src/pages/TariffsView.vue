<template>
  <div>
    <Card>
      <template #header>
        <h2>Tariffs</h2>
      </template>
      <template #content>
        <DataTable
          editMode="cell"
          :value="tariffs"
          dataKey="id"
          @cellEditComplete="onUpdateTariff"
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
              <InputText placeholder="New tariff name" class="mr-2" v-model="newTariffName" />
              <Button label="Add Tariff" icon="pi pi-plus" class="mr-2" @click="apiCreateTariff" />
            </div>
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
          <Column field="is_special" header="Is Special">
            <template #body="slotProps">
              <Checkbox
                v-model="(slotProps.data as Tariff).is_special"
                @change="
                  onUpdateTariff({
                    data: slotProps.data as Tariff,
                    field: 'is_special',
                    index: slotProps.index,
                    newValue: (slotProps.data as Tariff).is_special,
                  } as DataTableCellEditCompleteEvent<Tariff>)
                "
                binary
              />
            </template>
          </Column>
          <Column header="Manage">
            <template #body="slotProps">
              <Button
                icon="pi pi-trash"
                class="p-button-danger"
                size="small"
                @click="apiDeleteTariff((slotProps.data as Tariff).id)"
              />
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
import { Icon } from '@iconify/vue';
// #endregion

const errorToast = useErrorToast();

const onUpdateTariff = async (event: DataTableCellEditCompleteEvent<Tariff>) => {
  const result = await errorToast.safeExecute(async () => {
    return await tariffPatch(event.data.id, {
      [event.field as keyof TariffPatchRq]: event.newValue,
    });
  });

  if (result) await refreshTariff(event.data.id, event.index);
};

const newTariffName = ref('');
const apiCreateTariff = async () => {
  const result = await errorToast.safeExecute(async () => {
    return await tariffPost({
      name: newTariffName.value || 'New Tariff',
      description: '',
      duration: 1,
      price: 0,
      traffic: 1,
      price_of_traffic_reset: 0,
      is_special: false,
    });
  });

  if (result) {
    tariffs.value.push(result);
  }
};

const apiDeleteTariff = async (tariffId: string) => {
  const result = await errorToast.safeExecute(async () => {
    return await tariffDelete(tariffId);
  });

  if (result) await refreshAllTariffs();
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
</script>
