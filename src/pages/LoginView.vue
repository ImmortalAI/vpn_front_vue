<template>
  <div class="flex flex-col items-center gap-8">
    <p class="text-4xl">Log In</p>
    <Form
      v-slot="$form"
      :resolver
      :validateOnBlur="true"
      class="border-2 border-surface-500 p-8 rounded-2xl"
    >
      <Fluid class="flex flex-col gap-4">
        <InputGroup class="mt-4">
          <FloatLabel>
            <InputText id="telegramIdInput" name="telegramId" v-model="telegramId"></InputText>
            <label for="telegramIdInput">Telegram ID</label>
          </FloatLabel>
          <InputGroupAddon>
            <Button
              :icon="iconCodeSend"
              :disabled="($form.telegramId?.invalid ?? false) || countdown.isActive.value"
              @click="sendCodeClick"
              :label="labelCodeSend"
              :pt="{ label: { class: 'w-6' } }"
            ></Button>
          </InputGroupAddon>
        </InputGroup>
        <Message severity="error" v-if="$form.telegramId?.invalid ?? false"
          >Telegram Id must be a number</Message
        >
        <template v-if="codeSent">
          <FloatLabel class="mt-4">
            <InputText
              id="telegramCodeInput"
              name="telegramCode"
              v-model="telegramCode"
            ></InputText>
            <label for="telegramCodeInput">Telegram Code</label>
          </FloatLabel>
          <Message severity="error" v-if="$form.telegramCode?.invalid ?? false"
            >Code must be a number</Message
          >
          <Button
            label="Log Me In"
            icon="pi pi-sign-in"
            :disabled="!$form.valid"
            @click="loginClick"
          ></Button>
        </template>
      </Fluid>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { authTgCode } from '@/api/auth/service';
import useErrorToast from '@/composables/useErrorToast';
import { useCountdown } from '@vueuse/core';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { resolver } from '@/utils/formValidation/loginForm';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const toast = useToast();
const auth = useAuthStore();

const telegramId = ref('');
const telegramCode = ref('');

const codeSent = ref(false);
const codeResent = ref(false);
const iconCodeSend = computed(() =>
  countdown.isActive.value ? '' : codeSent.value ? 'pi pi-refresh' : 'pi pi-check',
);
const labelCodeSend = computed(() =>
  countdown.isActive.value ? countdown.remaining.value.toString() : '',
);
const errorToast = useErrorToast();

const countdown = useCountdown(30, {
  onComplete: () => {
    codeResent.value = false;
  },
});

const sendCodeClick = async () => {
  const result = await errorToast.safeExecute(async () => {
    const response = await authTgCode({ tg_id: parseInt(telegramId.value) });
    toast.add({
      severity: 'success',
      summary: response.message,
      life: 3000,
    });

    return true;
  });

  if (result) {
    codeSent.value = true;
    countdown.start();
  }
};

const loginClick = async () => {
  const result = await auth.login({
    tg_id: parseInt(telegramId.value),
    tg_code: telegramCode.value,
  });
  if (result.isOk) {
    toast.add({
      severity: 'success',
      summary: result.message,
      life: 3000,
    });
    router.push('/');
  } else {
    toast.add({
      severity: 'error',
      summary: result.message,
      life: 3000,
    });
  }
};
</script>
