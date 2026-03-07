<template>
  <div>
    <Card>
      <template #title>Users</template>
      <template #content>
        <DataTable
          :value="users.items"
          dataKey="id"
          editMode="cell"
          :loading="loadingTable"
          @cell-edit-complete="cellEdit"
          paginator
          lazy
          v-model:rows="users.rows"
          :rows-per-page-options="[5, 10, 20]"
          :first="users.first"
          :total-records="users.totalRecords"
          paginator-position="both"
        >
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
              <Button
                severity="secondary"
                rounded
                @click="
                  router.push({ name: 'balance', params: { userId: (slotProps.data as User).id } })
                "
              >
                <Icon icon="line-md:clipboard-list"></Icon>
              </Button>
            </template>
          </Column>
          <Column field="tariff" header="Tariff">
            <template #body="slotProps">
              <Select
                :modelValue="(slotProps.data as User).tariff.id"
                @update:modelValue="updateTariff((slotProps.data as User).id, $event)"
                :options="tariffs.shortList"
                optionLabel="name"
                optionValue="id"
              ></Select>
            </template>
          </Column>
          <Column field="settings" header="Settings">
            <template #body="slotProps">
              <Button
                severity="secondary"
                rounded
                @click="openSettingsModal(slotProps.data as User)"
              >
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
    <CheckboxDialog
      v-model:visible="rightsVisible"
      :header="'Permission settings for ' + userInEdit?.telegram_username"
      :data="userInEdit?.rights ?? {}"
      :locale="userPermissionsLocale"
      @save="saveRightsModal"
    />
    <CheckboxDialog
      v-model:visible="settingsVisible"
      :header="'Account settings for ' + userInEdit?.telegram_username"
      :data="userInEdit?.settings ?? {}"
      :locale="userSettingsLocale"
      @save="saveSettingsModal"
    />
  </div>
</template>

<script setup lang="ts">
// #region Imports

import { Icon } from '@iconify/vue';
import { type User, type UserPatch, type UserRights, type UserSettings } from '@/api/user/schema';
import userPermissionsLocale from '@/utils/locale/userPermissionsLocale';
import type { DataTableCellEditCompleteEvent } from 'primevue/datatable';
import { onMounted, ref, watch } from 'vue';
import userSettingsLocale from '@/utils/locale/userSettingsLocale';
import useCopyGuid from '@/composables/useCopyGuid';
import CheckboxDialog from '@/components/Dialogs/CheckboxDialog.vue';
import { useUsersStore } from '@/stores/users';
import { useTariffsStore } from '@/stores/tariffs';
import { useRouter } from 'vue-router';
import type { Uuid } from '@/api/base/schema';
import { useToast } from 'primevue/usetoast';

// #endregion

const users = useUsersStore();
const tariffs = useTariffsStore();
const router = useRouter();
const toast = useToast();

const { copyGuid } = useCopyGuid();

// Currently edited user (for modals)
const userInEdit = ref<User | null>(null);

const rightsVisible = ref(false);
const openRightsModal = (user: User) => {
  userInEdit.value = user;

  rightsVisible.value = true;
};

/**
 * Saves the changes made to the user's rights in the user rights modal.
 * Closes the user rights modal.
 */
const saveRightsModal = async (updatedUserRights: Record<string, boolean>) => {
  // Send the updated rights to the server
  await users.update(userInEdit.value!.id, {
    rights: updatedUserRights as UserRights,
  });

  userInEdit.value = null;
};

const settingsVisible = ref(false);
const openSettingsModal = (user: User) => {
  userInEdit.value = user;

  settingsVisible.value = true;
};

/**
 * Saves the user settings in the settings modal.
 * Patches the user settings in the API and updates the user in edit's settings.
 * Closes the settings modal after saving.
 */
const saveSettingsModal = async (updatedUserSettings: Record<string, boolean>) => {
  await users.update(userInEdit.value!.id, {
    settings: updatedUserSettings as UserSettings,
  });

  userInEdit.value = null;
};

const updateTariff = async (userId: Uuid, tariffId: Uuid) => {
  await users.update(userId, {
    tariff_id: tariffs.items.find((tariff) => tariff.id === tariffId)!.id,
  });
};

const cellEdit = async (event: DataTableCellEditCompleteEvent<User>) => {
  const patchObj = {} as UserPatch;

  switch (event.field) {
    case 'telegram_id':
      patchObj.telegram_id = event.newValue;
      break;

    default:
      return;
  }

  await users.update(event.data.id, patchObj);
};

const loadingTable = ref<boolean>(false);

onMounted(async () => {
  await users.initialize();
});

watch(
  () => users.error,
  (err) => {
    if (err) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: err,
        life: 3000,
      });

      users.error = null;
    }
  },
);
</script>
