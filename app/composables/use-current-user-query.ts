import { useQuery } from '@tanstack/vue-query';

import { authQueryKeys } from '~/constants/auth';
import { useAuthStore } from '~/stores/auth';
import type { IUser } from '~/types/auth';
import { isUnauthorizedApiError } from '~/utils/api-error';

export const useCurrentUserQuery = () => {
  const authApi = useAuthApi();
  const authStore = useAuthStore();

  return useQuery<IUser>({
    queryKey: authQueryKeys.me,
    enabled: import.meta.client,
    queryFn: async () => {
      try {
        const response = await authApi.me();

        authStore.setUser(response.user);

        return response.user;
      } catch (error) {
        if (isUnauthorizedApiError(error)) {
          authStore.clearUser();
        }

        throw error;
      }
    },
  });
};
