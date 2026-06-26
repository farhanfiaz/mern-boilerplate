import { http } from "@/api/http";
import { AuthResponse, RegisterUser, User } from "../types/auth.types"
import { ENDPOINTS } from "@/api/endpoints";

export const authLogin = async (
  payload: User
): Promise<AuthResponse> => {
  const response = await http.post<AuthResponse>(
    ENDPOINTS.AUTH.LOGIN,
    payload
  );

  if (!response.success) {
    throw new Error(response.message);
  }

  return response.data;
};

export const authRegister = async (payload: RegisterUser): Promise<AuthResponse> => {
  const response = await http.post<AuthResponse>(ENDPOINTS.AUTH.REGISTER, payload);
  if (!response.success) {
    throw new Error(response.message);
  }
  return response.data;
};

export const authRefreshToken = async (refreshToken: string): Promise<AuthResponse> => {
  const response = await http.post<AuthResponse>(ENDPOINTS.AUTH.REFRESH, { refreshToken });
  if (!response.success) {
    throw new Error(response.message);
  }
  return response.data;
};

export const changePasswordByUserId = async ({
  userId,
  currentPassword,
  confirmPassword,
  newPassword,
}: {
  userId: string;
  currentPassword: string;
  confirmPassword: string;
  newPassword: string;
}): Promise<AuthResponse> => {
  const response = await http.post<AuthResponse>(`${ENDPOINTS.USER_MANAGEMENT.CHANGEPASSWORD}/${userId}`, {
    currentPassword,
    confirmPassword,
    newPassword,
  });
  if (!response.success) {
    throw new Error(response.message);
  }
  return response.data;
};

export const resetPasswordByUserId = async ({
  userId,
  resetPassword,
}: {
  userId: string;
  resetPassword: string;
}): Promise<AuthResponse> => {
  const response = await http.post<AuthResponse>(`${ENDPOINTS.USER_MANAGEMENT.RESETPASSWORD}/${userId}`, {
    resetPassword
  });
  if (!response.success) {
    throw new Error(response.message);
  }
  return response.data;
};
