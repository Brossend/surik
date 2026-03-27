import type { IFetchError } from 'ofetch';

import type { IApiErrorPayload } from '~/types/api';

const resolveErrorPayload = (error: unknown): IApiErrorPayload | null => {
  if (!error || typeof error !== 'object') {
    return null;
  }

  const fetchError = error as IFetchError<IApiErrorPayload> & {
    response?: {
      _data?: IApiErrorPayload;
    };
  };

  return fetchError.data ?? fetchError.response?._data ?? null;
};

export const getApiStatusCode = (error: unknown): number | null => {
  if (!error || typeof error !== 'object') {
    return null;
  }

  const fetchError = error as IFetchError<IApiErrorPayload>;

  return (
    fetchError.statusCode ??
    fetchError.status ??
    fetchError.response?.status ??
    resolveErrorPayload(error)?.statusCode ??
    null
  );
};

export const isUnauthorizedApiError = (error: unknown): boolean => {
  return getApiStatusCode(error) === 401;
};

export const getApiErrorMessage = (
  error: unknown,
  fallback = 'Что-то пошло не так',
): string => {
  const payload = resolveErrorPayload(error);
  const message = payload?.message;

  if (Array.isArray(message) && message.length > 0) {
    const firstMessage = message[0];

    if (firstMessage) {
      return firstMessage;
    }
  }

  if (typeof message === 'string' && message.length > 0) {
    return message;
  }

  if (error instanceof Error && error.message.length > 0) {
    return error.message;
  }

  return fallback;
};
