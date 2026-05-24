import { http } from "@/api/http";
import { AuthResponse, User } from "../types/auth.types"
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