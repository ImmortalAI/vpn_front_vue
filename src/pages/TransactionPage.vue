<template>
  <Card>
    <template #title>Transactions</template>
    <template #content>
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
                {{ dateTimeFormatter(slotProps.data.date) }}
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { useUsersStore } from '@/stores/users';
import { useRoute } from 'vue-router';

const route = useRoute();
const users = useUsersStore();

const { id } = route.params;

const transactionsList = ref<TransactionAllGetRs>([]);
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
</script>
