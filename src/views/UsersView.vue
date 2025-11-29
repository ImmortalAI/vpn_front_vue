<template>
  <div>
    <Card>
      <template #title>Пользователи</template>
      <template #content>
        <DataTable editMode="cell" :value="users" dataKey="id" @cellEditComplete="updateDataTable">
          <!-- <Column expander style="width: 5rem" /> -->
          <Column field="id" header="Id"></Column>
          <Column field="telegram_id" header="Telegram ID">
            <template #editor="{ data, field }">
              <InputNumber :useGrouping="false" v-model="data[field]" :min="0"></InputNumber>
            </template>
          </Column>
          <Column field="telegram_username" header="TG Username"></Column>
          <Column field="balance" header="Balance">
            <template #body="slotProps">
              <Button
                severity="secondary"
                rounded
                @click="openBalanceModal(slotProps.data as User)"
              >
                <Icon icon="line-md:clipboard-list"></Icon>
              </Button>
            </template>
          </Column>
          <Column field="tariff" header="Tariff">
            <template #body="slotProps">
              <Select
                v-model="chosenTariff[(slotProps.data as User).id]"
                :options="tariffs"
                optionLabel="name"
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
    <Dialog
      v-model:visible="rightsModalVisible"
      modal
      :header="`Настройка прав ${userInEdit?.telegram_username || 'Unknown'}`"
    >
      <div
        v-for="userRight in Object.keys(userInEdit?.rights || {})"
        :key="userRight"
        class="flex items-center gap-2"
      >
        <Checkbox v-model="checkedRights" :inputId="userRight" :value="userRight" />
        <label :for="userRight">{{ userPermissionsLocale[userRight] || 'Unknown' }}</label>
      </div>
      <div class="flex justify-end">
        <Button @click="saveRightsModal">Сохранить</Button>
      </div>
    </Dialog>
    <Dialog
      v-model:visible="settingsModalVisible"
      modal
      :header="`Настройки пользователя ${userInEdit?.telegram_username || 'Unknown'}`"
    >
      <div
        v-for="userSetting in Object.keys(userInEdit?.settings || {})"
        :key="userSetting"
        class="flex items-center gap-2"
      >
        <Checkbox v-model="checkedSettings" :inputId="userSetting" :value="userSetting" />
        <label :for="userSetting">{{ userSettingsLocale[userSetting] || 'Unknown' }}</label>
      </div>
      <div class="flex justify-end">
        <Button @click="saveSettingsModal">Сохранить</Button>
      </div>
    </Dialog>
    <Dialog
      v-model:visible="balanceModalVisible"
      modal
      class="big-dialog"
      :header="`Транзакции пользователя ${userInEdit?.telegram_username || 'Unknown'}`"
    >
      <div class="flex">
        <div class="flex flex-col min-w-48 min-h-72">
          <span>Баланс: {{ userInEdit?.balance }}</span>
          <Divider />
          <div class="flex flex-col gap-2">
            <span>Create new transaction</span>
            <IftaLabel>
              <Select
                v-model="chosenTransactionType"
                :options="allTransactionTypes"
                optionLabel="label"
                labelId="transaction-type-select"
                class="w-full"
              ></Select>
              <label for="transaction-type-select">Type</label>
            </IftaLabel>
            <IftaLabel>
              <InputNumber
                v-model="chosenTransactionAmount"
                inputId="transaction-amount-input"
              ></InputNumber>
              <label for="transaction-amount-input">Amount</label>
            </IftaLabel>
            <Button @click="onAddNewTransaction">Add</Button>
          </div>
        </div>
        <Divider layout="vertical" />
        <div class="min-w-96 min-h-72">
          <DataTable
            :value="transactionsList"
            :lazy="true"
            :paginator="true"
            :rows="maxTransactionRows"
            @page="onPageChangeTransactions"
            :totalRecords="totalTransactions"
            :loading="isLoadingTransactions"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
          >
            <Column field="transaction_type" header="Type">
              <template #loading>
                <Skeleton width="2rem" height="1rem" />
              </template>
              <template #body="slotProps">
                {{ transactionsLocale[slotProps.data.transaction_type] || 'Unknown' }}
              </template>
            </Column>
            <Column field="amount" header="Amount">
              <template #loading>
                <Skeleton width="2rem" height="1rem" />
              </template>
            </Column>
            <Column field="date" header="Date" sortable>
              <template #loading>
                <Skeleton width="2rem" height="1rem" />
              </template>
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
import { onMounted, ref, shallowRef } from 'vue';
import userSettingsLocale from '@/utils/locale/userSettingsLocale';
import type { TransactionAllGetRs } from '@/api/transaction/schema';
import { transactionCount, transactionGet, transactionPost } from '@/api/transaction/service';
import transactionsLocale from '@/utils/locale/transactionsLocale';
import type { TransactionType } from '@/api/transaction/schema';
import formatRuDateTime from '@/utils/formatRuDateTime';

// #endregion

// #region Composables

const errorToast = useErrorToast();

// #endregion

// #region Globals

const users = ref<User[]>([]);
const userInEdit = ref<User | null>(null);

const updateUserInEdit = async () => {
  const user = await errorToast.safeExecute(async () => {
    if (!userInEdit.value) return null;

    return await userGetById({ user_id: userInEdit.value.id });
  });

  if (user) {
    const index = users.value.indexOf(userInEdit.value!);

    if (index === -1) {
      console.error('User in edit not found in the list');
      return;
    }

    users.value[index] = user;
    userInEdit.value = user;
  }
};

// #endregion

// #region User Rights Modal

const rightsModalVisible = shallowRef(false);
const checkedRights = ref<string[]>([]);

const openRightsModal = (user: User) => {
  userInEdit.value = user;
  checkedRights.value = [];
  Object.keys(user.rights).forEach((right) => {
    if (user.rights[right as keyof UserRights]) {
      checkedRights.value.push(right);
    }
  });
  rightsModalVisible.value = true;
};

const saveRightsModal = async () => {
  const rights = { ...userInEdit.value!.rights } as UserRights;
  Object.keys(rights).forEach((right) => {
    rights[right as keyof UserRights] = checkedRights.value.includes(right);
  });

  await errorToast.safeExecute(async () => {
    await userPatch(userInEdit.value!.id, { rights });
  });
  userInEdit.value!.rights = rights;

  rightsModalVisible.value = false;
};

// #endregion

// #region User Settings Modal

const settingsModalVisible = shallowRef(false);
const checkedSettings = ref<string[]>([]);

const openSettingsModal = (user: User) => {
  userInEdit.value = user;
  checkedSettings.value = [];
  Object.keys(user.settings).forEach((setting) => {
    if (user.settings[setting as keyof UserSettings]) {
      checkedSettings.value.push(setting);
    }
  });
  settingsModalVisible.value = true;
};

const saveSettingsModal = async () => {
  const settings = { ...userInEdit.value!.settings } as UserSettings;
  Object.keys(settings).forEach((setting) => {
    settings[setting as keyof UserSettings] = checkedSettings.value.includes(setting);
  });

  await errorToast.safeExecute(async () => {
    await userPatch(userInEdit.value!.id, { settings });
  });

  userInEdit.value!.settings = settings;

  settingsModalVisible.value = false;
};

// #endregion

// #region User Transactions Modal

const maxTransactionRows = 5;
const balanceModalVisible = shallowRef(false);
const transactionsList = ref<TransactionAllGetRs>([]);
const totalTransactions = ref(0);
const isLoadingTransactions = ref(false);
const currentPageTransactions = ref(0);
const allTransactionTypes = ref<{ label: string; value: string }[]>([]);
const chosenTransactionType = ref<{ label: string; value: string }>();
const chosenTransactionAmount = ref<number>(0);

const openBalanceModal = async (user: User) => {
  userInEdit.value = user;

  totalTransactions.value = await transactionCount({
    user_id: user.id,
  });

  await loadTransactions();
  balanceModalVisible.value = true;
};

const loadTransactions = async () => {
  isLoadingTransactions.value = true;

  transactionsList.value = await transactionGet({
    user_id: userInEdit.value!.id,
    offset: currentPageTransactions.value * maxTransactionRows,
    limit: maxTransactionRows,
  });

  isLoadingTransactions.value = false;
};

const onPageChangeTransactions = async (event: DataTablePageEvent) => {
  currentPageTransactions.value = event.page;

  await loadTransactions();
};

const onAddNewTransaction = async () => {
  await errorToast.safeExecute(async () => {
    await transactionPost({
      user_id: userInEdit.value!.id,
      amount: chosenTransactionAmount.value,
      transaction_type: (chosenTransactionType.value?.value as TransactionType) || 'refund',
      date: new Date(),
      description: '',
    });

    chosenTransactionAmount.value = 0;

    totalTransactions.value = await transactionCount({
      user_id: userInEdit.value!.id,
    });
    await loadTransactions();

    await updateUserInEdit();
  });
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

  if (result)
    users.value.find((user) => user.id === event.data.id)!.telegram_id = event.newData.telegram_id;
};

onMounted(async () => {
  await userGet().then((response) => {
    users.value = response;
  });

  await tariffAll().then((response) => {
    tariffs.value = response;
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
});
</script>
