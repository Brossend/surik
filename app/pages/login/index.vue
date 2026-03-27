<template>
  <div class="login">
    <div class="login__container">
      <div class="login__card">
        <UiMascot />

        <form
          class="login__content"
          @submit.prevent="handleSubmit"
        >
          <span class="login__title">
            С возвращением
          </span>

          <span class="login__subtitle">
            Мы рады видеть вас снова!
          </span>

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
            autocomplete="current-password"
            :disabled="isPending"
            label="Пароль"
            placeholder="EZ4ME_2026!"
            required
            type="password"
          />
          <div class="login__subform">
            <ui-checkbox
              v-model="rememberMe"
              :disabled="isPending"
              label="Запомнить меня"
            />
            <ui-link
              label="Забыли пароль?"
              to="/forgot-password"
            />
          </div>
          <ui-button
            full-width
            :loading="isPending"
            label="Войти"
            native-type="submit"
          />

          <span
            v-if="formError"
            class="login__error"
          >
            {{ formError }}
          </span>

          <ui-divider label="или" />

          <span class="login__registration">
            Нет аккаунта?
            <ui-link
              label="Зарегистрироваться"
              to="/register"
            />
          </span>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useMutation, useQueryClient } from '@tanstack/vue-query';

import UiButton from '~/components/ui/ui-button/ui-button.vue';
import UiCheckbox from '~/components/ui/ui-checkbox/ui-checkbox.vue';
import UiDivider from '~/components/ui/ui-divider/ui-divider.vue';
import UiInput from '~/components/ui/ui-input/ui-input.vue';
import UiLink from '~/components/ui/ui-link/ui-link.vue';
import UiMascot from '~/components/ui/ui-mascot/ui-mascot.vue';
import { authQueryKeys } from '~/constants/auth';
import { useAuthApi } from '~/composables/use-auth-api';
import { useAuthStore } from '~/stores/auth';
import type { ILoginPayload } from '~/types/auth';
import { getApiErrorMessage } from '~/utils/api-error';

useHead({
  title: 'Вход — Surik',
});

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const formError = ref('');

const authApi = useAuthApi();
const authStore = useAuthStore();
const queryClient = useQueryClient();
const route = useRoute();

const loginMutation = useMutation({
  mutationFn: (payload: ILoginPayload) => authApi.login(payload),
});

const isPending = computed(() => loginMutation.isPending.value);

const handleSubmit = async (): Promise<void> => {
  if (isPending.value) {
    return;
  }

  formError.value = '';

  try {
    const response = await loginMutation.mutateAsync({
      email: email.value.trim(),
      password: password.value,
      rememberMe: rememberMe.value,
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
    formError.value = getApiErrorMessage(error, 'Не удалось войти');
  }
};
</script>

<style lang="scss" scoped src="./index.scss" />
