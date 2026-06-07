import { ENDPOINTS } from "@/api/endpoints";
import { http } from "@/api/http";

export const getUserMenus = async (userId: string, roleId: string): Promise<any> => {
    const response = await http.get<any>(
        `${ENDPOINTS.SIDEBAR.GET_USER_MENUS}?userId=${userId}&roleId=${roleId}`
    );
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
};


export const getCurrentActiveTenant = async (): Promise<any> => {
    const response = await http.get<any>(
        `${ENDPOINTS.TENANTS.CURRENT_ACTIVE}`
    );
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
};