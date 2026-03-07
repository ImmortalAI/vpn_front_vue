<template>
  <Card>
    <template #title>Notifications</template>
    <template #content>
      <div class="w-full flex justify-center">
        <Fluid class="flex flex-col gap-2 w-[60%]">
          <FloatLabel variant="in">
            <Textarea v-model="enText" inputId="en-notification-input" rows="8" />
            <label for="en-notification-input">EN notification</label>
          </FloatLabel>
          <FloatLabel variant="in">
            <Textarea v-model="ruText" inputId="ru-notification-input" rows="8" />
            <label for="ru-notification-input">RU notification</label>
          </FloatLabel>
          <div class="flex gap-24 px-12">
            <div class="flex items-center gap-2">
              <Checkbox v-model="notifyCheck" binary input-id="notify-check" />
              <label for="notify-check">Notify</label>
            </div>
            <Button label="Send" @click="sendMessage" />
          </div>
        </Fluid>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { notificationPost } from '@/api/notifications/service';
import useErrorToast from '@/composables/useErrorToast';
import { ref } from 'vue';

const errorToast = useErrorToast();

const enText = ref('');
const ruText = ref('');
const notifyCheck = ref(false);

const sendMessage = async () => {
  await errorToast.safeExecute(async () => {
    await notificationPost({
      data: {
        en: enText.value,
        ru: ruText.value
      },
      notify: notifyCheck.value
    })
  })
};
</script>
