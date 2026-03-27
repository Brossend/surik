import type { ApiClient } from '~/types/api';

export const useApiClient = (): ApiClient => {
  const { $api } = useNuxtApp();

  return $api as ApiClient;
};
