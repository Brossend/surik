import { appendResponseHeader, splitCookiesString } from 'h3';
import type { Pinia } from 'pinia';
import type { IFetchError } from 'ofetch';

import type { ApiClient, ApiFetchOptions } from '~/types/api';
import { useAuthStore } from '~/stores/auth';
import { isUnauthorizedApiError } from '~/utils/api-error';

export default defineNuxtPlugin((nuxtApp) => {
  const authStore = useAuthStore(nuxtApp.$pinia as Pinia | undefined);
  const requestEvent = import.meta.server ? useRequestEvent() : null;
  let refreshPromise: Promise<void> | null = null;

  const forwardSetCookies = (response: Response): void => {
    if (!requestEvent) {
      return;
    }

    const responseHeaders = response.headers as Headers & {
      getSetCookie?: () => string[];
    };
    const rawSetCookieHeader = response.headers.get('set-cookie');
    const setCookies =
      typeof responseHeaders.getSetCookie === 'function'
        ? responseHeaders.getSetCookie()
        : rawSetCookieHeader
          ? splitCookiesString(rawSetCookieHeader)
          : [];

    for (const setCookie of setCookies) {
      appendResponseHeader(requestEvent, 'set-cookie', setCookie);
    }
  };

  const apiBase = $fetch.create({
    baseURL: '/api/v1',
    credentials: 'include',
    retry: 0,
    onRequest: ({ options }) => {
      const headers = new Headers(options.headers);
      const requestHeaders = import.meta.server
        ? useRequestHeaders(['cookie'])
        : null;

      headers.set('accept', 'application/json');

      if (requestHeaders?.cookie) {
        headers.set('cookie', requestHeaders.cookie);
      }

      options.credentials = 'include';
      options.headers = headers;
    },
    onResponseError: ({ options, response }) => {
      const apiOptions = options as ApiFetchOptions;
      const shouldClearSession =
        response.status === 401 &&
        !apiOptions._skipAuthRefresh &&
        apiOptions._isRetry;

      if (shouldClearSession) {
        authStore.clearUser();
      }
    },
  });

  const refreshSession = async (): Promise<void> => {
    if (!refreshPromise) {
      refreshPromise = apiBase.raw('/auth/refresh', {
        method: 'POST',
        _skipAuthRefresh: true,
      })
        .then((response) => {
          forwardSetCookies(response);
        })
        .finally(() => {
          refreshPromise = null;
        });
    }

    return refreshPromise;
  };

  const toFetchOptions = (
    options: ApiFetchOptions,
  ): Omit<ApiFetchOptions, '_skipAuthRefresh' | '_isRetry'> => {
    const {
      _skipAuthRefresh: _unusedSkipAuthRefresh,
      _isRetry: _unusedIsRetry,
      ...fetchOptions
    } = options;

    return fetchOptions;
  };

  const api: ApiClient = async <TResponse>(
    request: string,
    options: ApiFetchOptions = {},
  ): Promise<TResponse> => {
    const fetchOptions = toFetchOptions(options);

    try {
      return await apiBase<TResponse>(request, fetchOptions);
    } catch (error) {
      const fetchError = error as IFetchError;
      const shouldTryRefresh =
        !options._skipAuthRefresh &&
        !options._isRetry &&
        isUnauthorizedApiError(fetchError);

      if (shouldTryRefresh) {
        try {
          await refreshSession();

          const retryOptions = toFetchOptions({
            ...options,
            _isRetry: true,
          });

          return await apiBase<TResponse>(request, {
            ...retryOptions,
          });
        } catch (refreshError) {
          authStore.clearUser();

          throw refreshError;
        }
      }

      throw fetchError;
    }
  };

  return {
    provide: {
      api,
    },
  };
});
