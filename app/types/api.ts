export interface IApiErrorPayload {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

export type ApiMethod =
  | 'GET'
  | 'HEAD'
  | 'PATCH'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'CONNECT'
  | 'OPTIONS'
  | 'TRACE'
  | 'get'
  | 'head'
  | 'patch'
  | 'post'
  | 'put'
  | 'delete'
  | 'connect'
  | 'options'
  | 'trace';

export interface ApiFetchOptions {
  method?: ApiMethod;
  body?: RequestInit['body'] | Record<string, any> | null;
  query?: Record<string, any>;
  headers?: HeadersInit;
  credentials?: RequestCredentials;
  baseURL?: string;
  retry?: number | false;
  timeout?: number;
  ignoreResponseError?: boolean;
  _skipAuthRefresh?: boolean;
  _isRetry?: boolean;
}

export type ApiClient = <TResponse>(
  request: string,
  options?: ApiFetchOptions,
) => Promise<TResponse>;
