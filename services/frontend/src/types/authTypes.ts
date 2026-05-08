import type { AuthUser } from "./userTypes";

export interface AuthSuccessResponse {
  status: "success";
  data: AuthUser;
}

export interface AuthErrorResponse {
  status: "error";
  message: string;
  code: number;
}

export interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
}

// Password Reset Types
export interface ForgotPasswordActionError {
  status: "error";
  message: string;
}

export interface ForgotPasswordActionSuccess {
  status: "success";
  message: string;
}

export interface ResetPasswordActionError {
  status: "error";
  message: string;
}

export interface ResetPasswordActionSuccess {
  status: "success";
  message: string;
}

// Axios Error type for catch blocks
export interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
  message: string;
}
