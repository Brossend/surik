import type {
  IAuthResponse,
  ILoginPayload,
  IRequestPasswordResetPayload,
  IRegisterPayload,
  IResetPasswordPayload,
  ISuccessResponse,
} from '~/types/auth';

export const useAuthApi = () => {
  const api = useApiClient();

  const login = (payload: ILoginPayload): Promise<IAuthResponse> => {
    return api('/auth/login', {
      method: 'POST',
      body: payload,
      _skipAuthRefresh: true,
    });
  };

  const register = (payload: IRegisterPayload): Promise<IAuthResponse> => {
    return api('/auth/register', {
      method: 'POST',
      body: payload,
      _skipAuthRefresh: true,
    });
  };

  const me = (): Promise<IAuthResponse> => {
    return api('/auth/me');
  };

  const refresh = (): Promise<IAuthResponse> => {
    return api('/auth/refresh', {
      method: 'POST',
      _skipAuthRefresh: true,
    });
  };

  const logout = (): Promise<ISuccessResponse> => {
    return api('/auth/logout', {
      method: 'POST',
      _skipAuthRefresh: true,
    });
  };

  const forgotPassword = (
    payload: IRequestPasswordResetPayload,
  ): Promise<ISuccessResponse> => {
    return api('/auth/forgot-password', {
      method: 'POST',
      body: payload,
      _skipAuthRefresh: true,
    });
  };

  const resetPassword = (
    payload: IResetPasswordPayload,
  ): Promise<ISuccessResponse> => {
    return api('/auth/reset-password', {
      method: 'POST',
      body: payload,
      _skipAuthRefresh: true,
    });
  };

  return {
    login,
    register,
    me,
    refresh,
    logout,
    forgotPassword,
    resetPassword,
  };
};
