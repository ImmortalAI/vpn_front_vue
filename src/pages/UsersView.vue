<template>
  <div>
    <Card>
      <template #title>Users</template>
      <template #content>
        <DataTable editMode="cell" :value="users" dataKey="id" @cellEditComplete="updateDataTable"
          :loading="loadingTable">
          <template #loading>
            <div class="flex gap-2">
              <Icon width="2rem" icon="line-md:loading-loop"></Icon>
              <span class="text-2xl">Loading users...</span>
            </div>
          </template>
          <Column field="id" header="Id">
            <template #body="slotProps">
              <span class="cursor-pointer" @click="copyGuid(slotProps.data.id as string)">{{ (slotProps.data.id as
                string).slice(0, 8) +
                ' *** ' + (slotProps.data.id as string).slice(-4) }}</span>
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
              <Button severity="secondary" rounded @click="openBalanceModal(slotProps.data as User)">
                <Icon icon="line-md:clipboard-list"></Icon>
              </Button>
            </template>
          </Column>
          <Column field="tariff" header="Tariff">
            <template #body="slotProps">
              <Select v-model="chosenTariff[(slotProps.data as User).id]" :options="tariffs"
                optionLabel="name"></Select>
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
    <Dialog v-model:visible="rightsModalVisible" modal
      :header="`Permission settings for ${userInEdit?.telegram_username || 'Unknown'}`">
      <div v-for="userRight in Object.keys(userInEdit?.rights || {})" :key="userRight" class="flex items-center gap-2">
        <Checkbox v-model="checkedRights" :inputId="userRight" :value="userRight" />
        <label :for="userRight">{{ userPermissionsLocale[userRight] || 'Unknown' }}</label>
      </div>
      <div class="flex justify-end">
        <Button @click="saveRightsModal">Сохранить</Button>
      </div>
    </Dialog>
    <Dialog v-model:visible="settingsModalVisible" modal
      :header="`Account settings for ${userInEdit?.telegram_username || 'Unknown'}`">
      <div v-for="userSetting in Object.keys(userInEdit?.settings || {})" :key="userSetting"
        class="flex items-center gap-2">
        <Checkbox v-model="checkedSettings" :inputId="userSetting" :value="userSetting" />
        <label :for="userSetting">{{ userSettingsLocale[userSetting] || 'Unknown' }}</label>
      </div>
      <div class="flex justify-end">
        <Button @click="saveSettingsModal">Сохранить</Button>
      </div>
    </Dialog>
    <Dialog v-model:visible="balanceModalVisible" modal class="big-dialog"
      :header="`Transactions for ${userInEdit?.telegram_username || 'Unknown'}`">
      <div class="flex">
        <div class="flex flex-col min-w-48 min-h-72">
          <span>Баланс: {{ userInEdit?.balance }}</span>
          <Divider />
          <div class="flex flex-col gap-2">
            <span>Create new transaction</span>
            <IftaLabel>
              <Select v-model="chosenTransactionType" :options="allTransactionTypes" optionLabel="label"
                labelId="transaction-type-select" class="w-full"></Select>
              <label for="transaction-type-select">Type</label>
            </IftaLabel>
            <IftaLabel>
              <InputNumber v-model="chosenTransactionAmount" inputId="transaction-amount-input"></InputNumber>
              <label for="transaction-amount-input">Amount</label>
            </IftaLabel>
            <Button @click="onAddNewTransaction">Add</Button>
          </div>
        </div>
        <Divider layout="vertical" />
        <div class="min-w-96 min-h-72">
          <DataTable :value="transactionsList" :lazy="true" :paginator="true" :rows="maxTransactionRows"
            @page="onPageChangeTransactions" :totalRecords="totalTransactions" :loading="isLoadingTransactions"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink">
            <template #loading>
              <Skeleton width="100%" height="400px" />
            </template>
            <Column field="transaction_type" header="Type">
              <template #body="slotProps">
                {{ transactionsLocale[slotProps.data.transaction_type] || 'Unknown' }}
              </template>
            </Column>
            <Column field="amount" header="Amount"> </Column>
            <Column field="date" header="Date" sortable>
              <template #body="slotProps">
                {{ formatRuDateTime(slotProps.data.date) }}
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
      <div class="flex justify-end">
        <Button @click="balanceModalVisible = false">Закрыть</Button>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
// #region Imports

import { Icon } from '@iconify/vue';
import type { Tariff } from '@/api/tariff/schema';
import { tariffAll } from '@/api/tariff/service';
import {
  UserPatchRqSchema,
  type User,
  type UserRights,
  type UserSettings,
} from '@/api/user/schema';
import { userGet, userGetById, userPatch } from '@/api/user/service';
import useErrorToast from '@/composables/useErrorToast';
import userPermissionsLocale from '@/utils/locale/userPermissionsLocale';
import type { DataTableCellEditCompleteEvent, DataTablePageEvent } from 'primevue/datatable';
import { onMounted, ref } from 'vue';
import userSettingsLocale from '@/utils/locale/userSettingsLocale';
import type { TransactionAllGetRs } from '@/api/transaction/schema';
import { transactionCount, transactionGet, transactionPost } from '@/api/transaction/service';
import transactionsLocale from '@/utils/locale/transactionsLocale';
import type { TransactionType } from '@/api/transaction/schema';
import formatRuDateTime from '@/utils/formatRuDateTime';
import useCopyGuid from '@/composables/useCopyGuid';

// #endregion

// #region Composables

const errorToast = useErrorToast();

// #endregion

// #region Globals

// Array of all users
const users = ref<User[]>([]);
// Currently edited user (for modals)
const userInEdit = ref<User | null>(null);

/**
 * Updates the user in edit in the list of users.
 *
 * If the user in edit is not found in the list, an error is logged.
 */
const updateUserInEdit = async (): Promise<void> => {
  const user = await errorToast.safeExecute(async () => {
    if (!userInEdit.value) return null;

    return await userGetById({ user_id: userInEdit.value.id });
  });

  if (!user) return;
  const index = users.value.indexOf(userInEdit.value!);

  if (index === -1) {
    console.error('User in edit not found in the list');
    return;
  }

  users.value[index] = user;
  userInEdit.value = user;
};

// #endregion

// #region User Rights Modal

const rightsModalVisible = ref(false);
const checkedRights = ref<string[]>([]);

/**
 * Opens the user rights modal for the given user.
 * Resets the checked rights and sets the user in edit.
 * @param {User} user - The user to open the modal for.
 */
const openRightsModal = (user: User) => {
  // Set the user in edit and reset checked rights
  userInEdit.value = user;
  checkedRights.value = [];
  // Populate checked rights based on the user's current rights
  Object.keys(user.rights).forEach((right) => {
    if (user.rights[right as keyof UserRights]) {
      checkedRights.value.push(right);
    }
  });
  // Show the rights modal
  rightsModalVisible.value = true;
};

/**
 * Saves the changes made to the user's rights in the user rights modal.
 * Closes the user rights modal.
 */
const saveRightsModal = async () => {
  // Create a copy of the user's rights (not modified directly)
  const rights = { ...userInEdit.value!.rights } as UserRights;
  // Update rights based on checked rights
  Object.keys(rights).forEach((right) => {
    rights[right as keyof UserRights] = checkedRights.value.includes(right);
  });

  // Send the updated rights to the server
  const result = await errorToast.safeExecute(async () => {
    await userPatch(userInEdit.value!.id, { rights });

    return true;
  });

  // Update the user in edit if the request was successful
  if (result) {
    await updateUserInEdit();
  }

  // Close the rights modal
  rightsModalVisible.value = false;
};

// #endregion

// #region User Settings Modal

const settingsModalVisible = ref(false);
const checkedSettings = ref<string[]>([]);

/**
 * Opens the user settings modal for the given user.
 * Fills the checked settings with the user's current settings.
 * @param {User} user - The user to open the modal for.
 */
const openSettingsModal = (user: User) => {
  // Like in the rights modal, set the user in edit and reset checked settings
  // then populate checked settings based on the user's current settings
  userInEdit.value = user;
  checkedSettings.value = [];
  Object.keys(user.settings).forEach((setting) => {
    if (user.settings[setting as keyof UserSettings]) {
      checkedSettings.value.push(setting);
    }
  });

  // Show the settings modal
  settingsModalVisible.value = true;
};

/**
 * Saves the user settings in the settings modal.
 * Patches the user settings in the API and updates the user in edit's settings.
 * Closes the settings modal after saving.
 */
const saveSettingsModal = async () => {
  // Similar to the rights modal, create a copy of the user's settings
  // and update it based on the checked settings
  const settings = { ...userInEdit.value!.settings } as UserSettings;
  Object.keys(settings).forEach((setting) => {
    settings[setting as keyof UserSettings] = checkedSettings.value.includes(setting);
  });

  const result = await errorToast.safeExecute(async () => {
    await userPatch(userInEdit.value!.id, { settings });

    return true;
  });

  // Update the user in edit if the request was successful
  if (result) {
    await updateUserInEdit();
  }

  // Close the settings modal
  settingsModalVisible.value = false;
};

// #endregion

// #region User Transactions Modal

const balanceModalVisible = ref(false);

// Paramenters that control the transactions list
const transactionsList = ref<TransactionAllGetRs>([]);
// FIXME: Better to make this limit dynamic based on screen size...
const maxTransactionRows = 5;
const totalTransactions = ref(0);
const isLoadingTransactions = ref(false);
const currentPageTransactions = ref(0);

// Parameters for creating a new transaction
const allTransactionTypes = ref<{ label: string; value: string }[]>([]);
const chosenTransactionType = ref<{ label: string; value: string }>();
const chosenTransactionAmount = ref<number>(0);

/**
 * Loads the user's transactions based on the current page and limit.
 * Sets isLoadingTransactions to true while loading and false when done.
 */
const loadTransactions = async () => {
  isLoadingTransactions.value = true;

  const result = await errorToast.safeExecute(async () => {
    return await transactionGet({
      user_id: userInEdit.value!.id,
      offset: currentPageTransactions.value * maxTransactionRows,
      limit: maxTransactionRows,
    });
  });

  if (result) transactionsList.value = result;

  isLoadingTransactions.value = false;
};

/**
 * Opens the balance modal for the given user.
 * Loads the user's transactions and sets the total transactions count.
 * @param {User} user - The user to open the modal for.
 */
const openBalanceModal = async (user: User) => {
  userInEdit.value = user;

  const result = await errorToast.safeExecute(async () => {
    return await transactionCount({
      user_id: user.id,
    });
  });

  if (result) totalTransactions.value = result;

  await loadTransactions();
  balanceModalVisible.value = true;
};

/**
 * Called when the user changes the page in the transactions data table.
 * Updates the current page and loads the transactions for the new page.
 * @param {DataTablePageEvent} event - The event that triggered the page change.
 */
const onPageChangeTransactions = async (event: DataTablePageEvent) => {
  currentPageTransactions.value = event.page;

  await loadTransactions();
};

/**
 * Adds a new transaction for the user currently in edit.
 * Updates the user's total transactions count and loads the new transactions list.
 * Resets the chosen transaction amount to 0.
 */
const onAddNewTransaction = async () => {
  const result = await errorToast.safeExecute(async () => {
    return await transactionPost({
      user_id: userInEdit.value!.id,
      amount: chosenTransactionAmount.value,
      transaction_type: (chosenTransactionType.value?.value as TransactionType) || 'refund',
      date: new Date(),
      description: '',
    });
  });

  if (!result) return;

  chosenTransactionAmount.value = 0;

  totalTransactions.value += 1;
  await loadTransactions();

  // Update the user in edit to reflect the new balance
  await updateUserInEdit();
};

// #endregion

// #region User Transactions

const tariffs = ref<Tariff[]>([]);
const chosenTariff = ref<Record<string, Tariff>>({});

// #endregion

const updateDataTable = async (event: DataTableCellEditCompleteEvent<User>) => {
  if (event.data.telegram_id === event.newData.telegram_id) return;

  const result = await errorToast.safeExecute(async () => {
    await userPatch(
      event.data.id,
      UserPatchRqSchema.parse({ telegram_id: event.newData.telegram_id }),
    );

    return true;
  });

  if (!result) return;

  const userAfterUpdate = await errorToast.safeExecute(async () => {
    return await userGetById({ user_id: event.data.id });
  });

  if (!userAfterUpdate) return;

  users.value[event.index] = userAfterUpdate;
};

const loadingTable = ref(true);

onMounted(async () => {
  await errorToast.safeExecute(async () => {
    await userGet().then((response) => {
      users.value = response;
    });

    await tariffAll().then((response) => {
      tariffs.value = response;
    });
  });

  users.value.forEach((user) => {
    chosenTariff.value[user.id] = tariffs.value.find((tariff) => tariff.id === user.tariff.id)!;
  });

  Object.keys(transactionsLocale).forEach((transactionType) => {
    allTransactionTypes.value.push({
      label: transactionsLocale[transactionType as keyof typeof transactionsLocale]!,
      value: transactionType,
    });
  });

  await new Promise((resolve) => setTimeout(resolve, 500)); // Artificial delay for better UX

  loadingTable.value = false;
});

const { copyGuid } = useCopyGuid();
</script>
