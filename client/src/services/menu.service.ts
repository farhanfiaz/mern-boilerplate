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

export const getCurrentActiveTenantWIthPagination = async (params: { page: number; limit: number; search: string }): Promise<any> => {
    const response = await http.get<any>(
        `${ENDPOINTS.TENANTS.CURRENT_ACTIVE_WITH_PAGINATION}?${new URLSearchParams({
            page: params.page.toString(),
            limit: params.limit.toString(),
            search: params.search,
        }).toString()}`
    );
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
};