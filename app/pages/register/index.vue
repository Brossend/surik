<template>
  <div class="register">
    <div class="register__container">
      <div class="register__card">
        <UiMascot />

        <form
          class="register__content"
          @submit.prevent="handleSubmit"
        >
          <span class="register__title">
            Создать аккаунт
          </span>

          <span class="register__subtitle">
            Присоединяйтесь к нашему пространству!
          </span>

          <UiInput
            v-model="nickname"
            autocomplete="username"
            :disabled="isPending"
            label="Никнейм"
            placeholder="noob_master#1337"
            required
            type="nickname"
          />
          <UiInput
            v-model="email"
            autocomplete="email"
            :disabled="isPending"
            :error="formError"
            label="Электронная почта"
            placeholder="pressf@respawn.gg"
            required
            type="email"
          />
          <UiInput
            v-model="password"
            autocomplete="new-password"
            :disabled="isPending"
            label="Пароль"
            placeholder="EZ4ME_2026!"
            required
            type="password"
          />

          <ui-button
            full-width
            :loading="isPending"
            label="Создать аккаунт"
            native-type="submit"
          />

          <span
            v-if="formError"
            class="register__error"
          >
            {{ formError }}
          </span>

          <ui-divider label="или" />

          <span class="register__login">
            Уже есть аккаунт?
            <ui-link
              label="Войти"
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
import type { IRegisterPayload } from '~/types/auth';
import { getApiErrorMessage } from '~/utils/api-error';

useHead({
  title: 'Регистрация — Surik',
});

const email = ref('');
const password = ref('');
const nickname = ref('');
const formError = ref('');

const authApi = useAuthApi();
const authStore = useAuthStore();
const queryClient = useQueryClient();
const route = useRoute();

const registerMutation = useMutation({
  mutationFn: (payload: IRegisterPayload) => authApi.register(payload),
});

const isPending = computed(() => registerMutation.isPending.value);

const handleSubmit = async (): Promise<void> => {
  if (isPending.value) {
    return;
  }

  formError.value = '';

  try {
    const response = await registerMutation.mutateAsync({
      nickname: nickname.value.trim(),
      email: email.value.trim(),
      password: password.value,
    });

    authStore.setUser(response.user);
    queryClient.setQueryData(authQueryKeys.me, response.user);

    const redirectPath =
      typeof route.query.redirect === 'string' &&
      route.query.redirect.startsWith('/')
        ? route.query.redirect
        : '/';

    await navigateTo(redirectPath);
  } catch (error) {
    formError.value = getApiErrorMessage(error, 'Не удалось зарегистрироваться');
  }
};
</script>

<style scoped lang="scss" src="./index.scss" />
