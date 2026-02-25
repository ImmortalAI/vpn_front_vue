import type { Server, UpdateServer } from '@/api/server/schema';
import { serverCount, serverGet, serverIdPatch, serverPost } from '@/api/server/service';
import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * Store for managing paginated server data.
 *
 * Provides methods for initializing, loading pages, creating, and updating servers.
 */
export const useServersStore = defineStore('servers', () => {
  /**
   * A record mapping page indices to arrays of servers.
   * Each key represents a zero-based page index, and the value is
   * the array of {@link Server} objects loaded for that page.
   */
  const pages = ref<Record<number, Server[]>>({});

  /** Total number of servers available on the backend. */
  const count = ref(0);

  /** Number of servers fetched per page. */
  const pageSize = ref(5);

  /**
   * Set of page indices that are currently being fetched.
   * Used to prevent duplicate concurrent requests for the same page
   * and to cancel stale loads when {@link init} is called.
   */
  const loadingPages = new Set<number>();

  /**
   * Initializes (or re-initializes) the store by resetting all cached pages,
   * fetching the total server count, and loading the first page.
   *
   * @param initialPageSize - Number of servers per page. Defaults to `5`.
   * @returns A promise that resolves once initialization is complete.
   * @throws {AxiosError} If any of the underlying API calls
   *   ({@link serverCount}, {@link serverGet}) fail.
   */
  const init = async (initialPageSize: number = 5): Promise<void> => {
    pageSize.value = initialPageSize;
    pages.value = {};
    loadingPages.clear();

    const [srvCount, srvPage] = await Promise.all([
      serverCount(),
      serverGet({ limit: initialPageSize }),
    ]);

    count.value = srvCount;
    pages.value[0] = srvPage;
  };

  /**
   * Loads a specific page of servers into the store.
   *
   * If the page is already loaded or is currently being fetched, the call
   * is a no-op. If {@link init} is called while a page is loading, the
   * in-flight result is discarded to avoid writing stale data.
   *
   * @param indexPage - Zero-based page index to load.
   * @returns A promise that resolves once the page has been loaded (or skipped).
   * @throws {AxiosError} If the underlying {@link serverGet} call fails.
   * @throws {ZodError} If the underlying {@link serverGet} call fails.
   */
  const loadPage = async (indexPage: number): Promise<void> => {
    if (pages.value[indexPage] || loadingPages.has(indexPage)) return;

    loadingPages.add(indexPage);

    try {
      const newPage = await serverGet({
        offset: indexPage * pageSize.value,
        limit: pageSize.value,
      });

      // If init() called then we should stop loading this page
      if (!loadingPages.has(indexPage)) return;

      pages.value[indexPage] = newPage;
    } finally {
      loadingPages.delete(indexPage);
    }
  };

  /**
   * Creates a new server on the backend and re-initializes the store so
   * that the paginated data reflects the newly added entry.
   *
   * @param server - The {@link Server} object to create.
   * @returns A promise that resolves once the server has been created and the
   *   store has been re-initialized.
   * @throws {AxiosError} If the underlying {@link serverPost}
   *   call or the subsequent {@link init} call fails.
   */
  const create = async (server: Server) => {
    await serverPost(server);
    await init(pageSize.value);
  };

  /**
   * Patches an existing server with only the fields that have changed and
   * updates the corresponding entry in the store's page cache in-place.
   *
   * Only fields whose values differ from the currently cached server are
   * included in the PATCH request. If no fields have changed, the method
   * returns immediately without making an API call.
   *
   * @param pageNum - Zero-based page index where the server is located.
   * @param server  - The {@link Server} object containing updated field values.
   *   Must include a valid `id` that matches an entry on the given page.
   * @returns A promise that resolves once the server has been patched and the
   *   local cache has been updated (or immediately if nothing changed).
   * @throws {Error} If the specified page is not loaded in the store.
   * @throws {Error} If a server with the given `id` is not found on the
   *   specified page.
   * @throws {AxiosError} If the underlying
   *   {@link serverIdPatch} call fails.
   * @throws {ZodError} If the underlying
   *   {@link serverIdPatch} call fails.
   */
  const update = async (pageNum: number, server: Server) => {
    const currentPage = pages.value[pageNum];
    if (!currentPage) {
      throw new Error('Current page is not loaded, unable to update one of its servers');
    }

    const oldIndex = currentPage.findIndex((o) => {
      return o.id === server.id;
    });

    if (oldIndex === -1) {
      throw new Error('Server to update was not found in the current page');
    }

    const old = currentPage[oldIndex] as Server;

    const changes: UpdateServer = {};
    (Object.keys(server) as (keyof Server)[]).forEach((val) => {
      if (val == 'id') return;

      if (server[val] !== old[val]) {
        (changes as Record<keyof Server, unknown>)[val] = server[val];
      }
    });

    if (Object.keys(changes).length === 0) {
      return;
    }

    const newServer = await serverIdPatch(server.id, changes);

    currentPage.splice(oldIndex, 1, newServer);
  };

  return {
    pages,
    count,
    pageSize,
    create,
    update,
    init,
    loadPage,
  };
});
