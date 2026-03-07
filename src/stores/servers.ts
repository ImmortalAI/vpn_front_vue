import type { Server } from '@/api/server/schema';
import { serverCount, serverGet, serverIdPatch, serverPost } from '@/api/server/service';
import errorExtractor from '@/utils/errorExtractor';
import { defineStore } from 'pinia';
import { ref, watch, type Ref } from 'vue';

/**
 * Pinia store for managing server list.
 * Provides CRUD operations with pagination support.
 */
export const useServersStore = defineStore('servers', () => {
  /**
   * List of servers on the current page
   * @type {Ref<Server[]>}
   */
  const items: Ref<Server[]> = ref<Server[]>([]);

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
   *   await serversStore.initialize();
   * });
   * ```
   */
  const initialize = async (): Promise<void> => {
    if (isInitialized.value) return;

    loading.value = true;

    try {
      const countItems = await serverCount();
      const page = await serverGet({ offset: first.value, limit: rows.value });

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
   * await serversStore.fetchData();
   *
   * // Background update without loading indicator
   * await serversStore.fetchData(true);
   * ```
   */
  const fetchData = async (noLoading: boolean = false): Promise<void> => {
    if (!noLoading) loading.value = true;
    error.value = null;

    try {
      const page = await serverGet({ offset: first.value, limit: rows.value });
      items.value = page;
    } catch (e) {
      const msg = errorExtractor(e);
      error.value = msg;
      console.error(msg);
    } finally {
      if (!noLoading) loading.value = false;
    }
  };

  /**
   * Creates a new server and refreshes the list.
   * If occurs an error, error message is stored in `error` state.
   *
   * @async
   * @param {Server} server - Server object to create
   * @returns {Promise<void>}
   */
  const create = async (server: Server): Promise<void> => {
    loading.value = true;

    try {
      await serverPost(server);
      await fetchData(true);
    } catch (e) {
      const msg = errorExtractor(e);
      error.value = msg;
      console.error(msg);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Updates an existing server by ID and refreshes the list.
   * If occurs an error, error message is stored in `error` state.
   *
   * @async
   * @param {Server} server - Server object with updated data
   *                          (must contain a valid `id`)
   * @returns {Promise<void>}
   */
  const update = async (server: Server): Promise<void> => {
    loading.value = true;

    try {
      await serverIdPatch(server.id, server);
      await fetchData(true);
    } catch (e) {
      const msg = errorExtractor(e);
      error.value = msg;
      console.error(msg);
    } finally {
      loading.value = false;
    }
  };

  // Automatically fetch data when pagination page changes
  watch([first, rows], async () => {
    await fetchData();
  });

  return {
    items,
    totalRecords,
    loading,
    error,
    first,
    rows,

    initialize,
    fetchData,
    create,
    update,
  };
});
