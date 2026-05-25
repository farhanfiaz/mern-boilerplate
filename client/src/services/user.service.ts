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
}