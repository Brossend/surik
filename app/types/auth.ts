export interface IUser {
  id: string;
  email: string;
  nickname: string;
  createdAt: string;
}

export interface IAuthResponse {
  user: IUser;
}

export interface ISuccessResponse {
  success: boolean;
}

export interface ILoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface IRegisterPayload extends ILoginPayload {
  nickname: string;
}

export interface IRequestPasswordResetPayload {
  email: string;
}

export interface IResetPasswordPayload {
  email: string;
  code: string;
  newPassword: string;
}
