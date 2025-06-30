<template>
  <div>
    <Card>
      <template #title>Пользователи</template>
      <template #content>
        <DataTable v-model:expandedRows="expanded" :value="users" dataKey="id">
          <Column expander style="width: 5rem" />
          <Column field="telegram_id" header="Telegram ID"></Column>
          <Column field="telegram_username" header="Имя пользователя"></Column>
          <Column field="balance" header="Баланс"></Column>
          <Column field="created_date" header="Дата регистрации"></Column>
          <Column field="tariff" header="Тариф">
            <template #body="slotProps">
              <Select
                @change="changeTariff(slotProps.data.id, $event.value)"
                :options="tariffs"
                optionLabel="name"
              ></Select>
            </template>
          </Column>
          <Column field="rights" header="Права">
            <template #body="slotProps">
              <Button
                icon="pi pi-pencil"
                severity="secondary"
                rounded
                @click="openRightsModal(slotProps.data as User)"
              />
            </template>
          </Column>
          <template #expansion>
            <div class="p-4">
              <span>Тариф</span>
            </div>
          </template>
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
  </div>
</template>

<script setup lang="ts">
import type { Tariff } from '@/api/tariff/schema';
import { tariffAll } from '@/api/tariff/service';
import { UserPatchRqSchema, type User, type UserRights } from '@/api/user/schema';
import { userAll, userPatch } from '@/api/user/service';
import useErrorToast from '@/composables/useErrorToast';
import userPermissionsLocale from '@/utils/locale/userPermissionsLocale';
import { isAxiosError } from 'axios';
import { onMounted, ref, shallowRef } from 'vue';

const errorToast = useErrorToast();

const users = ref<User[]>([]);
const expanded = ref<Record<string, boolean>>({});

const rightsModalVisible = shallowRef(false);
const userInEdit = ref<User | null>(null);
const checkedRights = ref<string[]>([]);

const openRightsModal = (user: User) => {
  userInEdit.value = user;
  Object.keys(user.rights).forEach((right) => {
    if (user.rights[right as keyof UserRights]) {
      checkedRights.value.push(right);
    }
  });
  rightsModalVisible.value = true;
};

const saveRightsModal = () => {
  try {
    const rights = { ...userInEdit.value!.rights } as UserRights;
    Object.keys(rights).forEach((right) => {
      rights[right as keyof UserRights] = checkedRights.value.includes(right);
    });
    userPatch(userInEdit.value!.id, UserPatchRqSchema.parse({ rights }));
    userInEdit.value!.rights = rights;
  } catch (error) {
    if (isAxiosError(error)) {
      errorToast.error(error);
    } else {
      throw error;
    }
  }

  rightsModalVisible.value = false;
};

const tariffs = ref<Tariff[]>([]);

const changeTariff = (userId: string, tariff: Tariff) => {
  try {
    userPatch(userId, UserPatchRqSchema.parse({ tariff_id: tariff.id }));
  } catch (error) {
    if (isAxiosError(error)) {
      errorToast.error(error);
    } else {
      throw error;
    }
  }
};

onMounted(async () => {
  await userAll().then((response) => {
    users.value = response;
  });
  await tariffAll().then((response) => {
    tariffs.value = response;
  });
});
</script>
