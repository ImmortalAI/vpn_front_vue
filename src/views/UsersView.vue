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
          <template #expansion="slotProps">
            <div class="p-4">
              <p class="text-2xl">Права пользователя</p>
              <div class="flex flex-col gap-4">
                <div class="flex items-center gap-2">
                  <Checkbox
                    v-model="slotProps.data.rights.is_server_editor"
                    inputId="isServerEditor"
                    binary
                  />
                  <label for="isServerEditor">Редактирование серверов</label>
                </div>
                <div class="flex items-center gap-2">
                  <Checkbox
                    v-model="slotProps.data.rights.is_transaction_editor"
                    inputId="isTransactionEditor"
                    binary
                  />
                  <label for="isTransactionEditor">Редактирование транзакций</label>
                </div>
                <div class="flex items-center gap-2">
                  <Checkbox
                    v-model="slotProps.data.rights.is_active_period_editor"
                    inputId="isActivePeriodEditor"
                    binary
                  />
                  <label for="isActivePeriodEditor">Редактирование активных периодов</label>
                </div>
                <div class="flex items-center gap-2">
                  <Checkbox
                    v-model="slotProps.data.rights.is_tariff_editor"
                    inputId="isTariffEditor"
                    binary
                  />
                  <label for="isTariffEditor">Редактирование тарифов</label>
                </div>
                <div class="flex items-center gap-2">
                  <Checkbox
                    v-model="slotProps.data.rights.is_member_rights_editor"
                    inputId="isMemberRightsEditor"
                    binary
                  />
                  <label for="isMemberRightsEditor">Редактирование прав пользователей</label>
                </div>
                <div class="flex items-center gap-2">
                  <Checkbox
                    v-model="slotProps.data.rights.is_admin_rights_editor"
                    inputId="isAdminRightsEditor"
                    binary
                  />
                  <label for="isAdminRightsEditor">Редактирование прав администраторов</label>
                </div>
                <div class="flex items-center gap-2">
                  <Checkbox
                    v-model="slotProps.data.rights.is_control_panel_user"
                    inputId="isControlPanelUser"
                    binary
                  />
                  <label for="isControlPanelUser">Доступ к панели управления</label>
                </div>
                <div class="flex items-center gap-2">
                  <Checkbox
                    v-model="slotProps.data.rights.is_verified"
                    inputId="isVerified"
                    binary
                  />
                  <label for="isVerified">Верифицирован</label>
                </div>
              </div>
            </div>
          </template>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@/api/user/schema';
import { userAll } from '@/api/user/service';
import { onMounted, ref } from 'vue';

const users = ref<User[]>([]);
const expanded = ref<Record<string, boolean>>({});

onMounted(async () => {
  await userAll().then((res) => {
    users.value = res;
  });
  // users.value.push({
  //   id: "BIBA_BOBA",
  //   telegram_id: 0,
  //   telegram_username: '',
  //   balance: 0,
  //   created_date: (new Date(0)).toISOString(),
  //   rights: {
  //     is_server_editor: false,
  //     is_transaction_editor: false,
  //     is_active_period_editor: false,
  //     is_tariff_editor: false,
  //     is_member_rights_editor: false,
  //     is_admin_rights_editor: false,
  //     is_control_panel_user: false,
  //     is_verified: false,
  //   },
  //   settings: {
  //     auto_pay: false,
  //     is_active: false,
  //     get_traffic_notifications: false,
  //   },
  //   tariff: {
  //     id: "BIBA_BOBA",
  //     name: '',
  //     duration: 0,
  //     price: 0,
  //     price_of_traffic_reset: 0,
  //     traffic: 0,
  //     is_special: false
  //   }
  // })
});
</script>
