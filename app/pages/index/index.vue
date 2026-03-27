<template>
  <div class="home">
    <div class="home__card">
      <span class="home__eyebrow">
        Главная
      </span>

      <h1 class="home__title">
        Профиль пользователя
      </h1>

      <p class="home__subtitle">
        Здесь подтягивается ответ из `GET /api/v1/auth/me`.
      </p>

      <div
        v-if="isLoading"
        class="home__state"
      >
        Загружаем данные пользователя...
      </div>

      <div
        v-else-if="currentUser"
        class="home__profile"
      >
        <div class="home__row">
          <span class="home__label">ID</span>
          <span class="home__value">{{ currentUser.id }}</span>
        </div>

        <div class="home__row">
          <span class="home__label">Никнейм</span>
          <span class="home__value">{{ currentUser.nickname }}</span>
        </div>

        <div class="home__row">
          <span class="home__label">Email</span>
          <span class="home__value">{{ currentUser.email }}</span>
        </div>

        <div class="home__row">
          <span class="home__label">Создан</span>
          <span class="home__value">{{ formattedCreatedAt }}</span>
        </div>

        <div class="home__toolbar">
          <ui-button
            :disabled="isRefreshing || isLoggingOut"
            :loading="isRefreshing"
            label="Обновить профиль"
            @click="handleRefetch"
          />
          <ui-button
            :disabled="isRefreshing || isLoggingOut"
            :loading="isLoggingOut"
            label="Выйти"
            @click="handleLogout"
          />
        </div>
      </div>

      <div
        v-else
        class="home__state"
      >
        <span>
          Пользователь не авторизован. Войди или создай аккаунт, и здесь появятся данные из `me`.
        </span>

        <div class="home__actions">
          <ui-link
            label="Войти"
            to="/login"
          />
          <ui-link
            label="Регистрация"
            to="/register"
          />
        </div>
      </div>

      <p
        v-if="finalError"
        class="home__error"
      >
        {{ finalError }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useMutation, useQueryClient } from '@tanstack/vue-query';

import UiButton from '~/components/ui/ui-button/ui-button.vue';
import UiLink from '~/components/ui/ui-link/ui-link.vue';
import { authQueryKeys } from '~/constants/auth';
import { useAuthApi } from '~/composables/use-auth-api';
import { useCurrentUserQuery } from '~/composables/use-current-user-query';
import { useAuthStore } from '~/stores/auth';
import { getApiErrorMessage, isUnauthorizedApiError } from '~/utils/api-error';

definePageMeta({
  middleware: 'auth',
});

useHead({
  title: 'Главная — Surik',
});

const authApi = useAuthApi();
const authStore = useAuthStore();
const meQuery = useCurrentUserQuery();
const queryClient = useQueryClient();
const actionError = ref('');

const logoutMutation = useMutation({
  mutationFn: () => authApi.logout(),
});

const currentUser = computed(() => meQuery.data.value ?? authStore.user);

const isLoading = computed(() => {
  return meQuery.isPending.value && !currentUser.value;
});

const isRefreshing = computed(() => meQuery.isFetching.value);
const isLoggingOut = computed(() => logoutMutation.isPending.value);

const formattedCreatedAt = computed(() => {
  if (!currentUser.value) {
    return '';
  }

  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(currentUser.value.createdAt));
});

const requestError = computed(() => {
  if (!meQuery.error.value || isUnauthorizedApiError(meQuery.error.value)) {
    return '';
  }

  return getApiErrorMessage(
    meQuery.error.value,
    'Не удалось загрузить данные пользователя',
  );
});

const finalError = computed(() => actionError.value || requestError.value);

const handleRefetch = (): void => {
  actionError.value = '';
  void meQuery.refetch();
};

const handleLogout = async (): Promise<void> => {
  if (isLoggingOut.value) {
    return;
  }

  actionError.value = '';

  try {
    await logoutMutation.mutateAsync();

    authStore.clearUser();
    queryClient.removeQueries({
      queryKey: authQueryKeys.me,
    });

    await navigateTo('/login');
  } catch (error) {
    actionError.value = getApiErrorMessage(error, 'Не удалось выйти из аккаунта');
  }
};
</script>

<style scoped lang="scss" src="./index.scss" />
