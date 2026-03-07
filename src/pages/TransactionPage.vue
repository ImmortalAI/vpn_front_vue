<template>
  <Card>
    <template #title>Transactions</template>
    <template #content>
      <div class="flex w-full">
        <div class="flex flex-col w-[40%]">
          <span>Balance: {{ transactions.user?.balance / 100 }}</span>
          <Divider />
          <Fluid class="flex flex-col gap-2">
            <span>Create new transaction</span>
            <IftaLabel>
              <Select v-model="chosenTransactionType" :options="allTransactionTypes" optionLabel="label"
                labelId="transaction-type-select" class="w-full"></Select>
              <label for="transaction-type-select">Type</label>
            </IftaLabel>
            <IftaLabel>
              <InputNumber v-model="chosenTransactionAmount" inputId="transaction-amount-input" mode="currency"
                currency="RUB" locale="ru-RU" showClear></InputNumber>
              <label for="transaction-amount-input">Amount</label>
            </IftaLabel>
            <IftaLabel>
              <Textarea v-model="chosenTransactionDescription" inputId="transaction-description-input" />
              <label for="transaction-description-input">Description</label>
            </IftaLabel>
            <Button @click="onAddNewTransaction">Add</Button>
          </Fluid>
        </div>
        <Divider layout="vertical" />
        <DataTable class="w-full" :value="transactions.items" lazy paginator :rows="transactions.rows"
          :first="transactions.first" :total-records="transactions.totalRecords" :loading="transactions.loading">
          <template #loading>
            <Skeleton width="100%" height="400px" />
          </template>
          <Column field="transaction_type" header="Type">
            <template #body="slotProps">
              {{ transactionsLocale[slotProps.data.transaction_type] || 'Unknown' }}
            </template>
          </Column>
          <Column field="amount" header="Amount">
            <template #body="slotProps">
              {{ (slotProps.data as Transaction).amount / 100 }}
            </template>
          </Column>
          <Column field="date" header="Date">
            <template #body="slotProps">
              {{ dateTimeFormatter(slotProps.data.date) }}
            </template>
          </Column>
        </DataTable>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import type { Uuid } from '@/api/base/schema';
import type { Transaction, TransactionType } from '@/api/transaction/schema';
import { useTransactionsStore } from '@/stores/transactions';
import dateTimeFormatter from '@/utils/dateTimeFormatter';
import transactionsLocale from '@/utils/locale/transactionsLocale';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

declare type TransactionTypeSelector = { label: string; value: TransactionType };

const router = useRouter();
const route = useRoute();
const toast = useToast();
const transactions = useTransactionsStore();

const { userId } = route.params;

// Parameters for creating a new transaction
const allTransactionTypes = ref<{ label: string; value: TransactionType }[]>([]);
const chosenTransactionType = ref<{ label: string; value: TransactionType }>({} as TransactionTypeSelector);
const chosenTransactionAmount = ref<number>(0);
const chosenTransactionDescription = ref<string>('');

/**
 * Adds a new transaction for the user currently in edit.
 * Updates the user's total transactions count and loads the new transactions list.
 * Resets the chosen transaction amount to 0.
 */
const onAddNewTransaction = async () => {
  await transactions.create({
    user_id: transactions.user.id,
    amount: Math.round(chosenTransactionAmount.value * 100), /* in kopecks */
    transaction_type: chosenTransactionType.value.value,
    date: new Date(),
    description: chosenTransactionDescription.value,
  });

  chosenTransactionAmount.value = 0;
  chosenTransactionDescription.value = '';
};

onMounted(async () => {
  if (typeof userId !== 'string') router.push({ name: 'not-found' })

  // Assigning the value triggers watch effect in the store, which fetches the data
  transactions.userId = userId as Uuid;

  Object.keys(transactionsLocale).forEach((transactionType) => {
    allTransactionTypes.value.push({
      label: transactionsLocale[transactionType as keyof typeof transactionsLocale]!,
      value: transactionType as TransactionType,
    });
  });

  chosenTransactionType.value = allTransactionTypes.value[0]!;
})

watch(() => transactions.error, (err) => {
  if (err) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: err,
      life: 3000
    })

    transactions.error = null;
  }
})
</script>
