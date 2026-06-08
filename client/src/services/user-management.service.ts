import { http } from "@/api/http";
import { ENDPOINTS } from "@/api/endpoints";
import { GetUserResponse, GetUserParams, User } from "@/types/user-management/user-management.types";

export const getAllUserByTenant = async (params: GetUserParams): Promise<GetUserResponse> => {
    const response = await http.get<GetUserResponse>(`${ENDPOINTS.USER_MANAGEMENT.GET_ALL_USERS}?page=${params.page}&limit=${params.limit}&search=${params.search}&status=${params.status}&roleId=${params.roleId}`);
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
}

export const getUserById = async (id: string): Promise<User> => {
    const response = await http.get<User>(`${ENDPOINTS.USER_MANAGEMENT.GET_USER_BY_ID}/${id}`);
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
}

export const createUser = async (params: User): Promise<User> => {
    const response = await http.post<User>(`${ENDPOINTS.USER_MANAGEMENT.CREATE_USER}`, params);
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
}

export const updateRole = async (id: string, params: User): Promise<User> => {
    const response = await http.put<User>(`${ENDPOINTS.USER_MANAGEMENT.UPDATE_USER}/${id}`, params);
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
}

export const deleteUser = async (id: string): Promise<User> => {
    const response = await http.delete<User>(`${ENDPOINTS.USER_MANAGEMENT.DELETE_USER}/${id}`);
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
}

export const inActiveUser = async (id: string): Promise<User> => {
    const response = await http.put<User>(`${ENDPOINTS.USER_MANAGEMENT.IN_ACTIVE_USER}/${id}`);
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
}
