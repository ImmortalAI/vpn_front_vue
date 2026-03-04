import type { Tariff } from '@/api/tariff/schema';
import { tariffAll } from '@/api/tariff/service';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useTariffsStore = defineStore('tariffs', () => {
  const items = ref<Tariff[]>([]);

  const initialized = ref(false);

  const init = async () => {
    if (initialized.value) return;

    items.value = await tariffAll();
    initialized.value = true;
  };

  const shortList = computed(() => items.value.map((t) => ({ name: t.name, id: t.id })));

  return { items, shortList, initialized, init };
});
