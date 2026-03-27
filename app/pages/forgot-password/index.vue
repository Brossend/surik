<template>
  <div class="forgot-password">
    <div class="forgot-password__container">
      <div class="forgot-password__card">
        <UiMascot />

        <form
          class="forgot-password__content"
          @submit.prevent="handleSubmit"
        >
          <span class="forgot-password__title">
            {{ currentStepTitle }}
          </span>

          <span class="forgot-password__subtitle">
            {{ currentStepSubtitle }}
          </span>

          <UiInput
            v-model="email"
            autocomplete="email"
            :disabled="isBusy"
            :error="emailError"
            label="Электронная почта"
            placeholder="pressf@respawn.gg"
            required
            type="email"
          />

          <template v-if="isCodeStep">
            <UiInput
              v-model="code"
              :disabled="isBusy"
              :error="codeError"
              hint="Шестизначный код из письма"
              label="Код подтверждения"
              placeholder="123456"
              required
            />
            <UiInput
              v-model="newPassword"
              autocomplete="new-password"
              :disabled="isBusy"
              :error="passwordError"
              label="Новый пароль"
              placeholder="EZ4ME_2026!"
              required
              type="password"
            />
          </template>

          <ui-button
            full-width
            :loading="isBusy"
            :label="submitLabel"
            native-type="submit"
          />

          <ui-button
            v-if="isCodeStep"
            full-width
            :disabled="isBusy"
            label="Отправить код заново"
            @click="handleResendCode"
          />

          <span
            v-if="successMessage"
            class="forgot-password__success"
          >
            {{ successMessage }}
          </span>

          <span
            v-if="formError"
            class="forgot-password__error"
          >
            {{ formError }}
          </span>

          <ui-divider label="или" />

          <span class="forgot-password__footer">
            Вспомнили пароль?
            <ui-link
              label="Вернуться ко входу"
              to="/login"
            />
          </span>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useMutation, useQueryClient } from '@tanstack/vue-query';

import UiButton from '~/components/ui/ui-button/ui-button.vue';
import UiDivider from '~/components/ui/ui-divider/ui-divider.vue';
import UiInput from '~/components/ui/ui-input/ui-input.vue';
import UiLink from '~/components/ui/ui-link/ui-link.vue';
import UiMascot from '~/components/ui/ui-mascot/ui-mascot.vue';
import { authQueryKeys } from '~/constants/auth';
import { useAuthApi } from '~/composables/use-auth-api';
import { useAuthStore } from '~/stores/auth';
import type {
  IRequestPasswordResetPayload,
  IResetPasswordPayload,
} from '~/types/auth';
import { getApiErrorMessage } from '~/utils/api-error';

useHead({
  title: 'Сброс пароля — Surik',
});

const email = ref('');
const code = ref('');
const newPassword = ref('');
const isCodeStep = ref(false);
const formError = ref('');
const successMessage = ref('');

const authApi = useAuthApi();
const authStore = useAuthStore();
const queryClient = useQueryClient();

const forgotPasswordMutation = useMutation({
  mutationFn: (payload: IRequestPasswordResetPayload) => {
    return authApi.forgotPassword(payload);
  },
});

const resetPasswordMutation = useMutation({
  mutationFn: (payload: IResetPasswordPayload) => {
    return authApi.resetPassword(payload);
  },
});

const isBusy = computed(() => {
  return (
    forgotPasswordMutation.isPending.value ||
    resetPasswordMutation.isPending.value
  );
});

const currentStepTitle = computed(() => {
  return isCodeStep.value ? 'Введите код' : 'Сбросить пароль';
});

const currentStepSubtitle = computed(() => {
  return isCodeStep.value
    ? 'Мы отправили код на почту. Подтвердите его и задайте новый пароль.'
    : 'Отправим код подтверждения на вашу почту для смены пароля.';
});

const submitLabel = computed(() => {
  return isCodeStep.value ? 'Сменить пароль' : 'Отправить код';
});

const emailError = computed(() => {
  return !isCodeStep.value ? formError.value : '';
});

const codeError = computed(() => {
  return '';
});

const passwordError = computed(() => {
  return '';
});

const requestResetCode = async (): Promise<void> => {
  await forgotPasswordMutation.mutateAsync({
    email: email.value.trim(),
  });

  isCodeStep.value = true;
  successMessage.value = 'Код отправлен на почту. Проверьте входящие сообщения.';
  formError.value = '';
};

const handleSubmit = async (): Promise<void> => {
  if (isBusy.value) {
    return;
  }

  formError.value = '';

  try {
    if (!isCodeStep.value) {
      await requestResetCode();

      return;
    }

    await resetPasswordMutation.mutateAsync({
      email: email.value.trim(),
      code: code.value.trim(),
      newPassword: newPassword.value,
    });

    authStore.clearUser();
    queryClient.removeQueries({
      queryKey: authQueryKeys.me,
    });

    await navigateTo('/login');
  } catch (error) {
    formError.value = getApiErrorMessage(error, 'Не удалось выполнить сброс пароля');
    successMessage.value = '';
  }
};

const handleResendCode = async (): Promise<void> => {
  if (isBusy.value) {
    return;
  }

  formError.value = '';

  try {
    await requestResetCode();
  } catch (error) {
    formError.value = getApiErrorMessage(error, 'Не удалось отправить код повторно');
    successMessage.value = '';
  }
};
</script>

<style scoped lang="scss" src="./index.scss" />
