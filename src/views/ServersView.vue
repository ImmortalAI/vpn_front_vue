<template>
  <Card>
    <template #title>Servers</template>
    <template #content>
      <DataTable v-model:expandedRows="expandedRows" editMode="cell" :value="servers" dataKey="id"
        @cellEditComplete="updateDataTable" :loading="loadingTable">
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
            <InputText v-model="data[field]" />
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
        <Column field="starting_date" header="Starting Date">
          <template #body="slotProps">
            {{ formatRuDateTime((slotProps.data as Server).starting_date) }}
          </template>
          <template #editor="{ data, field }">
            <DatePicker v-model="data[field]" showTime hourFormat="24" dateFormat="dd.mm.yy" />
          </template>
        </Column>
        <Column field="closing_date" header="Closing Date">
          <template #body="slotProps">
            {{ formatRuDateTime((slotProps.data as Server).closing_date) }}
          </template>
          <template #editor="{ data, field }">
            <DatePicker v-model="data[field]" showTime hourFormat="24" dateFormat="dd.mm.yy" />
          </template>
        </Column>
        <Column field="panel_port" header="Panel Port">
          <template #editor="{ data, field }">
            <InputNumber v-model="data[field]" :useGrouping="false" :min="0" :max="65535" />
          </template>
        </Column>
        <template #expansion="slotProps">
          <div class="flex">
            <div class="flex flex-col">
              <FloatLabel class="float-label-spacer">
                <InputNumber :inputId="'port-gen-input-' + slotProps.index"
                  v-model="(slotProps.data as Server).port_generator_port" :useGrouping="false" :min="0" :max="65535" />
                <label :for="'port-gen-input-' + slotProps.index">Port generator</label>
              </FloatLabel>
              <FloatLabel class="float-label-spacer">
                <InputText :inputId="'web-path-input-' + slotProps.index"
                  v-model="(slotProps.data as Server).web_path" />
                <label :for="'web-path-input-' + slotProps.index">Web path</label>
              </FloatLabel>

            </div>
            <div class="flex flex-col">
              <FloatLabel class="float-label-spacer">
                <InputText :inputId="'panel-login-input-' + slotProps.index"
                  v-model="(slotProps.data as Server).login" />
                <label :for="'panel-login-input-' + slotProps.index">Panel login</label>
              </FloatLabel>
              <FloatLabel class="float-label-spacer">
                <InputText :inputId="'panel-password-input-' + slotProps.index"
                  v-model="(slotProps.data as Server).password" />
                <label :for="'panel-password-input-' + slotProps.index">Panel password</label>
              </FloatLabel>
            </div>
            <div class="flex flex-col">
              <FloatLabel class="float-label-spacer">
                <InputNumber :inputId="'vless-id-input-' + slotProps.index" :useGrouping="false"
                  v-model="(slotProps.data as Server).vless_reality_id" />
                <label :for="'vless-id-input-' + slotProps.index">Vless ID</label>
              </FloatLabel>
              <FloatLabel class="float-label-spacer">
                <InputNumber :inputId="'vless-port-input-' + slotProps.index" :useGrouping="false"
                  v-model="(slotProps.data as Server).vless_reality_id" :min="0" :max="65535" />
                <label :for="'vless-port-input-' + slotProps.index">Vless port</label>
              </FloatLabel>


            </div>
            <div class="flex flex-col">
              <FloatLabel class="float-label-spacer">
                <InputText :inputId="'vless-domain-input-' + slotProps.index"
                  v-model="(slotProps.data as Server).vless_reality_domain_short_id" />
                <label :for="'vless-domain-input-' + slotProps.index">Vless domain ID</label>
              </FloatLabel>
              <FloatLabel class="float-label-spacer">
                <InputText :inputId="'vless-pubkey-input-' + slotProps.index"
                  v-model="(slotProps.data as Server).vless_reality_public_key" />
                <label :for="'vless-pubkey-input-' + slotProps.index">Vless reality public key</label>
              </FloatLabel>
            </div>
            <div class="flex flex-col">
              <FloatLabel class="float-label-spacer">
                <InputText :inputId="'vless-key-input-' + slotProps.index"
                  v-model="(slotProps.data as Server).vless_reality_private_key" />
                <label :for="'vless-key-input-' + slotProps.index">Vless reality private key</label>
              </FloatLabel>
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
import { type DataTableCellEditCompleteEvent, type DataTableExpandedRows } from 'primevue/datatable';
import { onMounted, ref } from 'vue';
import { Icon } from '@iconify/vue';
import formatRuDateTime from '@/utils/formatRuDateTime';

// #endregion

// #region Composables

const errorToast = useErrorToast();

// #endregion

const updateDataTable = async (event: DataTableCellEditCompleteEvent<Server>) => {
  const result = await errorToast.safeExecute(async () => {
    return await serverIdPatch(event.data.id, {
      [event.field as keyof ServerPatchRq]: event.newValue,
    });
  });

  if (!result) event.originalEvent.preventDefault();
};

const createServer = async () => {
  const result = await errorToast.safeExecute(async () => {
    return await serverPost({
      ip: '1.1.1.1',
      description: '',
      country_code: 'AA',
      is_available: true,
      display_name: '',
      starting_date: new Date(),
      closing_date: new Date(),
      panel_port: 0,
      port_generator_port: 0,
      web_path: '',
      login: '',
      password: '',
      vless_reality_id: 0,
      vless_reality_port: 0,
      vless_reality_domain_short_id: '',
      vless_reality_public_key: '',
      vless_reality_private_key: '',
    });
  });

  if (result) {
    servers.value.push(result);
  }
};

const expandedRows = ref<DataTableExpandedRows>({});

const servers = ref<Server[]>([]);
const loadingTable = ref<boolean>(true);
onMounted(async () => {
  await errorToast
    .safeExecute(async () => {
      await serverGet()
        .then((response) => {
          servers.value = response;
        });
    });

  await new Promise((resolve) => setTimeout(resolve, 500)); // Artificial delay for better UX

  loadingTable.value = false;
});
</script>

<style lang="css" scoped>
@reference '@/assets/styles.css';

.float-label-spacer {
  @apply mt-8 w-64;
}
</style>
