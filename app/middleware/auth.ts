import { useAuthApi } from '~/composables/use-auth-api';
import { useAuthStore } from '~/stores/auth';
import { isUnauthorizedApiError } from '~/utils/api-error';

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();

  if (authStore.user) {
    return;
  }

  const authApi = useAuthApi();

  try {
    const response = await authApi.me();

    authStore.setUser(response.user);
  } catch (error) {
    if (!isUnauthorizedApiError(error)) {
      throw error;
    }

    authStore.clearUser();

    return navigateTo({
      path: '/login',
      query: {
        redirect: to.fullPath,
      },
    });
  }
});
