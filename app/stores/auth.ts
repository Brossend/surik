import type { IUser } from '~/types/auth';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<IUser | null>(null);
  const isReady = ref(false);

  const isAuthenticated = computed(() => Boolean(user.value));

  const setUser = (nextUser: IUser | null): void => {
    user.value = nextUser;
    isReady.value = true;
  };

  const clearUser = (): void => {
    user.value = null;
    isReady.value = true;
  };

  const reset = (): void => {
    user.value = null;
    isReady.value = false;
  };

  return {
    user,
    isReady,
    isAuthenticated,
    setUser,
    clearUser,
    reset,
  };
});
