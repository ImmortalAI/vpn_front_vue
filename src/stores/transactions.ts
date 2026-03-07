import type { Uuid } from '@/api/base/schema';
import type { Transaction } from '@/api/transaction/schema';
import { transactionCount, transactionGet, transactionPost } from '@/api/transaction/service';
import type { User } from '@/api/user/schema';
import { userGetById } from '@/api/user/service';
import errorExtractor from '@/utils/errorExtractor';
import { defineStore } from 'pinia';
import { ref, shallowRef, watch, type Ref } from 'vue';

/**
 * Pinia store for managing user list.
 * Provides CRUD operations with pagination support.
 */
export const useTransactionsStore = defineStore('transactions', () => {
  const userId = ref<Uuid>('');

  // Read-only user
  const user = shallowRef<User>({} as User);

  /**
   * List of users on the current page
   * @type {Ref<User[]>}
   */
  const items: Ref<Transaction[]> = ref<Transaction[]>([]);

  /**
   * Total number of records in the database
   * @type {Ref<number>}
   */
  const totalRecords: Ref<number> = ref(0);

  /**
   * Loading state flag
   * @type {Ref<boolean>}
   */
  const loading: Ref<boolean> = ref(false);

  /**
   * Error message (null if no errors)
   * @type {Ref<string | null>}
   */
  const error: Ref<string | null> = ref<string | null>(null);

  /**
   * Index of the first item on current page (for pagination)
   * @type {Ref<number>}
   */
  const first: Ref<number> = ref(0);

  /**
   * Number of rows per page
   * @type {Ref<number>}
   */
  const rows: Ref<number> = ref(10);

  /**
   * Store initialization flag (prevents redundant loading)
   * @type {Ref<boolean>}
   */
  const isInitialized: Ref<boolean> = ref(false);

  /**
   * Initializes the store: fetches total record count
   * and loads the first page of data.
   * This method is idempotent - subsequent calls are ignored.
   *
   * @async
   * @returns {Promise<void>}
   *
   * @example
   * ```ts
   * // In a component
   * onMounted(async () => {
   *   await usersStore.initialize();
   * });
   * ```
   */
  const initialize = async (): Promise<void> => {
    if (isInitialized.value) return;

    loading.value = true;

    try {
      const countItems = await transactionCount();
      const page = await transactionGet({
        user_id: userId.value,
        offset: first.value,
        limit: rows.value,
      });
      const userData = await userGetById(userId.value);

      user.value = userData;
      totalRecords.value = countItems;
      items.value = page;
      isInitialized.value = true;
    } catch (e) {
      const msg = errorExtractor(e);
      error.value = msg;
      console.error(msg);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fetches data for the current page.
   * Uses current `first` and `rows` values for pagination.
   *
   * @async
   * @param {boolean} [noLoading=false] - If true, does not toggle loading flag
   *                                      (useful for background updates)
   * @returns {Promise<void>}
   *
   * @example
   * ```ts
   * // Regular fetch with loading indicator
   * await usersStore.fetchData();
   *
   * // Background update without loading indicator
   * await usersStore.fetchData(true);
   * ```
   */
  const fetchData = async (noLoading: boolean = false): Promise<void> => {
    if (!noLoading) loading.value = true;
    error.value = null;

    try {
      const page = await transactionGet({
        user_id: userId.value,
        offset: first.value,
        limit: rows.value,
      });
      items.value = page;
    } catch (e) {
      const msg = errorExtractor(e);
      error.value = msg;
      console.error(msg);
    } finally {
      if (!noLoading) loading.value = false;
    }
  };

  const create = async (transaction: Transaction): Promise<void> => {
    loading.value = true;

    try {
      await transactionPost(transaction);
      isInitialized.value = false;
      await initialize();
    } catch (e) {
      const msg = errorExtractor(e);
      error.value = msg;
      console.error(msg);
    } finally {
      loading.value = false;
    }
  };

  watch(userId, async () => {
    isInitialized.value = false;
    await initialize();
  });

  // Automatically fetch data when pagination page changes
  watch([first, rows], async () => {
    await fetchData();
  });

  return {
    userId,
    user,
    items,
    totalRecords,
    loading,
    error,
    first,
    rows,

    initialize,
    fetchData,
    create,
  };
});
