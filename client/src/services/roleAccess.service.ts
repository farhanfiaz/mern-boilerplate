import { ENDPOINTS } from "@/api/endpoints";
import logger from "@/utils/logger";
import { http } from "@/api/http";

export const saveRoleAccess = async (data: any): Promise<any> => {
    const response = await http.post<any>(ENDPOINTS.ROLE_ACCESS.SAVE_ROLE_ACCESS, data);
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
}

export const getAllMenuByRoleId = async (roleId: string): Promise<any> => {
    const response = await http.get<any>(`${ENDPOINTS.ROLE_ACCESS.GET_ALL_MENU_BY_ROLE_ID}/${roleId}`);
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
}

export const getAllMenuByUserId = async (userId: string): Promise<any> => {
    const response = await http.get<any>(`${ENDPOINTS.ROLE_ACCESS.GET_ALL_MENU_BY_USER_ID}/${userId}`);
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
}

export const saveUserRoleAccess = async (data: any): Promise<any> => {
    const response = await http.post<any>(ENDPOINTS.ROLE_ACCESS.SAVE_User_ROLE_ACCESS, data);
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
}