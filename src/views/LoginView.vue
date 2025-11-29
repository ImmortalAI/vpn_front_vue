<template>
  <div class="flex flex-col items-center gap-8">
    <p class="text-4xl">Вход</p>
    <Form v-slot="$form" :resolver :validateOnBlur="true" class="border-2 border-surface-500 p-8 rounded-2xl">
      <Fluid class="flex flex-col gap-4">
        <InputGroup class="mt-4">
          <FloatLabel>
            <InputText id="telegramIdInput" name="telegramId" v-model="telegramId"></InputText>
            <label for="telegramIdInput">Telegram ID</label>
          </FloatLabel>
          <InputGroupAddon>
            <Button :icon="iconCodeSend" :disabled="($form.telegramId?.invalid ?? false) || countdown.isActive.value"
              @click="sendCodeClick" :label="labelCodeSend" :pt="{ label: { class: 'w-6' } }"></Button>
          </InputGroupAddon>
        </InputGroup>
        <Message severity="error" v-if="$form.telegramId?.invalid ?? false">ID должен быть числом</Message>
        <template v-if="codeSended">
          <FloatLabel class="mt-4">
            <InputText id="telegramCodeInput" name="telegramCode" v-model="telegramCode"></InputText>
            <label for="telegramCodeInput">Telegram Code</label>
          </FloatLabel>
          <Message severity="error" v-if="$form.telegramCode?.invalid ?? false">ID должен быть числом</Message>
          <Button label="Войти" icon="pi pi-sign-in" :disabled="!$form.valid" @click="loginClick"></Button>
        </template>
      </Fluid>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { authLogin, authTgCode } from '@/api/auth/service';
import { AuthLoginRqSchema, AuthTgCodeRqSchema } from '@/api/auth/schema';
import useErrorToast from '@/composables/useErrorToast';
import { useCountdown } from '@vueuse/core';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useUserStore } from '@/stores/user';
import { resolver } from '@/utils/formValidation/loginForm';

const router = useRouter();
const toast = useToast();
const user = useUserStore();

const telegramId = ref('');
const telegramCode = ref('');

const codeSended = ref(false);
const codeResended = ref(false);
const iconCodeSend = computed(() =>
  countdown.isActive.value ? '' : codeSended.value ? 'pi pi-refresh' : 'pi pi-check',
);
const labelCodeSend = computed(() =>
  countdown.isActive.value ? countdown.remaining.value.toString() : '',
);
const errorToast = useErrorToast();

const countdown = useCountdown(30, {
  onComplete: () => {
    codeResended.value = false;
  },
});

const sendCodeClick = async () => {
  const result = await errorToast.safeExecute(async () => {
    const response = await authTgCode(AuthTgCodeRqSchema.parse({ tg_id: telegramId.value }));
    toast.add({
      severity: 'success',
      summary: response.message,
      life: 1000,
    });

    return true;
  });

  if (result) {
    codeSended.value = true;
    countdown.start();
  }
};

const loginClick = async () => {

  const result = await errorToast.safeExecute(async () => {
    const response = await authLogin(
      AuthLoginRqSchema.parse({ tg_id: Number(telegramId.value), tg_code: telegramCode.value }),
    );
    await user.refreshUser();
    toast.add({
      severity: 'success',
      summary: response.message,
      life: 1000,
    });

    return true;
  });
  if (result) router.push('/dashboard');

};
</script>
