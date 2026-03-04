<template>
  <div>
    <Card>
      <template #title>Users</template>
      <template #content>
        <DataTable :value="users.pages[currentPage] ?? []" dataKey="id" editMode="cell" :loading="loadingTable"
          @cell-edit-complete="updateDataTable" paginator lazy v-model:rows="rowsPerPageNumber"
          :rows-per-page-options="[5, 10, 20]" :first="firstItemOnPage" :total-records="users.count"
          paginator-position="both" @page="changePage">
          <template #loading>
            <div class="flex gap-2">
              <Icon width="2rem" icon="line-md:loading-loop"></Icon>
              <span class="text-2xl">Loading users...</span>
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
          <Column field="telegram_id" header="Telegram ID">
            <template #editor="{ data, field }">
              <InputNumber :useGrouping="false" v-model="data[field]" :min="0"></InputNumber>
            </template>
          </Column>
          <Column field="telegram_username" header="TG Username"> </Column>
          <Column field="balance" header="Balance">
            <template #body="slotProps">
              <Button severity="secondary" rounded
                @click="router.push({ name: 'balance', params: { userId: (slotProps.data as User).id } })">
                <Icon icon="line-md:clipboard-list"></Icon>
              </Button>
            </template>
          </Column>
          <Column field="tariff" header="Tariff">
            <template #body="slotProps">
              <Select :modelValue="users.tariffs[(slotProps.data as User).id]"
                @update:modelValue="updateTariff((slotProps.data as User), $event)" :options="tariffs.shortList"
                optionLabel="name" optionValue="id"></Select>
            </template>
          </Column>
          <Column field="settings" header="Settings">
            <template #body="slotProps">
              <Button severity="secondary" rounded @click="openSettingsModal(slotProps.data as User)">
                <Icon icon="line-md:cog-loop"></Icon>
              </Button>
            </template>
          </Column>
          <Column field="rights" header="Permissions">
            <template #body="slotProps">
              <Button severity="secondary" rounded @click="openRightsModal(slotProps.data as User)">
                <Icon icon="line-md:edit"></Icon>
              </Button>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
    <CheckboxDialog v-model:visible="rightsVisible" :header="'Permission settings for ' + userInEdit?.telegram_username"
      :data="userInEdit?.rights ?? {}" :locale="userPermissionsLocale" @save="saveRightsModal" />
    <CheckboxDialog v-model:visible="settingsVisible" :header="'Account settings for ' + userInEdit?.telegram_username"
      :data="userInEdit?.settings ?? {}" :locale="userSettingsLocale" @save="saveSettingsModal" />
  </div>
</template>

<script setup lang="ts">
// #region Imports

import { Icon } from '@iconify/vue';
import {
  type User,
  type UserRights,
  type UserSettings,
} from '@/api/user/schema';
import useErrorToast from '@/composables/useErrorToast';
import userPermissionsLocale from '@/utils/locale/userPermissionsLocale';
import type { DataTableCellEditCompleteEvent, DataTablePageEvent } from 'primevue/datatable';
import { computed, onMounted, ref, watch } from 'vue';
import userSettingsLocale from '@/utils/locale/userSettingsLocale';
import useCopyGuid from '@/composables/useCopyGuid';
import CheckboxDialog from '@/components/Dialogs/CheckboxDialog.vue';
import { useUsersStore } from '@/stores/users';
import { useTariffsStore } from '@/stores/tariffs';
import { useRouter } from 'vue-router';
import type { Uuid } from '@/api/base/schema';

// #endregion

const errorToast = useErrorToast();
const users = useUsersStore();
const tariffs = useTariffsStore();
const router = useRouter();

const { copyGuid } = useCopyGuid();

// Currently edited user (for modals)
const userInEdit = ref<User | null>(null);

const rightsVisible = ref(false);
const openRightsModal = (user: User) => {
  userInEdit.value = user;

  rightsVisible.value = true;
}

/**
 * Saves the changes made to the user's rights in the user rights modal.
 * Closes the user rights modal.
 */
const saveRightsModal = async (updatedUserRights: Record<string, boolean>) => {
  // Send the updated rights to the server
  await errorToast.safeExecute(async () => {
    await users.patch(currentPage.value, {
      ...userInEdit.value!,
      rights: updatedUserRights as UserRights
    });
  });

  userInEdit.value = null;
};

const settingsVisible = ref(false);
const openSettingsModal = (user: User) => {
  userInEdit.value = user;

  settingsVisible.value = true;
}

/**
 * Saves the user settings in the settings modal.
 * Patches the user settings in the API and updates the user in edit's settings.
 * Closes the settings modal after saving.
 */
const saveSettingsModal = async (updatedUserSettings: Record<string, boolean>) => {
  await errorToast.safeExecute(async () => {
    await users.patch(currentPage.value, {
      ...userInEdit.value!,
      settings: updatedUserSettings as UserSettings
    });
  });

  userInEdit.value = null;
};

const updateTariff = async (userId: User, tariffId: Uuid) => {
  await errorToast.safeExecute(async () => {
    await users.patch(currentPage.value, {
      ...userId,
      tariff: tariffs.items.find((tariff) => tariff.id === tariffId)!
    });
  })
}

const updateDataTable = async (event: DataTableCellEditCompleteEvent<User>) => {
  await errorToast.safeExecute(async () => {
    await users.patch(currentPage.value, event.newData);
  });
};

const loadingTable = ref<boolean>(false);

onMounted(async () => {
  loadingTable.value = true;

  await errorToast.safeExecute(async () => {
    await Promise.all([
      users.init(),
      tariffs.init(),
    ])
  })

  loadingTable.value = false;
});

const currentPage = ref(0);

const firstItemOnPage = computed(() => currentPage.value * users.pageSize);

const rowsPerPageNumber = ref(5);

watch(rowsPerPageNumber, async (newVal) => {
  loadingTable.value = true;

  await errorToast.safeExecute(async () => {
    await users.init(newVal);
  })
  currentPage.value = 0;

  loadingTable.value = false;
})

const changePage = async (event: DataTablePageEvent) => {
  if (event.rows !== users.pageSize) return;

  loadingTable.value = true;

  await errorToast.safeExecute(async () => {
    await users.loadPage(event.page);
    currentPage.value = event.page;
  })

  loadingTable.value = false;
}

</script>
