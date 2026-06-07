import { ENDPOINTS } from "@/api/endpoints";
import { http } from "@/api/http";
import { PaginatedTenants } from "@/types/tenant/tenant.types";

export const getAllTenants = async (
    page: number = 1,
    limit: number = 10,
    search: string = ""
): Promise<PaginatedTenants> => {
    const response = await http.get<PaginatedTenants>(
        `${ENDPOINTS.TENANTS.GET_ALL_TENANTS}?page=${page}&limit=${limit}&search=${search}`
    );

    if (!response.success) {
        throw new Error(response.message);
    }

    return response.data;
};

export const editTenant = async (
    id: string,
    name: string,
    slug: string,
    description: string,
    website: string,
    logo: string
): Promise<void> => {
    const response = await http.put<void>(`${ENDPOINTS.TENANTS.EDIT_TENANT}/${id}`, {
        name,
        slug,
        description,
        website,
        logo,
    });

    if (!response.success) {
        throw new Error(response.message);
    }
};

export const createTenant = async (
    name: string,
    slug: string,
    description: string,
    website: string,
    logo: string
): Promise<void> => {
    const response = await http.post<void>(ENDPOINTS.TENANTS.CREATE_TENANT, {
        name,
        slug,
        description,
        website,
        logo,
    });

    if (!response.success) {
        throw new Error(response.message);
    }
};

export const deleteTenant = async (
    id: string
): Promise<void> => {
    const response = await http.delete<void>(`${ENDPOINTS.TENANTS.DELETE_TENANT}/${id}`);

    if (!response.success) {
        throw new Error(response.message);
    }
};

export const inActiveTenant = async (
    id: string
): Promise<void> => {
    const response = await http.put<void>(`${ENDPOINTS.TENANTS.IN_ACTIVE_TENANT}/${id}`);

    if (!response.success) {
        throw new Error(response.message);
    }
};