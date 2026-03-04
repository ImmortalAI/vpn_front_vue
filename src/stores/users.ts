import type { Uuid } from '@/api/base/schema';
import { convertUser, type User } from '@/api/user/schema';
import { userCount, userGet, userGetById, userPatch } from '@/api/user/service';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUsersStore = defineStore('users', () => {
  /**
   * A record mapping page indices to arrays of users.
   * Each key represents a zero-based page index, and the value is
   * the array of {@link User} objects loaded for that page.
   */
  const pages = ref<Record<number, User[]>>({});

  const tariffs = ref<Record<Uuid, Uuid>>({});

  /** Total number of users available on the backend. */
  const count = ref(0);

  /** Number of users fetched per page. */
  const pageSize = ref(5);

  /**
   * Set of page indices that are currently being fetched.
   * Used to prevent duplicate concurrent requests for the same page
   * and to cancel stale loads when {@link init} is called.
   */
  const loadingPages = new Set<number>();

  /**
   * Initializes (or re-initializes) the store by resetting all cached pages,
   * fetching the total user count, and loading the first page.
   *
   * @param initialPageSize - Number of users per page. Defaults to `5`.
   * @returns A promise that resolves once initialization is complete.
   * @throws {AxiosError} If any of the underlying API calls
   *   ({@link userCount}, {@link userGet}) fail.
   */
  const init = async (initialPageSize: number = 5): Promise<void> => {
    pageSize.value = initialPageSize;
    pages.value = {};
    loadingPages.clear();

    const [userCountData, userPageData] = await Promise.all([
      userCount(),
      userGet({ limit: initialPageSize }),
    ]);

    count.value = userCountData;
    pages.value[0] = userPageData;

    userPageData.forEach((user) => {
      tariffs.value[user.id] = user.tariff.id;
    });
  };

  /**
   * Loads a specific page of users into the store.
   *
   * If the page is already loaded or is currently being fetched, the call
   * is a no-op. If {@link init} is called while a page is loading, the
   * in-flight result is discarded to avoid writing stale data.
   *
   * @param indexPage - Zero-based page index to load.
   * @returns A promise that resolves once the page has been loaded (or skipped).
   * @throws {AxiosError} If the underlying {@link userGet} call fails.
   * @throws {ZodError} If the underlying {@link userGet} call fails.
   */
  const loadPage = async (indexPage: number): Promise<void> => {
    if (pages.value[indexPage] || loadingPages.has(indexPage)) return;

    loadingPages.add(indexPage);

    try {
      const newPage = await userGet({
        offset: indexPage * pageSize.value,
        limit: pageSize.value,
      });

      // If init() called then we should stop loading this page
      if (!loadingPages.has(indexPage)) return;

      pages.value[indexPage] = newPage;

      newPage.forEach((user) => {
        tariffs.value[user.id] = user.tariff.id;
      });
    } finally {
      loadingPages.delete(indexPage);
    }
  };

  const getSpecific = async (userId: Uuid): Promise<User> => {
    let user: User | null = null;
    for (const page of Object.values(pages.value)) {
      const userInPage = page.find((u) => u.id === userId);
      if (userInPage) {
        user = userInPage;
        break;
      }
    }

    if (user) return user;

    return await userGetById(userId);
  };

  /**
   * Patches an existing user with only the fields that have changed and
   * updates the corresponding entry in the store's page cache in-place.
   *
   * Only fields whose values differ from the currently cached user are
   * included in the PATCH request. If no fields have changed, the method
   * returns immediately without making an API call.
   *
   * @param pageNum - Zero-based page index where the user is located.
   * @param user    - The {@link User} object containing updated field values.
   *   Must include a valid `id` that matches an entry on the given page.
   * @returns A promise that resolves once the user has been patched and the
   *   local cache has been updated (or immediately if nothing changed).
   * @throws {Error} If the specified page is not loaded in the store.
   * @throws {Error} If a user with the given `id` is not found on the
   *   specified page.
   * @throws {AxiosError} If the underlying {@link userPatch} call fails.
   * @throws {ZodError} If the underlying {@link userPatch} call fails.
   */
  const patch = async (pageNum: number, patch: User) => {
    const currentPage = pages.value[pageNum];
    if (!currentPage) {
      throw new Error('Current page is not loaded, unable to update one of its users');
    }

    const oldUserIndex = currentPage.findIndex((u) => {
      return u.id === patch.id;
    });

    if (oldUserIndex === -1) {
      throw new Error('User to update was not found in the current page');
    }

    const updatedUser = await userPatch(patch.id, convertUser(patch));

    currentPage.splice(oldUserIndex, 1, updatedUser);
  };

  return {
    pages,
    tariffs,
    count,
    pageSize,
    init,
    patch,
    getSpecific,
    loadPage,
  };
});
