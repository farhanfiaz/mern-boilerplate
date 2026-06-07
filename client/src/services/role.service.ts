import { http } from "@/api/http";
import { ENDPOINTS } from "@/api/endpoints";
import { Role, AllRoles } from "@/types/role/role.types";

export const getAllRoles = async (): Promise<AllRoles> => {
    const response = await http.get<AllRoles>(ENDPOINTS.ROLE.GET_ALL_ROLES);
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
}

export const getRoleById = async (id: string): Promise<Role> => {
    const response = await http.get<Role>(ENDPOINTS.ROLE.GET_ROLE_BY_ID + '/' + id);
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
}

export const createRole = async (role: Role): Promise<Role> => {
    const response = await http.post<Role>(ENDPOINTS.ROLE.CREATE_ROLE, role);
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
}

export const updateRole = async (id: string, role: Role): Promise<Role> => {
    const response = await http.put<Role>(ENDPOINTS.ROLE.UPDATE_ROLE + '/' + id, role);
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
}

export const deleteRole = async (id: string): Promise<Role> => {
    const response = await http.delete<Role>(ENDPOINTS.ROLE.DELETE_ROLE + '/' + id);
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
}

export const inActiveRole = async (id: string): Promise<Role> => {
    const response = await http.put<Role>(ENDPOINTS.ROLE.IN_ACTIVE_ROLE + '/' + id);
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
}
